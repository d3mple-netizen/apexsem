import { DomainAnalysis, AnalysisSource } from '../types';
import { buildAnalysis, cleanDomain, AiEnrichment } from '../lib/engine';

export { cleanDomain };

// Hand-written positioning for the bundled sample report shown on first load.
const SAMPLE_PROFILES: Record<string, AiEnrichment> = {
  'linear.app': {
    niche: 'Issue Tracking & Product Development SaaS',
    category: 'issue tracker',
    tagline: 'Linear is the system for planning and building products, used by fast-moving software teams.',
    targetAudience: 'Engineering leaders, product managers, startup CTOs',
    avgCpc: 9.8,
    competitors: [
      { name: 'Jira', domain: 'atlassian.com', topPaidKeywords: ['jira', 'issue tracking software', 'agile project management'], vulnerabilities: ['Slow, configuration-heavy UI', 'Admin overhead for small teams', 'Per-seat pricing jumps at scale'] },
      { name: 'Asana', domain: 'asana.com', topPaidKeywords: ['project management software', 'task management', 'team planning tool'], vulnerabilities: ['Not built for engineering workflows', 'Weak Git and sprint integration', 'Generic positioning'] }
    ]
  }
};

/** Offline analysis from the domain name alone (no network). */
export function generateDomainAnalysis(rawDomain: string, source: AnalysisSource = 'estimate'): DomainAnalysis {
  const domain = cleanDomain(rawDomain);
  return buildAnalysis({ domain, source, ai: source === 'sample' ? SAMPLE_PROFILES[domain] : null });
}

export class AnalyzeError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

/**
 * Live analysis via /api/analyze (crawl + optional Claude enrichment).
 * Falls back to local heuristics when the API is unreachable, e.g. plain
 * `vite` dev without `vercel dev`. Input errors (4xx) are surfaced instead.
 */
export async function analyzeDomain(rawDomain: string): Promise<DomainAnalysis> {
  const domain = cleanDomain(rawDomain);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 55_000);
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain }),
      signal: controller.signal
    });
    const isJson = (res.headers.get('content-type') ?? '').includes('application/json');
    if (isJson && res.status >= 400 && res.status < 500 && res.status !== 404) {
      const body = await res.json().catch(() => ({}));
      throw new AnalyzeError(body.error ?? `Request failed (${res.status})`, res.status);
    }
    if (!res.ok || !isJson) throw new Error(`analyze API unavailable (${res.status})`);
    return (await res.json()) as DomainAnalysis;
  } catch (err) {
    if (err instanceof AnalyzeError) throw err;
    console.warn('Live analysis unavailable, using local heuristics:', err);
    return {
      ...generateDomainAnalysis(domain, 'estimate'),
      fetchError: 'Live analysis service unreachable; showing a model based on the domain name only.'
    };
  } finally {
    clearTimeout(timer);
  }
}
