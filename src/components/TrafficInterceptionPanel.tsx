import React, { useState } from 'react';
import { Users, TrendingDown, AlertTriangle, ArrowRight, DollarSign, ListChecks, Lock, Check, Zap } from 'lucide-react';
import { DomainAnalysis, TrafficLeakQuery } from '../types';
import { useDict } from '../i18n';
import { common } from '../i18n/common';
import { trafficDict } from '../i18n/dict/traffic';
import { approx, approxRange, EstimateBadge } from '../lib/honest';
import { PRO_PRICE } from '../services/usage';

interface TrafficInterceptionPanelProps {
  analysis: DomainAnalysis;
  isSubscribed: boolean;
  onOpenSubscribeModal: () => void;
  /** Fired when the user marks every leak as planned. Nothing is changed outside the app. */
  onAutoFixCompleted: () => void;
}

/** Modeled percentages are shown to the nearest 5 to avoid false precision. */
const round5 = (n: number) => Math.max(0, Math.round(n / 5) * 5);

export const TrafficInterceptionPanel: React.FC<TrafficInterceptionPanelProps> = ({
  analysis,
  isSubscribed,
  onOpenSubscribeModal,
  onAutoFixCompleted
}) => {
  const t = useDict(trafficDict);
  const c = useDict(common);
  const [leakedQueries, setLeakedQueries] = useState<TrafficLeakQuery[]>(
    analysis.trafficDistribution.leakedQueries
  );
  const [allPlanned, setAllPlanned] = useState<boolean>(analysis.trafficDistribution.isAutoFixed);

  const { trafficDistribution } = analysis;
  const plannedCount = leakedQueries.filter((q) => q.status === 'fixed').length;

  // Marks every leak as planned. It only records intent in the fix plan; no
  // campaigns, pages or schema are deployed from here.
  const handlePlanAll = () => {
    if (!isSubscribed) {
      onOpenSubscribeModal();
      return;
    }
    setLeakedQueries((prev) => prev.map((q) => ({ ...q, status: 'fixed' })));
    setAllPlanned(true);
    onAutoFixCompleted();
  };

  const clientShare = round5(trafficDistribution.clientSharePercent);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-fg flex items-center gap-2">
            <Users className="w-4 h-4 text-fg-subtle shrink-0" />
            <span>{t.title}</span>
            <EstimateBadge />
          </h2>
          <p className="text-sm text-fg-muted mt-1">{t.subtitle}</p>
        </div>

        <div className="shrink-0">
          {isSubscribed ? (
            <button onClick={handlePlanAll} disabled={allPlanned} className="btn btn-primary btn-sm">
              <ListChecks className="w-3.5 h-3.5" />
              <span>{allPlanned ? t.allPlanned : t.planAll}</span>
            </button>
          ) : (
            <button onClick={onOpenSubscribeModal} className="btn btn-primary btn-sm">
              <Lock className="w-3.5 h-3.5" />
              <span className="num">{t.planWithPro(PRO_PRICE)}</span>
            </button>
          )}
        </div>
      </div>

      {/* Planned confirmation */}
      {allPlanned && (
        <div className="card p-4 text-xs flex items-start gap-3">
          <Check className="w-4 h-4 text-fg-subtle shrink-0" />
          <div className="min-w-0">
            <span className="text-sm font-semibold text-fg block">{t.plannedTitle(plannedCount)}</span>
            <span className="text-xs text-fg-muted">{t.plannedBody}</span>
          </div>
        </div>
      )}

      {/* Traffic split */}
      <div className="card p-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-fg flex items-center gap-2 flex-wrap">
              <span>{t.splitTitle}</span>
              <EstimateBadge />
            </h3>
            <p className="text-xs text-fg-muted mt-1">
              {t.splitBody(analysis.domain)}{' '}
              <span className="text-fg-subtle num">
                {t.totalMarket}: {approxRange(trafficDistribution.totalMarketSearches)} {c.searchesMo}
              </span>
            </p>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="label block">{t.yourShare}</span>
            <span className="text-2xl font-semibold num text-fg">~{clientShare}%</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden flex gap-px">
            <div
              className="h-full bg-accent"
              style={{ width: `${trafficDistribution.clientSharePercent}%` }}
              title={`${analysis.domain}: ~${clientShare}%`}
            />
            {trafficDistribution.competitorVisits.map((comp, idx) => (
              <div
                key={idx}
                className={`h-full ${idx === 0 ? 'bg-fg-muted' : 'bg-fg-subtle'}`}
                style={{ width: `${comp.sharePercent}%` }}
                title={`${comp.name}: ~${round5(comp.sharePercent)}%`}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center text-xs gap-x-6 gap-y-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
              <span className="text-fg">
                {analysis.domain} ({t.you}):{' '}
                <strong className="font-semibold num">
                  {approxRange(trafficDistribution.clientVisits)} {c.visitsMo}
                </strong>
              </span>
            </div>

            {trafficDistribution.competitorVisits.map((comp, idx) => (
              <div key={idx} className="flex items-center gap-2 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${idx === 0 ? 'bg-fg-muted' : 'bg-fg-subtle'}`} />
                <span className="text-fg-muted">
                  {comp.name}:{' '}
                  <strong className="font-semibold num text-fg">
                    {approxRange(comp.visits)} {c.visitsMo}
                  </strong>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="inset p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="label">{t.lostTraffic}</span>
              <TrendingDown className="w-4 h-4 text-fg-subtle shrink-0" />
            </div>
            <div className="text-2xl font-semibold num text-neg">
              {approxRange(trafficDistribution.totalLostVisits)}
            </div>
            <p className="text-xs text-fg-subtle mt-1">{t.lostTrafficHint}</p>
          </div>

          <div className="inset p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="label">{t.lostValue}</span>
              <DollarSign className="w-4 h-4 text-fg-subtle shrink-0" />
            </div>
            <div className="text-2xl font-semibold num text-fg">
              {approxRange(trafficDistribution.totalLostRevenue, { money: true })}
              <span className="text-sm font-normal text-fg-subtle">{c.perMonth}</span>
            </div>
            <p className="text-xs text-fg-subtle mt-1">{t.lostValueHint}</p>
          </div>

          <div className="inset p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="label">{t.fixPlan}</span>
              <ListChecks className="w-4 h-4 text-fg-subtle shrink-0" />
            </div>
            <div className="text-2xl font-semibold num text-fg">
              {plannedCount}
              <span className="text-sm font-normal text-fg-subtle"> / {leakedQueries.length}</span>
            </div>
            <p className="text-xs text-fg-subtle mt-1">{t.fixPlanHint}</p>
          </div>
        </div>
      </div>

      {/* Query-by-query leaks */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-fg flex items-center gap-2 flex-wrap">
              <AlertTriangle className="w-4 h-4 text-fg-subtle shrink-0" />
              <span>{t.queriesTitle}</span>
              <EstimateBadge />
            </h3>
            <p className="text-xs text-fg-muted mt-1">{t.queriesBody}</p>
          </div>

          {!isSubscribed && (
            <button onClick={onOpenSubscribeModal} className="btn btn-secondary btn-sm shrink-0">
              <Zap className="w-3.5 h-3.5 text-fg-subtle" />
              <span className="num">{t.planWithPro(PRO_PRICE)}</span>
            </button>
          )}
        </div>

        <div className="divide-y divide-line border-t border-line">
          {leakedQueries.map((item) => (
            <div key={item.id} className="py-5 last:pb-0">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-fg break-words">"{item.query}"</span>
                    <span className="text-xs text-fg-subtle num">
                      ({approx(item.monthlyVolume)} {c.searchesMo})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs text-fg-muted">
                    <span>{t.takenBy}:</span>
                    <strong className="font-medium text-fg">{item.stolenByName}</strong>
                    <span className="text-fg-subtle">·</span>
                    <span>
                      {t.lostVisits}:{' '}
                      <strong className="font-medium num text-fg">
                        {approx(item.estimatedLostVisits)}
                        {c.perMonth}
                      </strong>
                    </span>
                    <span className="text-fg-subtle">·</span>
                    <span>
                      {t.lostValueShort}:{' '}
                      <strong className="font-medium num text-neg">
                        {approx(item.estimatedLostValue, { money: true })}
                        {c.perMonth}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {item.status === 'fixed' ? (
                    <span className="tag">
                      <Check className="w-3 h-3 text-fg-subtle" />
                      {t.planned}
                    </span>
                  ) : (
                    <span className="tag">
                      <AlertTriangle className="w-3 h-3" />
                      {t.leaking}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="inset p-3">
                  <span className="text-fg-subtle font-medium block mb-1">{t.why}</span>
                  <p className="text-fg-muted text-xs leading-relaxed">{item.leakReason}</p>
                </div>

                <div className="inset p-3">
                  <span className="text-fg-subtle font-medium block mb-1">{t.fix}</span>
                  <p className="text-fg-muted text-xs leading-relaxed">{item.fixStrategy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pro callout (matches what Pro actually includes) */}
      {!isSubscribed && (
        <div className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 min-w-0">
            <div className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
              <Zap className="w-3.5 h-3.5 text-fg-subtle" /> {t.ctaKicker}
            </div>
            <h3 className="text-xl font-semibold text-fg">{t.ctaTitle}</h3>
            <p className="text-sm text-fg-muted max-w-xl leading-relaxed">{t.ctaBody(PRO_PRICE)}</p>
          </div>

          <div className="shrink-0">
            <button onClick={onOpenSubscribeModal} className="btn btn-primary">
              <span>{t.ctaButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
