import React, { useEffect, useState } from 'react';
import { Search, Loader2, Sparkles, Globe, ArrowRight, AlertCircle } from 'lucide-react';
import { DomainAnalysis } from '../types';
import { FREE_DAILY_LIMIT } from '../services/usage';

interface DomainSearchBarProps {
  currentDomain: string;
  onAnalyze: (domain: string) => void;
  isLoading: boolean;
  analysis: DomainAnalysis;
  error: string | null;
  /** Free analyses left today; Infinity for Pro. */
  remaining: number;
  onOpenPlans: () => void;
  /** Hide the heading when the landing hero already explains the product. */
  compact?: boolean;
}

const PRESET_DOMAINS = [
  { domain: 'linear.app', label: 'Linear', tag: 'Productivity' },
  { domain: 'supabase.com', label: 'Supabase', tag: 'DevTools' },
  { domain: 'ramp.com', label: 'Ramp', tag: 'FinTech' },
  { domain: 'posthog.com', label: 'PostHog', tag: 'Analytics' },
  { domain: 'brex.com', label: 'Brex', tag: 'Corporate Spend' }
];

const SCAN_STEPS = [
  'Fetching the homepage…',
  'Reading title, meta tags, headings and schema…',
  'Checking CTAs, pricing links and social proof…',
  'Extracting the phrases your page is built around…',
  'Drafting keywords, ad copy and the 90-day plan…',
  'Still working. Slow sites can take up to 30 seconds…'
];

function sourceLine(a: DomainAnalysis): string {
  const reason = a.fetchError ? ` (${a.fetchError.replace(/\.$/, '')})` : '';
  switch (a.source) {
    case 'sample':
      return `Sample report for ${a.domain}. Run your own domain to get a live one.`;
    case 'crawl+ai':
      return `Live crawl of ${a.domain}, strategy written by Claude.`;
    case 'crawl':
      return `Live crawl of ${a.domain}. Keywords and copy built from the page’s own wording.`;
    case 'ai':
      return `Couldn’t crawl ${a.domain}${reason}. Strategy inferred by Claude from the domain.`;
    default:
      return `Couldn’t crawl ${a.domain}${reason}. Showing a model based on the domain name only.`;
  }
}

export const DomainSearchBar: React.FC<DomainSearchBarProps> = ({
  currentDomain,
  onAnalyze,
  isLoading,
  analysis,
  error,
  remaining,
  onOpenPlans,
  compact = false
}) => {
  const [inputVal, setInputVal] = useState(analysis.source === 'sample' ? '' : currentDomain);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setStepIndex(0);
      return;
    }
    const id = setInterval(() => setStepIndex((i) => Math.min(i + 1, SCAN_STEPS.length - 1)), 2600);
    return () => clearInterval(id);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    onAnalyze(inputVal.trim());
  };

  const handleSelectPreset = (domain: string) => {
    setInputVal(domain);
    onAnalyze(domain);
  };

  const live = analysis.source === 'crawl' || analysis.source === 'crawl+ai';

  return (
    <div className="bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 md:p-6 mb-8 backdrop-blur-md relative overflow-hidden shadow-sm dark:shadow-xl transition-colors duration-200">
      <div className="relative z-10">
        {compact ? (
          <label htmlFor="domain-input" className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
            Your domain
          </label>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Domain Authority & SEM Optimization Engine</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-500/10 dark:bg-accent-500/20 text-accent-600 dark:text-accent-300 border border-accent-500/20 dark:border-accent-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Tier-1 Blueprint
                </span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Analyze any domain to find high-intent keywords, cut wasted ad spend and fix what blocks conversions.
              </p>
            </div>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Globe className="w-4 h-4 text-brand-500" />
            </div>
            <input
              id="domain-input"
              type="text"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              aria-label="Domain to analyze"
              aria-invalid={!!error}
              aria-describedby="domain-status"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="yourcompany.com"
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-mono text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-glow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Analyzing…</span>
              </>
            ) : (
              <>
                <span>Analyze domain</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Progress, error or report provenance */}
        <div id="domain-status" aria-live="polite" className="mt-3.5 min-h-[2.25rem]">
          {isLoading ? (
            <div className="flex items-center gap-2.5 text-xs text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/40 px-3.5 py-2 rounded-lg">
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              <span>{SCAN_STEPS[stepIndex]}</span>
            </div>
          ) : error ? (
            <div role="alert" className="flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 px-3.5 py-2 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-start gap-2">
                <span
                  className={`mt-[5px] w-1.5 h-1.5 rounded-full shrink-0 ${
                    live ? 'bg-emerald-500' : analysis.source === 'sample' ? 'bg-slate-400' : 'bg-amber-500'
                  }`}
                />
                <span>{sourceLine(analysis)} Traffic and CPC figures are modeled estimates.</span>
              </span>
              {Number.isFinite(remaining) && (
                <button
                  type="button"
                  onClick={onOpenPlans}
                  className="shrink-0 text-left sm:text-right underline decoration-slate-300 dark:decoration-slate-700 underline-offset-2 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  {remaining} of {FREE_DAILY_LIMIT} free analyses left today
                </button>
              )}
            </div>
          )}
        </div>

        {/* Preset Domain Quick Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <Search className="w-3 h-3" /> Try one:
          </span>
          {PRESET_DOMAINS.map((item) => (
            <button
              key={item.domain}
              type="button"
              onClick={() => handleSelectPreset(item.domain)}
              disabled={isLoading}
              className={`px-2.5 py-1 rounded-lg border transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                currentDomain === item.domain && analysis.source !== 'sample'
                  ? 'bg-brand-50 dark:bg-brand-500/20 border-brand-500/50 text-brand-700 dark:text-brand-300 font-semibold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                {item.tag}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
