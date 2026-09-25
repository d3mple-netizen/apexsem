// Perplexity Sonar client (OpenAI-compatible chat completions with live web
// search). Server-only: the key is read from process.env and never leaves /api.

export const PPLX_MODEL = process.env.PERPLEXITY_MODEL || 'sonar';
export const PPLX_TIMEOUT_MS = 20_000;
const ENDPOINT = 'https://api.perplexity.ai/chat/completions';

export type PplxMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export function perplexityAvailable(): boolean {
  return !!process.env.PERPLEXITY_API_KEY;
}

interface PplxRequest {
  messages: PplxMessage[];
  maxTokens: number;
  temperature?: number;
  stream?: boolean;
  signal?: AbortSignal;
}

/**
 * Sonar requires strictly alternating user/assistant turns after the system
 * message, so consecutive same-role turns are merged.
 */
export function alternate(messages: PplxMessage[]): PplxMessage[] {
  const out: PplxMessage[] = [];
  for (const m of messages) {
    const prev = out[out.length - 1];
    if (prev && prev.role === m.role && m.role !== 'system') prev.content += `\n\n${m.content}`;
    else out.push({ ...m });
  }
  return out;
}

/** Raw POST; resolves once headers arrive. Throws on non-2xx. */
export async function pplxFetch({ messages, maxTokens, temperature = 0.2, stream = false, signal }: PplxRequest): Promise<Response> {
  const key = process.env.PERPLEXITY_API_KEY;
  if (!key) throw new Error('PERPLEXITY_API_KEY not set');
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json', accept: stream ? 'text/event-stream' : 'application/json' },
    body: JSON.stringify({ model: PPLX_MODEL, messages: alternate(messages), max_tokens: Math.max(16, maxTokens), temperature, stream }),
    signal
  });
  if (!res.ok) {
    const detail = (await res.text().catch(() => '')).slice(0, 300);
    throw new Error(`Perplexity ${res.status}: ${detail}`);
  }
  return res;
}

/** Non-streaming completion with a hard timeout. Returns the reply text. */
export async function pplxComplete(req: Omit<PplxRequest, 'stream' | 'signal'>, timeoutMs = PPLX_TIMEOUT_MS): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await pplxFetch({ ...req, signal: controller.signal });
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = data.choices?.[0]?.message?.content;
    if (typeof text !== 'string' || !text.trim()) throw new Error('Perplexity returned an empty reply');
    return text;
  } finally {
    clearTimeout(timer);
  }
}

/** Yields text deltas from an OpenAI-style SSE body. */
export async function* sseDeltas(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop() ?? '';
      for (const line of lines) {
        const l = line.trim();
        if (!l.startsWith('data:')) continue;
        const payload = l.slice(5).trim();
        if (payload === '[DONE]') return;
        try {
          const delta = JSON.parse(payload).choices?.[0]?.delta?.content;
          if (typeof delta === 'string' && delta) yield delta;
        } catch {
          // Partial or keep-alive line; skip.
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Removes Sonar's inline citation markers ("[1]", "[2][3]") from a token
 * stream. Holds back a trailing "[..." until it can tell whether it is a marker.
 */
export function citationStripper(): { push: (t: string) => string; flush: () => string } {
  let pending = '';
  const clean = (s: string) => s.replace(/\[\d{1,2}\]/g, '');
  return {
    push(t: string) {
      pending += t;
      const open = pending.lastIndexOf('[');
      if (open !== -1 && pending.length - open <= 4 && !pending.slice(open).includes(']')) {
        const out = clean(pending.slice(0, open));
        pending = pending.slice(open);
        return out;
      }
      const out = clean(pending);
      pending = '';
      return out;
    },
    flush() {
      const out = clean(pending);
      pending = '';
      return out;
    }
  };
}
