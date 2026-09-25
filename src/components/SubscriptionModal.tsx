import React, { useEffect, useRef } from 'react';
import { X, Check, Mail } from 'lucide-react';
import { DomainAnalysis } from '../types';
import { FREE_DAILY_LIMIT, PRO_PRICE, PRO_MAILTO } from '../services/usage';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: DomainAnalysis;
  /** "limit" when opened because the free quota ran out. */
  reason: 'limit' | 'upgrade';
  usedToday: number;
}

const FREE_FEATURES = [
  `${FREE_DAILY_LIMIT} domain analyses per day`,
  'Live homepage crawl and SEO checks',
  'Keywords, ad copy and 90-day roadmap',
  'Strategist chat and Markdown/CSV export'
];

const PRO_FEATURES = [
  'Unlimited domain analyses',
  'Priority strategist chat on every report',
  'Onboarding call to set up your first campaigns',
  'Early access to Google Ads sync and re-crawl alerts'
];

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, analysis, reason, usedToday }) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const used = Math.min(usedToday, FREE_DAILY_LIMIT);
  const mailto = `${PRO_MAILTO}&body=${encodeURIComponent(`Hi, I'd like ApexSEM Pro.\n\nMy domain: ${analysis.domain}\n`)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 sm:p-4 anim-fade"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="plans-title"
        className="bg-surface border border-line rounded-t-[14px] rounded-b-none sm:rounded p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6 md:p-8 max-w-2xl w-full max-h-[92dvh] overflow-y-auto overscroll-contain shadow-overlay relative anim-sheet"
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-2 sm:top-4 sm:right-4 w-11 h-11 sm:w-auto sm:h-auto flex items-center justify-center p-2 rounded text-fg-subtle hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="max-w-md mb-6 sm:mb-8 pr-10">
          <h3 id="plans-title" className="text-xl font-semibold text-fg [text-wrap:balance]">
            {reason === 'limit' ? 'You’ve used today’s free analyses' : 'Plans'}
          </h3>
          <p className="text-sm text-fg-muted mt-2">
            {reason === 'limit'
              ? `Free covers ${FREE_DAILY_LIMIT} analyses a day and resets at midnight. Pro removes the limit.`
              : 'Start free. Upgrade when you run more domains than the daily limit allows.'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Free */}
          <section className="rounded border border-line p-5 flex flex-col">
            <h4 className="text-sm font-semibold text-fg">Free</h4>
            <p className="mt-2 text-2xl font-semibold text-fg num">
              $0<span className="text-sm font-normal text-fg-subtle"> /month</span>
            </p>
            <div className="mt-4" aria-label={`${used} of ${FREE_DAILY_LIMIT} analyses used today`}>
              <div className="flex justify-between text-xs text-fg-subtle mb-2">
                <span>Used today</span>
                <span className="num font-medium text-fg-muted">
                  {used} of {FREE_DAILY_LIMIT}
                </span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: FREE_DAILY_LIMIT }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full ${i < used ? 'bg-fg-muted' : 'bg-surface-2'}`}
                  />
                ))}
              </div>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-fg-muted flex-1">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-fg-subtle" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={onClose}
              className="btn btn-secondary h-11 sm:h-9 mt-6 w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              {reason === 'limit' ? 'Come back tomorrow' : 'Keep using Free'}
            </button>
          </section>

          {/* Pro */}
          <section className="rounded border border-accent p-5 flex flex-col">
            <h4 className="text-sm font-semibold text-fg">Pro</h4>
            <p className="mt-2 text-2xl font-semibold text-fg num">
              ${PRO_PRICE}<span className="text-sm font-normal text-fg-subtle"> /month</span>
            </p>
            <p className="mt-4 text-xs text-fg-subtle sm:h-[26px] flex items-end">Cancel anytime. Billed monthly.</p>
            <ul className="mt-6 space-y-2 text-sm text-fg-muted flex-1">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-fg-subtle" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href={mailto}
              className="btn btn-primary h-11 sm:h-9 mt-6 w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Mail className="w-4 h-4" />
              Email us to start Pro
            </a>
          </section>
        </div>

        <p className="mt-6 text-xs text-fg-subtle">
          Pro is activated by hand while we finish self-serve checkout. We reply within one business day.
        </p>
      </div>
    </div>
  );
};
