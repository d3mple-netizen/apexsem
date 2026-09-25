import type Anthropic from '@anthropic-ai/sdk';
import { getClaude, MODEL } from './_lib/claude.js';
import { json, rateLimited } from './_lib/http.js';
import { perplexityAvailable, pplxFetch, sseDeltas, citationStripper, PPLX_MODEL, PPLX_TIMEOUT_MS } from './_lib/perplexity.js';

const PERSONA = `You are ApexSEM, an elite SEM and SEO strategist who has run eight-figure Google Ads programs for B2B SaaS and e-commerce brands. You are talking to the owner or marketer of the domain described in <analysis>.

How you answer:
- Lead with the single most useful move in one sentence, then 2-4 numbered steps. Start each step with a short bold lead-in, e.g. "1. **Split exact match into its own ad group**: ...".
- Be concrete: real keyword strings, match types, bid or budget numbers, character counts for ad copy, expected ranges (CTR, CPC, conversion rate). Show the math when you estimate money.
- Use the analysis data (keywords, CPCs, competitors, findings) by name instead of generic advice.
- When you give something the user can paste (ad copy, negative keyword list, JSON-LD, formula), put it in exactly one fenced code block at the end.
- Google Ads limits: headlines max 30 characters, descriptions max 90. Count carefully.
- Plain text with **bold** only; no markdown headings or tables. Keep it under 250 words unless asked for more.
- Traffic and volume numbers in <analysis> are modeled estimates, not Google Ads account data; say so if the user relies on them for a budget decision.
- Answer in the language of the user's question (a question in Russian gets an answer in Russian). Keep keyword strings and ad copy in the language of the target market unless asked otherwise.
- If a question is outside search marketing, CRO or analytics, answer briefly and steer back.
- Never add citation markers like [1] or a list of sources.`;

const MAX_TURNS = 12;
const MAX_CHARS = 4000;

type Turn = { role: 'user' | 'assistant'; content: string };

function parseTurns(raw: unknown): Turn[] | null {
  if (!Array.isArray(raw)) return null;
  const turns: Turn[] = raw
    .filter((m): m is Turn => !!m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim() !== '')
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_TURNS);
  while (turns.length && turns[0].role !== 'user') turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== 'user') return null;
  return turns;
}

const TEXT_HEADERS = { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' };
const DROPPED = '\n\n[The model connection dropped mid-answer. Send the question again.]';

function activeModel(): { provider: 'perplexity' | 'claude'; model: string } | null {
  if (perplexityAvailable()) return { provider: 'perplexity', model: PPLX_MODEL };
  if (getClaude()) return { provider: 'claude', model: MODEL };
  return null;
}

export async function GET(): Promise<Response> {
  const active = activeModel();
  return json({ available: !!active, provider: active?.provider ?? null, model: active?.model ?? null });
}

/** Perplexity Sonar, streamed. Returns null if it fails before the first token. */
async function streamPerplexity(system: string, turns: Turn[]): Promise<Response | null> {
  const controller = new AbortController();
  // The 20 s budget covers the time to the first token; a live answer may
  // keep streaming after that, capped well inside the 60 s function limit.
  const firstTokenTimer = setTimeout(() => controller.abort(), PPLX_TIMEOUT_MS);
  const hardCap = setTimeout(() => controller.abort(), 55_000);
  let deltas: AsyncGenerator<string>;
  let first: IteratorResult<string>;
  try {
    const res = await pplxFetch({ messages: [{ role: 'system', content: system }, ...turns], maxTokens: 1500, temperature: 0.3, stream: true, signal: controller.signal });
    if (!res.body) throw new Error('Perplexity returned no body');
    deltas = sseDeltas(res.body);
    first = await deltas.next();
    if (first.done) throw new Error('Perplexity stream ended without text');
  } catch (err) {
    clearTimeout(hardCap);
    console.error('Perplexity chat failed:', err instanceof Error ? err.message : err);
    return null;
  } finally {
    clearTimeout(firstTokenTimer);
  }

  const encoder = new TextEncoder();
  const strip = citationStripper();
  const body$ = new ReadableStream<Uint8Array>({
    async start(controller$) {
      const emit = (t: string) => t && controller$.enqueue(encoder.encode(t));
      try {
        emit(strip.push(first.value));
        for (let r = await deltas.next(); !r.done; r = await deltas.next()) emit(strip.push(r.value));
        emit(strip.flush());
      } catch (err) {
        console.error('Perplexity chat stream interrupted:', err instanceof Error ? err.message : err);
        emit(strip.flush() + DROPPED);
      } finally {
        clearTimeout(hardCap);
        controller$.close();
      }
    },
    cancel() {
      clearTimeout(hardCap);
      controller.abort();
    }
  });
  return new Response(body$, { headers: { ...TEXT_HEADERS, 'x-model': PPLX_MODEL, 'x-provider': 'perplexity' } });
}

/** Claude, streamed. Returns null if it fails before the first event. */
async function streamClaude(claude: Anthropic, system: string, turns: Turn[]): Promise<Response | null> {
  const stream = claude.messages.stream({
    model: MODEL,
    max_tokens: 1500,
    system,
    messages: turns as Anthropic.MessageParam[]
  });
  const events = stream[Symbol.asyncIterator]();

  // Wait for the first event so auth/model errors fall through cleanly
  // instead of a stream that dies immediately.
  let first: IteratorResult<Anthropic.MessageStreamEvent>;
  try {
    first = await events.next();
  } catch (err) {
    console.error('Claude chat failed:', err instanceof Error ? err.message : err);
    return null;
  }

  const encoder = new TextEncoder();
  const emit = (ev: Anthropic.MessageStreamEvent, controller: ReadableStreamDefaultController<Uint8Array>) => {
    if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta') controller.enqueue(encoder.encode(ev.delta.text));
  };

  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (!first.done) emit(first.value, controller);
        for (let r = await events.next(); !r.done; r = await events.next()) emit(r.value, controller);
      } catch (err) {
        console.error('Claude chat stream interrupted:', err instanceof Error ? err.message : err);
        controller.enqueue(encoder.encode(DROPPED));
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    }
  });

  return new Response(body$, { headers: { ...TEXT_HEADERS, 'x-model': MODEL, 'x-provider': 'claude' } });
}

// Order: Perplexity Sonar -> Claude -> 503/502, on which the client answers
// from its built-in rule-based playbooks.
export async function POST(request: Request): Promise<Response> {
  const claude = getClaude();
  if (!perplexityAvailable() && !claude) return json({ error: 'llm_unavailable' }, 503);

  let body: { messages?: unknown; context?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Request body must be JSON.' }, 400);
  }
  const turns = parseTurns(body.messages);
  if (!turns) return json({ error: 'messages must end with a user turn.' }, 400);
  const context = typeof body.context === 'string' ? body.context.slice(0, 6000) : '';

  if (rateLimited(request, 'chat', 30, 10 * 60_000)) {
    return json({ error: 'Too many messages. Wait a few minutes and try again.' }, 429);
  }

  const system = `${PERSONA}\n\n<analysis>\n${context || '(no analysis loaded yet)'}\n</analysis>`;
  if (perplexityAvailable()) {
    const res = await streamPerplexity(system, turns);
    if (res) return res;
  }
  if (claude) {
    const res = await streamClaude(claude, system, turns);
    if (res) return res;
  }
  return json({ error: 'llm_error' }, 502);
}
