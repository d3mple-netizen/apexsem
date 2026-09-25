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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="plans-title"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative transition-colors duration-200"
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="max-w-md mb-6">
          <h3 id="plans-title" className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight [text-wrap:balance]">
            {reason === 'limit' ? 'You’ve used today’s free analyses' : 'Plans'}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5">
            {reason === 'limit'
              ? `Free covers ${FREE_DAILY_LIMIT} analyses a day and resets at midnight. Pro removes the limit.`
              : 'Start free. Upgrade when you run more domains than the daily limit allows.'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Free */}
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Free</h4>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              $0<span className="text-sm font-normal text-slate-500 dark:text-slate-400"> /month</span>
            </p>
            <div className="mt-4" aria-label={`${used} of ${FREE_DAILY_LIMIT} analyses used today`}>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                <span>Used today</span>
                <span className="tabular-nums font-medium text-slate-700 dark:text-slate-300">
                  {used} of {FREE_DAILY_LIMIT}
                </span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: FREE_DAILY_LIMIT }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${i < used ? 'bg-slate-500 dark:bg-slate-400' : 'bg-slate-200 dark:bg-slate-800'}`}
                  />
                ))}
              </div>
            </div>
            <ul className="mt-5 space-y-2 text-sm text-slate-600 dark:text-slate-400 flex-1">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={onClose}
              className="mt-6 w-full py-2.5 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
            >
              {reason === 'limit' ? 'Come back tomorrow' : 'Keep using Free'}
            </button>
          </section>

          {/* Pro */}
          <section className="rounded-xl border-2 border-brand-500 bg-brand-50/40 dark:bg-brand-500/[0.06] p-5 flex flex-col">
            <h4 className="text-sm font-semibold text-brand-700 dark:text-brand-300">Pro</h4>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              ${PRO_PRICE}<span className="text-sm font-normal text-slate-500 dark:text-slate-400"> /month</span>
            </p>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 h-[26px] flex items-end">Cancel anytime. Billed monthly.</p>
            <ul className="mt-5 space-y-2 text-sm text-slate-700 dark:text-slate-300 flex-1">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-brand-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href={mailto}
              className="mt-6 w-full py-2.5 text-sm font-semibold rounded-lg bg-brand-600 hover:bg-brand-500 active:translate-y-px text-white flex items-center justify-center gap-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <Mail className="w-4 h-4" />
              Email us to start Pro
            </a>
          </section>
        </div>

        <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
          Pro is activated by hand while we finish self-serve checkout. We reply within one business day.
        </p>
      </div>
    </div>
  );
};
