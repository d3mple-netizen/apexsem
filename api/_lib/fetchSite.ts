import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { isValidPublicHostname } from '../../src/lib/engine.js';

const MAX_BYTES = 1_500_000;
const MAX_REDIRECTS = 5;
// Audit what a human visitor sees: several sites serve bots a stripped
// markdown variant, which would make the landing-page checks meaningless.
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

export class FetchSiteError extends Error {}

/** Minimal markdown to HTML so sites that only serve markdown still yield headings and links. */
function markdownToHtml(md: string): string {
  const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const inline = (t: string) => esc(t).replace(/\[([^\]]+)\]\(([^)\s]+)[^)]*\)/g, '<a href="$2">$1</a>');
  const lines = md.split(/\r?\n/);
  const title = lines.find((l) => /^#\s/.test(l))?.replace(/^#\s+/, '') ?? '';
  const body = lines
    .map((l) => {
      const h = l.match(/^(#{1,3})\s+(.*)$/);
      if (h) return `<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`;
      return l.trim() ? `<p>${inline(l)}</p>` : '';
    })
    .join('\n');
  return `<html><head><title>${esc(title)}</title></head><body>${body}</body></html>`;
}

function isPrivateAddress(addr: string): boolean {
  if (isIP(addr) === 4) {
    const [a, b] = addr.split('.').map(Number);
    return (
      a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19))
    );
  }
  const v6 = addr.toLowerCase();
  if (v6 === '::' || v6 === '::1') return true;
  if (v6.startsWith('fc') || v6.startsWith('fd') || v6.startsWith('fe8') || v6.startsWith('fe9') || v6.startsWith('fea') || v6.startsWith('feb')) return true;
  const mapped = v6.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  return mapped ? isPrivateAddress(mapped[1]) : false;
}

/** Blocks SSRF: the host must be a public DNS name resolving to public IPs. */
async function assertPublicHost(hostname: string): Promise<void> {
  const host = hostname.toLowerCase();
  if (isIP(host) || !isValidPublicHostname(host)) throw new FetchSiteError(`"${host}" is not a public domain name.`);
  let addrs: { address: string }[];
  try {
    addrs = await lookup(host, { all: true });
  } catch {
    throw new FetchSiteError(`DNS lookup failed for ${host} — check the domain spelling.`);
  }
  if (!addrs.length || addrs.some((a) => isPrivateAddress(a.address))) {
    throw new FetchSiteError(`${host} resolves to a private network address.`);
  }
}

async function readCapped(res: Response): Promise<string> {
  if (!res.body) return '';
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (total < MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.byteLength;
  }
  await reader.cancel().catch(() => {});
  const buf = new Uint8Array(Math.min(total, MAX_BYTES));
  let off = 0;
  for (const c of chunks) {
    const slice = c.subarray(0, Math.min(c.byteLength, buf.byteLength - off));
    buf.set(slice, off);
    off += slice.byteLength;
    if (off >= buf.byteLength) break;
  }
  return new TextDecoder('utf-8', { fatal: false }).decode(buf);
}

export interface FetchedPage {
  html: string;
  finalUrl: string;
  status: number;
  responseMs: number;
}

async function fetchFollowing(startUrl: string, deadline: number): Promise<FetchedPage> {
  let url = new URL(startUrl);
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new FetchSiteError('Redirected to an unsupported protocol.');
    if (url.port && url.port !== '80' && url.port !== '443') throw new FetchSiteError('Redirected to a non-standard port.');
    await assertPublicHost(url.hostname);
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new FetchSiteError('Timed out loading the homepage.');
    const started = Date.now();
    const res = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(remaining),
      headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.5', 'accept-language': 'en-US,en;q=0.8' }
    });
    const responseMs = Date.now() - started;
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get('location');
      if (!loc) throw new FetchSiteError(`Redirect (${res.status}) without a location.`);
      url = new URL(loc, url);
      continue;
    }
    if (!res.ok) throw new FetchSiteError(`Homepage returned HTTP ${res.status}${res.status === 403 || res.status === 429 ? ' (the site blocks automated visits)' : ''}.`);
    const type = res.headers.get('content-type') ?? '';
    const isMarkdown = /markdown|text\/plain/i.test(type);
    if (type && !isMarkdown && !/html|xml/i.test(type)) throw new FetchSiteError(`Homepage is not HTML (${type.split(';')[0]}).`);
    const raw = await readCapped(res);
    const html = isMarkdown ? markdownToHtml(raw) : raw;
    return { html, finalUrl: url.toString(), status: res.status, responseMs };
  }
  throw new FetchSiteError('Too many redirects.');
}

/** Fetches the homepage for a bare domain, trying https, www, then http. */
export async function fetchHomepage(domain: string, budgetMs = 9_000): Promise<FetchedPage> {
  const deadline = Date.now() + budgetMs;
  const candidates = [`https://${domain}/`, `https://www.${domain}/`, `http://${domain}/`];
  let lastError: unknown;
  for (const candidate of candidates) {
    try {
      return await fetchFollowing(candidate, deadline);
    } catch (err) {
      lastError = err;
      // Deterministic failures won't improve on another scheme/host variant.
      if (err instanceof FetchSiteError && /DNS|public domain|private network|HTTP 4/.test(err.message)) break;
      if (Date.now() >= deadline) break;
    }
  }
  if (lastError instanceof FetchSiteError) throw lastError;
  const msg = lastError instanceof Error && lastError.name === 'TimeoutError' ? 'Timed out loading the homepage.' : 'Could not connect to the site.';
  throw new FetchSiteError(msg);
}
