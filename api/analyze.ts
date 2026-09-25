import { buildAnalysis, cleanDomain, extractSignals, isValidPublicHostname, fitChars } from '../src/lib/engine.js';
import type { AiEnrichment, SiteSignals } from '../src/lib/engine.js';
import type { AnalysisSource } from '../src/types/index.js';
import { fetchHomepage, FetchSiteError } from './_lib/fetchSite.js';
import { getClaude, MODEL, parseJsonObject, textOf } from './_lib/claude.js';
import { json, rateLimited } from './_lib/http.js';
import { perplexityAvailable, pplxComplete } from './_lib/perplexity.js';
import { verifyUser } from './_lib/auth.js';

const SYSTEM = `You are a senior paid-search and SEO strategist who has managed eight-figure Google Ads budgets.
You receive facts scraped from a company's homepage and return a compact JSON brief used to build its SEM strategy.
Rules:
- Base everything on the supplied facts. When the crawl failed, infer from the domain and your own knowledge, and stay conservative.
- Keywords are real search queries a buyer would type (lowercase, 2-6 words). Volumes and CPCs are your best US-market estimates as integers / dollars.
- Competitors must be real companies with their real domains. Never invent placeholder names.
- Ad headlines max 30 characters, descriptions max 90 characters. No exclamation marks, no superlatives you cannot back up.
- Output only the JSON object. No prose, no code fences.`;

const SCHEMA_HINT = `{
  "niche": "short market label, e.g. 'Issue Tracking & Product Development SaaS'",
  "category": "2-3 word lowercase noun for the product type, e.g. 'issue tracker'",
  "tagline": "one sentence, what they sell and to whom",
  "targetAudience": "comma-separated buyer roles or customer segments",
  "avgCpc": 0.0,
  "keywords": [{"keyword": "", "intent": "Transactional|Commercial|Informational|Competitor Conquest", "monthlyVolume": 0, "cpc": 0.0, "competition": "Low|Medium|High", "difficulty": 0, "recommendedAction": "one sentence"}],
  "competitors": [{"name": "", "domain": "", "topPaidKeywords": [""], "vulnerabilities": ["short phrase"]}],
  "ads": {
    "bofu": {"headlines": ["5 items"], "descriptions": ["2 items"]},
    "conquest": {"headlines": ["5 items"], "descriptions": ["2 items"]},
    "brand": {"headlines": ["3 items"], "descriptions": ["2 items"]}
  },
  "croFindings": [{"issue": "", "solution": "", "severity": "high|medium|low"}],
  "heroHeadline": "", "heroSubhead": "", "cta": "",
  "negativeKeywords": ["10 niche-specific negatives"]
}
Return 8 keywords (mix of intents, at least 2 Competitor Conquest naming real competitors), 3 competitors, 3 croFindings about this specific homepage.`;

function describeSite(domain: string, s: SiteSignals | null, fetchError?: string): string {
  if (!s) return `Domain: ${domain}\nCrawl: FAILED (${fetchError ?? 'unknown error'}). Use what you know about this domain; if unknown, infer from the name.`;
  return [
    `Domain: ${domain} (final URL ${s.finalUrl}, HTTP ${s.status}, ${s.responseMs} ms)`,
    `Title: ${s.title || '(none)'}`,
    `Meta description: ${s.description || '(none)'}`,
    `OG title / site name: ${s.ogTitle || '-'} / ${s.siteName || '-'}`,
    `H1: ${s.h1.join(' | ') || '(none)'}`,
    `H2: ${s.h2.join(' | ') || '(none)'}`,
    `Top phrases on page: ${s.topPhrases.join(', ')}`,
    `Signals: pricing link=${s.hasPricingLink}, signup CTA=${s.hasSignupCta}, demo CTA=${s.hasDemoCta}, social proof=${s.hasSocialProof}, JSON-LD=${s.jsonLdTypes.join(',') || 'none'}, words=${s.wordCount}, form inputs=${s.formInputs}`,
    `Visible text sample:\n${s.textSample.slice(0, 2500)}`
  ].join('\n');
}

const INTENTS = ['Transactional', 'Commercial', 'Informational', 'Competitor Conquest'] as const;
const LEVELS = ['Low', 'Medium', 'High'] as const;
const SEVERITIES = ['high', 'medium', 'low'] as const;

const str = (v: unknown, max: number): string | undefined => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined);
const num = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) ? v : typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v)) ? Number(v) : undefined);
const strArr = (v: unknown, maxItems: number, maxLen: number): string[] =>
  Array.isArray(v) ? v.map((x) => str(x, maxLen)).filter((x): x is string => !!x).slice(0, maxItems) : [];
const oneOf = <T extends string>(v: unknown, allowed: readonly T[], fb: T): T => (allowed as readonly string[]).includes(v as string) ? (v as T) : fb;
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {});

/** Validates model output field by field; anything malformed is dropped. */
function sanitize(raw: unknown): AiEnrichment {
  const r = obj(raw);
  const ads = obj(r.ads);
  const adSet = (v: unknown) => {
    const o = obj(v);
    const headlines = strArr(o.headlines, 8, 60).map((h) => fitChars(h, 30));
    const descriptions = strArr(o.descriptions, 4, 150).map((d) => fitChars(d, 90));
    return headlines.length ? { headlines, descriptions } : undefined;
  };
  return {
    niche: str(r.niche, 80),
    category: str(r.category, 40)?.toLowerCase(),
    tagline: str(r.tagline, 200),
    targetAudience: str(r.targetAudience, 160),
    avgCpc: num(r.avgCpc),
    keywords: Array.isArray(r.keywords)
      ? r.keywords
          .map(obj)
          .filter((k) => str(k.keyword, 80))
          .slice(0, 10)
          .map((k) => ({
            keyword: str(k.keyword, 80)!,
            intent: oneOf(k.intent, INTENTS, 'Commercial'),
            monthlyVolume: Math.round(num(k.monthlyVolume) ?? 500),
            cpc: num(k.cpc) ?? 0,
            competition: oneOf(k.competition, LEVELS, 'Medium'),
            difficulty: Math.round(num(k.difficulty) ?? 50),
            recommendedAction: str(k.recommendedAction, 200) ?? ''
          }))
      : undefined,
    competitors: Array.isArray(r.competitors)
      ? r.competitors
          .map(obj)
          .filter((c) => str(c.name, 60) && str(c.domain, 80))
          .slice(0, 3)
          .map((c) => ({
            name: str(c.name, 60)!,
            domain: str(c.domain, 80)!.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
            topPaidKeywords: strArr(c.topPaidKeywords, 4, 60),
            vulnerabilities: strArr(c.vulnerabilities, 3, 120)
          }))
      : undefined,
    ads: { bofu: adSet(ads.bofu), conquest: adSet(ads.conquest), brand: adSet(ads.brand) },
    croFindings: Array.isArray(r.croFindings)
      ? r.croFindings
          .map(obj)
          .filter((f) => str(f.issue, 240) && str(f.solution, 240))
          .slice(0, 4)
          .map((f) => ({ issue: str(f.issue, 240)!, solution: str(f.solution, 240)!, severity: oneOf(f.severity, SEVERITIES, 'medium') }))
      : undefined,
    heroHeadline: str(r.heroHeadline, 90),
    heroSubhead: str(r.heroSubhead, 200),
    cta: str(r.cta, 40),
    negativeKeywords: strArr(r.negativeKeywords, 20, 40)
  };
}

// Perplexity Sonar searches the live web, so it gets the market-facts part of
// the brief (niche, real competitors, realistic volumes). Ad copy and CRO stay
// with the crawl-based builder, which keeps the reply small enough for 20 s.
const LIVE_SYSTEM = `You are a senior paid-search strategist with live web access. Research the given company on the web and return market facts for a Google Ads plan.
Rules:
- Use the web to identify what the company actually sells and its real direct competitors (real companies with their real root domains, never placeholders, never the company itself).
- Keywords are real search queries a buyer would type (lowercase, 2-6 words). monthlyVolume and cpc are realistic US-market estimates: integers for volume, dollars for CPC, consistent with what keyword tools typically report for that niche. When unsure, stay conservative.
- Output only one JSON object. No prose, no markdown, no code fences, no citation markers.`;

const LIVE_SCHEMA = `{
  "niche": "short market label, e.g. 'Issue Tracking & Product Development SaaS'",
  "category": "2-3 word lowercase noun for the product type",
  "tagline": "one sentence, what they sell and to whom",
  "targetAudience": "comma-separated buyer roles or customer segments",
  "avgCpc": 0.0,
  "keywords": [{"keyword": "", "intent": "Transactional|Commercial|Informational|Competitor Conquest", "monthlyVolume": 0, "cpc": 0.0, "competition": "Low|Medium|High", "difficulty": 0, "recommendedAction": "one short sentence"}],
  "competitors": [{"name": "", "domain": "", "topPaidKeywords": [""], "vulnerabilities": ["short phrase"]}],
  "negativeKeywords": ["8 niche-specific negatives"]
}
Return 8 keywords (mix of intents, at least 2 Competitor Conquest naming real competitors) and 2-3 competitors.`;

async function enrichLive(domain: string, signals: SiteSignals | null, fetchError?: string): Promise<AiEnrichment | null> {
  if (!perplexityAvailable()) return null;
  try {
    const text = await pplxComplete({
      maxTokens: 1800,
      temperature: 0.1,
      messages: [
        { role: 'system', content: LIVE_SYSTEM },
        { role: 'user', content: `${describeSite(domain, signals, fetchError).slice(0, 3500)}\n\nReturn JSON with exactly this shape:\n${LIVE_SCHEMA}` }
      ]
    });
    const ai = sanitize(parseJsonObject(text.replace(/\[\d{1,2}\]/g, '')));
    // Only count it as live data if the core market facts came back.
    const self = domain.replace(/^www\./, '');
    ai.competitors = ai.competitors?.filter((c) => c.domain && !c.domain.endsWith(self));
    if (!ai.niche || !ai.keywords?.length) throw new Error('Perplexity JSON missing niche/keywords');
    return ai;
  } catch (err) {
    console.error('Perplexity enrichment failed:', err instanceof Error ? err.message : err);
    return null;
  }
}

async function enrich(domain: string, signals: SiteSignals | null, fetchError?: string): Promise<AiEnrichment | null> {
  const claude = getClaude();
  if (!claude) return null;
  try {
    const message = await claude.messages.create({
      model: MODEL,
      max_tokens: 4000,
      temperature: 0.3,
      system: SYSTEM,
      messages: [{ role: 'user', content: `${describeSite(domain, signals, fetchError)}\n\nReturn JSON with exactly this shape:\n${SCHEMA_HINT}` }]
    });
    if (message.stop_reason === 'refusal') return null;
    return sanitize(parseJsonObject(textOf(message)));
  } catch (err) {
    console.error('Claude enrichment failed:', err instanceof Error ? err.message : err);
    return null;
  }
}

async function handle(rawDomain: unknown, request: Request): Promise<Response> {
  if (typeof rawDomain !== 'string' || !rawDomain.trim() || rawDomain.length > 300) {
    return json({ error: 'Enter a domain like acme.com.' }, 400);
  }
  const domain = cleanDomain(rawDomain);
  if (!isValidPublicHostname(domain)) {
    return json({ error: `"${domain}" doesn't look like a public domain. Try something like acme.com.` }, 400);
  }
  // Analyses are for signed-in users only (the sample report needs no API call).
  const auth = await verifyUser(request);
  if (!auth.ok) return json({ error: 'Sign in with Google to run an analysis.', code: 'auth_required' }, 401);
  if (rateLimited(request, 'analyze', 12, 10 * 60_000)) {
    return json({ error: 'Too many analyses from this network. Wait a few minutes and try again.' }, 429);
  }

  let signals: SiteSignals | null = null;
  let fetchError: string | undefined;
  try {
    const page = await fetchHomepage(domain);
    signals = extractSignals(page.html, { domain, finalUrl: page.finalUrl, status: page.status, responseMs: page.responseMs });
  } catch (err) {
    fetchError = err instanceof FetchSiteError ? err.message : 'Could not load the homepage.';
    // A domain that doesn't resolve is almost always a typo; don't fabricate a report.
    if (/^DNS lookup failed/.test(fetchError)) return json({ error: fetchError }, 422);
  }

  // Perplexity (live web) first, then Claude, then crawl-only heuristics.
  const live = await enrichLive(domain, signals, fetchError);
  const ai = live ?? (await enrich(domain, signals, fetchError));
  const source: AnalysisSource = live ? 'live' : signals ? (ai ? 'crawl+ai' : 'crawl') : ai ? 'ai' : 'estimate';
  return json(buildAnalysis({ domain, signals, ai, source, fetchError }));
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Request body must be JSON: {"domain": "acme.com"}.' }, 400);
  }
  return handle((body as { domain?: unknown })?.domain, request);
}

export async function GET(request: Request): Promise<Response> {
  return handle(new URL(request.url).searchParams.get('domain'), request);
}
