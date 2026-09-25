import { DomainAnalysis } from '../types';
import { generateAgencyResponse, ChatMessage } from './aiAgency';
import { isMeasured } from '../lib/honest';

/** 'perplexity' and 'claude' both go through /api/chat; the server picks the model. */
export type LlmProvider = 'perplexity' | 'claude' | 'ollama' | 'builtin';

export interface LocalLlmStatus {
  isAvailable: boolean;
  models: string[];
  activeModel: string;
  provider: LlmProvider;
}

const BUILTIN: LocalLlmStatus = {
  isAvailable: false,
  models: ['Built-in SEM playbooks'],
  activeModel: 'Built-in SEM playbooks',
  provider: 'builtin'
};

/** Prefers the hosted model via /api/chat (Perplexity, else Claude), then a local Ollama (dev proxy), then built-in rules. */
export async function checkLocalLlm(): Promise<LocalLlmStatus> {
  try {
    const res = await fetch('/api/chat', { method: 'GET' });
    if (res.ok && (res.headers.get('content-type') ?? '').includes('application/json')) {
      const data = await res.json();
      if (data.available) {
        const provider: LlmProvider = data.provider === 'perplexity' ? 'perplexity' : 'claude';
        return { isAvailable: true, models: [data.model], activeModel: data.model, provider };
      }
    }
  } catch {
    // Not deployed / vercel dev not running; try Ollama next.
  }

  try {
    const res = await fetch('/api/ollama/api/tags', { method: 'GET' });
    if (res.ok && (res.headers.get('content-type') ?? '').includes('application/json')) {
      const data = await res.json();
      const models: string[] = (data.models || []).map((m: { name?: string; model?: string }) => m.name || m.model);
      if (models.length) {
        const activeModel = models.includes('qwen3:14b') ? 'qwen3:14b' : models[0];
        return { isAvailable: true, models, activeModel, provider: 'ollama' };
      }
    }
  } catch {
    // Ollama not running.
  }

  return BUILTIN;
}

/** Compact, model-readable summary of the current analysis. */
export function analysisContext(a: DomainAnalysis): string {
  const lines = [
    `Domain: ${a.domain} (${a.url})`,
    `Data source: ${a.source ?? 'sample'}${a.fetchError ? ` (crawl issue: ${a.fetchError})` : ''}`,
    `Niche: ${a.niche}`,
    `Tagline: ${a.tagline}`,
    `Audience: ${a.targetAudience}`,
    `Authority score${isMeasured(a) ? '' : ' (modeled from the domain name, not measured)'}: ${a.score.overall}/100 (${a.score.tier}); technical ${a.score.technicalHealth}, SEM readiness ${a.score.semReadiness}, topical ${a.score.topicalAuthority}, AI-search ${a.score.aiSearchVisibility}, high-intent coverage ${a.score.highIntentCoverage}`,
    `Avg niche CPC: $${a.metrics.averageCpcInNiche}; modeled monthly paid-traffic value $${a.metrics.monthlyPaidValue.toLocaleString()}; modeled wasted spend $${a.metrics.wastedSpendPrevented.toLocaleString()}/mo`,
    `Keywords: ${a.keywords.map((k) => `"${k.keyword}" [${k.intent}, ${k.matchType}, ~${k.monthlyVolume}/mo, $${k.cpc}]`).join('; ')}`,
    `Competitors: ${a.competitors.map((c) => `${c.name} (${c.domain}) weak spots: ${c.vulnerabilities.join(', ')}`).join('; ')}`,
    `CRO findings: ${a.croAudit.findings.map((f) => `[${f.severity}] ${f.issue}`).join(' ')}`
  ];
  if (a.site) {
    lines.push(`Homepage title: ${a.site.title || '(empty)'}; meta description: ${a.site.description || '(none)'}; H1: ${a.site.h1.join(' | ') || '(none)'}; JSON-LD: ${a.site.jsonLdTypes.join(', ') || 'none'}; response ${a.site.responseMs} ms`);
  }
  return lines.join('\n');
}

/** Moves the last fenced code block out of the text into a copyable snippet. */
function extractSnippet(fullText: string): { text: string; actionSnippet?: ChatMessage['actionSnippet'] } {
  const blocks = [...fullText.matchAll(/```[a-zA-Z-]*\n([\s\S]*?)```/g)];
  const last = blocks[blocks.length - 1];
  if (!last || !last[1].trim()) return { text: fullText };
  const text = (fullText.slice(0, last.index) + fullText.slice((last.index ?? 0) + last[0].length)).trim();
  return { text, actionSnippet: { type: 'code', content: last[1].trim() } };
}

async function readTextStream(res: Response, onToken: (t: string) => void): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) throw new Error('No readable stream');
  const decoder = new TextDecoder();
  let full = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    full += chunk;
    onToken(chunk);
  }
  return full;
}

export async function queryLocalLlmStream(
  history: { role: 'user' | 'assistant'; content: string }[],
  analysis: DomainAnalysis,
  provider: LlmProvider,
  modelName: string,
  onToken: (token: string) => void
): Promise<{ fullText: string; actionSnippet?: ChatMessage['actionSnippet']; provider: LlmProvider; rateLimited?: boolean }> {
  const prompt = history[history.length - 1]?.content ?? '';

  if (provider === 'perplexity' || provider === 'claude') {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, context: analysisContext(analysis) })
      });
      if (res.status === 429) {
        // The drawer shows a translated message for this case.
        return { fullText: '', provider, rateLimited: true };
      }
      if (!res.ok || !(res.headers.get('content-type') ?? '').startsWith('text/plain')) {
        throw new Error(`chat API returned ${res.status}`);
      }
      const fullText = await readTextStream(res, onToken);
      return { ...toResult(fullText), provider };
    } catch (err) {
      console.warn('Hosted chat unavailable, falling back to built-in playbooks:', err);
    }
  }

  if (provider === 'ollama') {
    try {
      const res = await fetch('/api/ollama/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelName,
          stream: true,
          messages: [
            { role: 'system', content: `You are ApexSEM, an expert SEM/SEO strategist. Give concrete, numbered advice. Traffic and volume figures below are modeled estimates, not account data. Reply in the language the user writes in. Analysis:\n${analysisContext(analysis)}` },
            ...history
          ],
          options: { temperature: 0.7, top_p: 0.9 }
        })
      });
      if (!res.ok) throw new Error(`Ollama returned status ${res.status}`);
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No readable stream from Ollama');
      const decoder = new TextDecoder();
      let fullText = '';
      let buffered = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffered += decoder.decode(value, { stream: true });
        const lines = buffered.split('\n');
        buffered = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const token = JSON.parse(line).message?.content;
            if (token) {
              fullText += token;
              onToken(token);
            }
          } catch {
            // Ignore malformed line.
          }
        }
      }
      return { ...toResult(fullText), provider };
    } catch (err) {
      console.warn('Ollama streaming error, falling back to built-in playbooks:', err);
    }
  }

  // Built-in rule-based playbooks with a typewriter effect.
  const fallback = generateAgencyResponse(prompt, analysis);
  const words = fallback.text.split(' ');
  for (let i = 0; i < words.length; i++) {
    onToken((i === 0 ? '' : ' ') + words[i]);
    await new Promise((r) => setTimeout(r, 18));
  }
  return { fullText: fallback.text, actionSnippet: fallback.actionSnippet, provider: 'builtin' };
}

function toResult(fullText: string): { fullText: string; actionSnippet?: ChatMessage['actionSnippet'] } {
  const { text, actionSnippet } = extractSnippet(fullText);
  return { fullText: text, actionSnippet };
}
