import React, { useState } from 'react';
import { Eye, CheckCircle2, Copy, Check, Sparkles, ArrowRight, X } from 'lucide-react';
import { DomainAnalysis } from '../types';
import { useDict } from '../i18n';
import { common } from '../i18n/common';
import { useLabels } from '../i18n/labels';
import { croDict } from '../i18n/dict/cro';
import { isMeasured, EstimateBadge } from '../lib/honest';

interface CROStudioProps {
  analysis: DomainAnalysis;
}

export const CROStudio: React.FC<CROStudioProps> = ({ analysis }) => {
  const t = useDict(croDict);
  const c = useDict(common);
  const L = useLabels();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);
  const [leadEmail, setLeadEmail] = useState<string>('');
  const [leadSubmitted, setLeadSubmitted] = useState<boolean>(false);

  // Scores come from the crawl only on live runs; otherwise they are modeled.
  const measured = isMeasured(analysis);
  const { croAudit } = analysis;

  const scoreCards = [
    { label: t.headlineScore, value: croAudit.headlineScore, hint: t.headlineHint },
    { label: t.matchScore, value: croAudit.messageMatchScore, hint: t.matchHint },
    { label: t.frictionScore, value: croAudit.frictionScore, hint: t.frictionHint }
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail.trim()) return;
    setLeadSubmitted(true);
    setTimeout(() => {
      setLeadSubmitted(false);
      setIsLeadModalOpen(false);
      setLeadEmail('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div>
        <h2 className="text-xl font-semibold text-fg flex items-center gap-2">
          <Eye className="w-4 h-4 text-fg-subtle shrink-0" />
          <span>{t.title}</span>
        </h2>
        <p className="text-sm text-fg-muted mt-1 max-w-3xl">
          {t.subtitle}
        </p>
      </div>

      {/* CRO Scorecard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {scoreCards.map((card) => (
          <div key={card.label} className="card p-5">
            <div className="flex justify-between items-center gap-2 mb-3">
              <span className="text-xs text-fg-muted min-w-0">{card.label}</span>
              <span className="flex items-center gap-1.5 shrink-0">
                {!measured && <EstimateBadge />}
                <span className="text-sm font-semibold num text-fg">{card.value}/100</span>
              </span>
            </div>
            <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden">
              <div className="bg-fg-muted h-full rounded-full" style={{ width: `${card.value}%` }} />
            </div>
            <p className="text-xs text-fg-subtle mt-3 leading-relaxed">
              {card.hint}
            </p>
          </div>
        ))}
      </div>

      {/* Recommended hero vs findings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recommended Hero (7 cols) */}
        <div className="lg:col-span-7 card p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-fg flex items-center gap-2 min-w-0">
              <Sparkles className="w-4 h-4 text-fg-subtle shrink-0" /> {t.heroTitle}
            </span>
            <button
              onClick={() => {
                const text = `${t.clipHeadline}: ${croAudit.recommendedHeroHeadline}\n${t.clipSubhead}: ${croAudit.recommendedHeroSubhead}\n${t.clipCta}: ${croAudit.recommendedCTA}`;
                handleCopy(text, 'hero-copy');
              }}
              className="btn btn-ghost btn-sm shrink-0"
            >
              {copiedKey === 'hero-copy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'hero-copy' ? t.copied : t.copyText}</span>
            </button>
          </div>

          {/* Hero Preview Card */}
          <div className="inset p-8 text-center space-y-4">
            <h3 className="text-xl md:text-2xl font-semibold text-fg tracking-[-0.02em]">
              {croAudit.recommendedHeroHeadline}
            </h3>

            <p className="text-sm text-fg-muted max-w-xl mx-auto leading-relaxed">
              {croAudit.recommendedHeroSubhead}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setIsLeadModalOpen(true)}
                className="btn btn-primary"
              >
                <span>{croAudit.recommendedCTA}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Actionable CRO Findings (5 cols) */}
        <div className="lg:col-span-5 card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-fg">{t.findingsTitle}</h3>
          {croAudit.findings.length === 0 ? (
            <p className="text-xs text-fg-subtle">{t.noFindings}</p>
          ) : (
            <div className="divide-y divide-line max-h-96 overflow-y-auto pr-1">
              {croAudit.findings.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`tag ${item.severity === 'high' ? 'text-fg' : ''}`}>
                      {t.priority(L.severity(item.severity))}
                    </span>
                  </div>
                  <div className="text-fg leading-relaxed">
                    <span className="font-medium">{t.issue}</span> {item.issue}
                  </div>
                  <div className="text-fg-muted leading-relaxed">
                    <span className="font-medium text-fg">{t.fix}</span> {item.solution}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* One-field form preview */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 sm:p-4 anim-fade">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.formTitle}
            className="card rounded-t-[14px] rounded-b-none sm:rounded shadow-overlay p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6 max-w-md w-full max-h-[92dvh] overflow-y-auto relative anim-sheet"
          >
            <button
              onClick={() => setIsLeadModalOpen(false)}
              aria-label={c.close}
              title={c.close}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 w-11 h-11 sm:w-auto sm:h-auto flex items-center justify-center text-fg-subtle hover:text-fg hover:bg-surface-2 p-1 rounded-sm transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2 mb-6 pr-8">
              <h3 className="text-base font-semibold text-fg">
                {t.formTitle}
              </h3>
              <p className="text-sm text-fg-muted">
                {t.formBody(analysis.domain)}
              </p>
            </div>

            {leadSubmitted ? (
              <div className="inset p-4 text-center text-sm text-fg font-medium space-y-1">
                <CheckCircle2 className="w-4 h-4 mx-auto mb-2 text-accent-fg" />
                <p>{t.previewDone}</p>
                <span className="text-xs font-normal text-fg-muted">{t.previewDoneHint}</span>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <label htmlFor="cro-lead-email" className="text-xs font-medium text-fg-muted block mb-2">
                    {t.workEmail}
                  </label>
                  <input
                    id="cro-lead-email"
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="field h-9 px-3 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                >
                  {croAudit.recommendedCTA}
                </button>
                <p className="text-xs text-center text-fg-subtle">
                  {t.formNote}
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
