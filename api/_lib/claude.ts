import Anthropic from '@anthropic-ai/sdk';

// Model is pinned by product decision; override per environment if needed.
export const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5';

let cached: Anthropic | null | undefined;

/** Returns null when ANTHROPIC_API_KEY is not configured (heuristic mode). */
export function getClaude(): Anthropic | null {
  if (cached !== undefined) return cached;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  cached = apiKey ? new Anthropic({ apiKey, maxRetries: 1, timeout: 40_000 }) : null;
  return cached;
}

export function textOf(message: Anthropic.Message): string {
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');
}

/** Pulls the outermost JSON object out of a model reply (tolerates code fences). */
export function parseJsonObject(text: string): unknown {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('No JSON object in model output');
  return JSON.parse(text.slice(start, end + 1));
}
