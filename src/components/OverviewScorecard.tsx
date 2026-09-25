import React from 'react';
import { DollarSign, TrendingUp, ShieldAlert, Target, Award, ArrowUpRight, Cpu, Layers } from 'lucide-react';
import { DomainAnalysis, ScoreBreakdown } from '../types';
import { useDict } from '../i18n';
import { common } from '../i18n/common';
import { useLabels } from '../i18n/labels';
import { overview } from '../i18n/dict/overview';
import { isMeasured, approxRange, EstimateBadge } from '../lib/honest';

interface OverviewScorecardProps {
  analysis: DomainAnalysis;
  onNavigateTab: (tab: string) => void;
}

const VECTORS = ['technicalHealth', 'semReadiness', 'topicalAuthority', 'aiSearchVisibility', 'highIntentCoverage'] as const satisfies readonly (keyof ScoreBreakdown)[];

/** Modeled shares are rounded to the nearest 5 so they don't read as measured. */
const round5 = (n: number) => Math.max(5, Math.round(n / 5) * 5);

export const OverviewScorecard: React.FC<OverviewScorecardProps> = ({ analysis, onNavigateTab }) => {
  const { score, metrics } = analysis;
  const t = useDict(overview);
  const c = useDict(common);
  const L = useLabels();
  const measured = isMeasured(analysis);

  return (
    <div className="space-y-6">
      {/* Top Banner: Executive Summary */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="tag">
                {analysis.niche}
              </span>
              <span className="text-xs text-fg-subtle">{t.audience} {analysis.targetAudience}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-fg break-words">
              {t.reportFor} <span className="font-mono text-fg-muted">{analysis.domain}</span>
            </h2>
            <p className="text-sm text-fg-muted max-w-3xl leading-relaxed">
              {analysis.tagline}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigateTab('sem')}
              className="btn btn-primary h-11 sm:h-9"
            >
              <span>{t.launchSem}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab('organic')}
              className="btn btn-secondary h-11 sm:h-9"
            >
              <span>{t.viewT1Plan}</span>
              <Layers className="w-4 h-4 text-fg-subtle" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Grid: Master T1 Score & 5 Pillar Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Master Score Dial (4 cols) */}
        <div className="lg:col-span-4 card p-6 flex flex-col justify-between items-center text-center">
          <div className="w-full flex items-center justify-between gap-2 text-xs text-fg-muted mb-2">
            <span className="flex items-center gap-1.5 font-medium text-fg min-w-0">
              <Award className="w-4 h-4 text-fg-subtle shrink-0" /> <span className="truncate">{t.authorityIndex}</span>
            </span>
            {measured ? (
              <span className="text-fg-subtle cursor-help" title={c.measuredHint}>{c.measured}</span>
            ) : (
              <EstimateBadge />
            )}
          </div>

          {/* Radial / Circle Score Indicator */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="w-40 h-40 flex items-center justify-center relative">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-surface-2"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-accent transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * score.overall) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-semibold num text-fg">
                  {score.overall}
                </span>
                <span className="text-xs text-fg-subtle">{t.outOf100}</span>
              </div>
            </div>
          </div>

          <div className="w-full space-y-2">
            <div className="inset px-3 py-2 flex items-center justify-between gap-3">
              <span className="text-xs text-fg-muted">{t.currentStatus}</span>
              <span className="text-xs font-medium text-fg text-right">{L.tier(score.tier)}</span>
            </div>
            <p className="text-xs text-fg-muted text-center leading-relaxed pt-2">
              {score.overall >= 80 ? t.verdict.high : score.overall >= 65 ? t.verdict.mid : t.verdict.low}
            </p>
          </div>
        </div>

        {/* 5 Pillar Breakdown (8 cols) */}
        <div className="lg:col-span-8 card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h3 className="text-base font-semibold text-fg flex items-center gap-2 min-w-0">
              <Cpu className="w-4 h-4 text-fg-subtle shrink-0" />
              <span>{t.vectorsTitle}</span>
            </h3>
            {measured ? (
              <span className="text-xs text-fg-subtle whitespace-nowrap cursor-help" title={c.measuredHint}>{t.fromCrawl}</span>
            ) : (
              <EstimateBadge />
            )}
          </div>

          <div className="space-y-5">
            {VECTORS.map((key) => (
              <div key={key}>
                <div className="flex justify-between gap-4 text-xs mb-2">
                  <span className="text-fg-muted min-w-0">{t.vectors[key]}</span>
                  <span className="font-medium num text-fg">{score[key]}%</span>
                </div>
                <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-fg-muted transition-all duration-700"
                    style={{ width: `${score[key]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-2 text-xs text-fg-muted">
            <span>{t.nextTarget} <strong className="font-medium text-fg">{t.nextTargetValue}</strong></span>
            <button
              onClick={() => onNavigateTab('roadmap')}
              className="text-accent-fg hover:underline font-medium flex items-center gap-1 cursor-pointer"
            >
              {t.viewRoadmap} &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 4 Financial & Traffic Impact Metrics (all modeled) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="card p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs text-fg-muted min-w-0">{t.paidValue}</span>
            <span className="flex items-center gap-2 shrink-0">
              <EstimateBadge />
              <DollarSign className="w-4 h-4 text-fg-subtle" />
            </span>
          </div>
          <div className="text-2xl font-semibold num text-fg">
            {approxRange(metrics.monthlyPaidValue, { money: true })}
          </div>
          <p className="text-xs text-fg-subtle mt-1">
            {t.paidValueHint}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="card p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs text-fg-muted min-w-0">{t.pipeline}</span>
            <span className="flex items-center gap-2 shrink-0">
              <EstimateBadge />
              <TrendingUp className="w-4 h-4 text-fg-subtle" />
            </span>
          </div>
          <div className="text-2xl font-semibold num text-fg">
            {approxRange(metrics.potentialMonthlyRevenue, { money: true })}
          </div>
          <p className="text-xs text-fg-subtle mt-1">
            {t.pipelineHint}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="card p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs text-fg-muted min-w-0">{t.targetTraffic}</span>
            <span className="flex items-center gap-2 shrink-0">
              <EstimateBadge />
              <Target className="w-4 h-4 text-fg-subtle" />
            </span>
          </div>
          <div className="text-2xl font-semibold num text-fg">
            {approxRange(metrics.targetT1TrafficEst)}{' '}
            <span className="text-xs font-normal text-fg-subtle">{c.visitsMo}</span>
          </div>
          <p className="text-xs text-fg-subtle mt-1">
            {t.current} <span className="num text-fg-muted">{approxRange(metrics.currentTrafficEst)}</span> {c.visitsMo}
          </p>
        </div>

        {/* Metric 4 */}
        <div className="card p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs text-fg-muted min-w-0">{t.wasted}</span>
            <span className="flex items-center gap-2 shrink-0">
              <EstimateBadge />
              <ShieldAlert className="w-4 h-4 text-fg-subtle" />
            </span>
          </div>
          <div className="text-2xl font-semibold num text-fg">
            {approxRange(metrics.wastedSpendPrevented, { money: true })}
            <span className="text-xs font-normal text-fg-subtle">{c.perMonth}</span>
          </div>
          <p className="text-xs text-fg-subtle mt-1">
            {t.wastedHint}
          </p>
        </div>
      </div>

      {/* Competitor Search Share Teardown */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-semibold text-fg flex items-center gap-2 flex-wrap">
              <span>{t.competitorsTitle}</span>
              <EstimateBadge />
            </h3>
            <p className="text-xs text-fg-muted mt-1">
              {t.competitorsSub}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.competitors.map((comp, idx) => {
            const isUserDomain = comp.domain === analysis.domain;
            return (
              <div
                key={idx}
                onClick={() => onNavigateTab('sem')}
                className={`p-4 rounded border transition-colors cursor-pointer ${
                  isUserDomain
                    ? 'bg-accent-soft border-line'
                    : 'bg-surface-2 border-transparent hover:border-line-strong'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-sm font-medium min-w-0 truncate ${isUserDomain ? 'text-accent-fg' : 'text-fg'}`}>
                    {comp.name}
                  </span>
                  <span className="text-xs num text-fg-muted whitespace-nowrap">
                    ~{round5(comp.marketSharePercentage)}% {t.share}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between gap-2 text-fg-muted">
                    <span>{t.paidSpend}</span>
                    <span className="num font-medium text-fg whitespace-nowrap">
                      {approxRange(comp.monthlyPaidSpend, { money: true })}
                    </span>
                  </div>

                  <div>
                    <span className="text-fg-muted block mb-1">{t.topKeywords}</span>
                    <div className="flex flex-wrap gap-1">
                      {comp.topPaidKeywords.map((kw, i) => (
                        <span key={i} className="tag bg-surface">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-line">
                    <span className="text-fg-muted block mb-1">{t.weakSpots}</span>
                    <ul className="list-disc list-inside text-xs text-fg-muted space-y-1">
                      {comp.vulnerabilities.map((vuln, vIdx) => (
                        <li key={vIdx}>{vuln}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
