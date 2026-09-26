import React, { useEffect, useState } from 'react';
import { Loader2, Globe, ArrowRight, AlertCircle } from 'lucide-react';
import { DomainAnalysis } from '../types';
import { useDict } from '../i18n';
import { shell } from '../i18n/dict/shell';
import { GoogleMark } from './AuthControls';
import { FREE_DAILY_LIMIT } from '../services/usage';

interface DomainSearchBarProps {
  currentDomain: string;
  onAnalyze: (domain: string) => void;
  isLoading: boolean;
  analysis: DomainAnalysis;
  error: string | null;
  /** Free analyses left today; Infinity for Pro. */
  remaining: number;
  /** Today's quota (3 signed in; guests must sign in first). */
  limit: number;
  isSignedIn: boolean;
  onSignIn: () => void;
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

type SourceCopy = (typeof shell.en)['search']['source'];

function sourceLine(a: DomainAnalysis, c: SourceCopy): string {
  const reason = a.fetchError ? ` (${a.fetchError.replace(/\.$/, '')})` : '';
  switch (a.source) {
    case 'sample':
      return c.sample(a.domain);
    case 'live':
      return c.live(a.domain, !a.fetchError);
    case 'crawl+ai':
      return c.crawlAi(a.domain);
    case 'crawl':
      return c.crawl(a.domain);
    case 'ai':
      return c.ai(a.domain, reason);
    default:
      return c.estimate(a.domain, reason);
  }
}

export const DomainSearchBar: React.FC<DomainSearchBarProps> = ({
  currentDomain,
  onAnalyze,
  isLoading,
  analysis,
  error,
  remaining,
  limit,
  isSignedIn,
  onSignIn,
  onOpenPlans,
  compact = false
}) => {
  const t = useDict(shell).search;
  const SCAN_STEPS = t.steps;
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

  return (
    <section className="card p-4 sm:p-6 mb-8 sm:mb-12">
      {compact ? (
        <label htmlFor="domain-input" className="block text-sm font-medium text-fg mb-3">
          {t.yourDomain}
        </label>
      ) : (
        <div className="mb-4">
          <h2 className="text-base font-semibold text-fg">{t.anotherTitle}</h2>
          <p className="text-sm text-fg-muted mt-1">
            {t.anotherLead}
          </p>
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Globe className="w-4 h-4 text-fg-subtle" />
          </div>
          <input
            id="domain-input"
            type="text"
            inputMode="url"
            autoComplete="url"
            spellCheck={false}
            aria-label={t.inputAria}
            aria-invalid={!!error}
            aria-describedby="domain-status"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="yourcompany.com"
            disabled={isLoading}
            className="field h-12 sm:h-11 pl-10 pr-4 font-mono text-base sm:text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !inputVal.trim()}
          className={`btn h-12 sm:h-11 px-5 w-full sm:w-auto text-base sm:text-sm ${
            inputVal.trim() || isLoading
              ? 'btn-primary'
              : 'bg-neutral-200/40 dark:bg-neutral-800 text-fg-muted disabled:opacity-100'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t.analyzing}</span>
            </>
          ) : (
            <>
              <span>{t.analyze}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {compact && Number.isFinite(remaining) && (
        <p className="mt-2 text-[13px] text-fg-muted">{t.freeNote(FREE_DAILY_LIMIT)}</p>
      )}

      {/* Progress, error or report provenance */}
      <div id="domain-status" aria-live="polite" className="mt-4 min-h-[2.5rem]">
        {isLoading ? (
          <div className="flex items-center gap-2 text-xs text-fg-muted">
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-accent-fg" />
            <span>{SCAN_STEPS[stepIndex]}</span>
          </div>
        ) : error ? (
          <div role="alert" className="flex items-start gap-2 text-xs text-fg bg-accent-soft border border-accent/30 px-3 py-2 rounded">
            <AlertCircle className="w-4 h-4 shrink-0 text-accent-fg" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-[13px] text-fg-subtle">
            <span>
              {sourceLine(analysis, t.source)}
              {analysis.source !== 'sample' && ` ${t.modeledNote}`}
            </span>
            {!isSignedIn ? (
              <button
                type="button"
                onClick={onSignIn}
                className="shrink-0 inline-flex items-center gap-1.5 py-2 -my-2 sm:py-0 sm:my-0 text-fg-muted hover:text-fg transition-colors cursor-pointer"
              >
                <GoogleMark className="w-3.5 h-3.5" />
                {t.anonCta}
              </button>
            ) : Number.isFinite(remaining) && (
              <button
                type="button"
                onClick={onOpenPlans}
                title={t.leftHint(remaining, limit)}
                aria-label={t.leftHint(remaining, limit)}
                className="shrink-0 py-2 -my-2 sm:py-0 sm:my-0 text-left sm:text-right num text-fg-subtle hover:text-fg-muted transition-colors cursor-pointer"
              >
                {t.left(remaining, limit)}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Preset Domain Quick Chips */}
      <div className="mt-4 pt-4 border-t border-line flex flex-wrap items-center gap-2 text-xs">
        <span className="w-full sm:w-auto text-fg-subtle mr-1">{t.tryOne}</span>
        {PRESET_DOMAINS.map((item) => {
          const active = currentDomain === item.domain && analysis.source !== 'sample';
          return (
            <button
              key={item.domain}
              type="button"
              onClick={() => handleSelectPreset(item.domain)}
              disabled={isLoading}
              title={t.tags[item.tag] ?? item.tag}
              className={`h-11 sm:h-7 px-4 sm:px-3 rounded-sm border text-sm sm:text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                active
                  ? 'border-line-strong bg-surface-2 text-fg'
                  : 'border-line text-fg-muted hover:text-fg hover:border-line-strong'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};
