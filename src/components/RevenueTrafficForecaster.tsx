import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Sliders,
  PieChart,
  Download,
  ShieldCheck,
  Target,
  BarChart3,
  Layers,
  Bot
} from 'lucide-react';
import { DomainAnalysis } from '../types';
import { useDict, useI18n } from '../i18n';
import { revenue } from '../i18n/dict/revenue';
import { approx, approxRange, EstimateBadge } from '../lib/honest';

interface RevenueTrafficForecasterProps {
  analysis: DomainAnalysis;
}

type ScenarioKey = 'conservative' | 'expected' | 'monopoly';

// Share of modeled niche demand each scenario assumes you capture.
const CAPTURE_PERCENT: Record<ScenarioKey, number> = { conservative: 14, expected: 35, monopoly: 68 };

export const RevenueTrafficForecaster: React.FC<RevenueTrafficForecasterProps> = ({ analysis }) => {
  const t = useDict(revenue);
  const { lang, fmt } = useI18n();

  // Interactive model states (user-supplied inputs)
  const [acv, setAcv] = useState<number>(12000); // $12,000 Annual Contract Value
  const [scenario, setScenario] = useState<ScenarioKey>('expected');
  const [closeRate, setCloseRate] = useState<number>(18); // 18% SQL to closed-won
  const [demoCvr, setDemoCvr] = useState<number>(4.2); // 4.2% visitor to lead

  const avgCpc = analysis.metrics.averageCpcInNiche || 12;

  const currentConfig = {
    ...t.scenarios[scenario],
    trafficCapturePercent: CAPTURE_PERCENT[scenario]
  };

  // Modeled niche demand (estimate, not measured)
  const totalMarketSearches = analysis.trafficDistribution.totalMarketSearches || 85000;
  const demandRange = approxRange(totalMarketSearches);

  // Potential monthly visitors based on scenario
  const targetMonthlyVisitors = Math.round(
    totalMarketSearches * (currentConfig.trafficCapturePercent / 100)
  );
  const currentVisitors = analysis.metrics.currentTrafficEst;
  const netNewVisitors = Math.max(0, targetMonthlyVisitors - currentVisitors);

  // Conversion Funnel Calculations
  const monthlyDemoLeads = Math.round(targetMonthlyVisitors * (demoCvr / 100));
  const qualifiedOppRate = 0.52; // assumption: 52% of leads become SQLs
  const monthlySqls = Math.round(monthlyDemoLeads * qualifiedOppRate);
  const monthlyClosedWonDeals = Math.round((monthlySqls * (closeRate / 100)) * 10) / 10;

  // Revenue Metrics
  const monthlyNewArr = Math.round(monthlyClosedWonDeals * acv);
  const annualPipelineArr = Math.round(monthlyNewArr * 12);

  // Unit Economics (assumptions spelled out in the UI)
  const estimatedPaidSpend = Math.round((targetMonthlyVisitors * 0.28) * avgCpc);
  const estimatedCac = monthlyClosedWonDeals > 0 ? Math.round(estimatedPaidSpend / monthlyClosedWonDeals) : 0;
  const ltvGrossMargin = 0.85; // 85% gross margin
  const ltvYears = 3; // 3-year customer lifetime
  const ltv = Math.round(acv * ltvYears * ltvGrossMargin);
  const ltvCacRatio = estimatedCac > 0 ? (ltv / estimatedCac).toFixed(1) : '';
  const paybackMonths = estimatedCac > 0 ? (estimatedCac / (acv / 12 * ltvGrossMargin)).toFixed(1) : '';

  const dec = (s: string) => (lang === 'ru' ? s.replace('.', ',') : s);
  const ratioLabel = ltvCacRatio ? `${dec(ltvCacRatio)}x` : '-';
  const paybackLabel = paybackMonths ? `${dec(paybackMonths)} ${t.months}` : '-';
  const dealsLabel = (n: number) => (n >= 10 ? fmt(Math.round(n)) : dec(n.toFixed(1)));

  // Channel breakdown: illustrative split, shares and CVRs are assumptions
  const channels = [
    { key: 'sem', share: 25, cvr: 5.4, icon: Target },
    { key: 'conquest', share: 20, cvr: 6.1, icon: DollarSign },
    { key: 'organic', share: 40, cvr: 3.2, icon: Layers },
    { key: 'geo', share: 15, cvr: 6.8, icon: Bot }
  ] as const;

  const handleExportModelCSV = () => {
    const h = t.csv;
    const headers = [h.scenario, h.acv, h.demand, h.visitors, h.netNew, h.leads, h.sqls, h.deals, h.monthlyArr, h.annualArr, h.cac, h.ltv, h.ratio, h.payback];

    const row = [
      `"${currentConfig.name}"`,
      acv,
      totalMarketSearches,
      targetMonthlyVisitors,
      netNewVisitors,
      monthlyDemoLeads,
      monthlySqls,
      monthlyClosedWonDeals,
      monthlyNewArr,
      annualPipelineArr,
      estimatedCac,
      ltv,
      ltvCacRatio,
      paybackMonths
    ];

    const csvContent = [headers.map((x) => `"${x}"`).join(','), row.join(',')].join('\n');
    const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${h.file}-${analysis.domain}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const summaryParts = t.summary(
    `$${fmt(acv)}`,
    demandRange,
    approx(netNewVisitors),
    approxRange(annualPipelineArr, { money: true }),
    ratioLabel
  );

  return (
    <div className="space-y-8">
      {/* Title & Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-fg">
            {t.title}
          </h2>
          <p className="text-sm text-fg-muted mt-1">
            {t.subtitle} <span className="font-mono break-all">{analysis.domain}</span> {t.subtitleTail}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportModelCSV}
            className="btn btn-secondary btn-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportCsv}</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector & Core Controls */}
      <div className="card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-sm font-medium text-fg flex items-center gap-2">
            <Sliders className="w-4 h-4 text-fg-subtle" />
            <span>{t.scenarioTitle}</span>
          </span>

          <div className="inline-flex rounded bg-surface-2 p-1 border border-line text-xs">
            {(['conservative', 'expected', 'monopoly'] as const).map((scKey) => (
              <button
                key={scKey}
                onClick={() => setScenario(scKey)}
                className={`flex-1 px-3 h-9 sm:h-auto sm:py-1 rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
                  scenario === scKey
                    ? 'bg-surface text-fg font-medium border border-line'
                    : 'text-fg-muted hover:text-fg border border-transparent'
                }`}
              >
                {t.scenarioTabs[scKey]}
              </button>
            ))}
          </div>
        </div>

        <p className="inset p-4 text-sm text-fg-muted leading-relaxed">
          <strong className="text-fg font-medium">{currentConfig.name}:</strong>{' '}
          {currentConfig.desc} {t.captureAssumption(currentConfig.trafficCapturePercent, demandRange)}{' '}
          <EstimateBadge />
        </p>

        {/* Interactive Sliders: ACV, Close Rate, CVR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-line pt-6">
          {/* Slider 1: ACV */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline gap-2 text-xs">
              <span className="text-fg-muted">{t.acv}</span>
              <span className="num font-medium text-fg text-sm whitespace-nowrap">${fmt(acv)}{t.perYear}</span>
            </div>
            <input
              type="range"
              min="2000"
              max="60000"
              step="1000"
              value={acv}
              onChange={(e) => setAcv(Number(e.target.value))}
              aria-label={t.acv}
              className="w-full accent-accent cursor-pointer"
            />
            <div className="flex justify-between gap-2 text-2xs text-fg-subtle num">
              {t.acvTicks.map((tick) => <span key={tick}>{tick}</span>)}
            </div>
          </div>

          {/* Slider 2: Visitor-to-lead CVR */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline gap-2 text-xs">
              <span className="text-fg-muted">{t.cvr}</span>
              <span className="num font-medium text-fg text-sm">{dec(demoCvr.toFixed(1))}%</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="8.0"
              step="0.1"
              value={demoCvr}
              onChange={(e) => setDemoCvr(Number(e.target.value))}
              aria-label={t.cvr}
              className="w-full accent-accent cursor-pointer"
            />
            <div className="flex justify-between gap-2 text-2xs text-fg-subtle num">
              {t.cvrTicks.map((tick) => <span key={tick}>{dec(tick)}</span>)}
            </div>
          </div>

          {/* Slider 3: Sales Close Rate */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline gap-2 text-xs">
              <span className="text-fg-muted">{t.close}</span>
              <span className="num font-medium text-fg text-sm">{closeRate}%</span>
            </div>
            <input
              type="range"
              min="8"
              max="35"
              step="1"
              value={closeRate}
              onChange={(e) => setCloseRate(Number(e.target.value))}
              aria-label={t.close}
              className="w-full accent-accent cursor-pointer"
            />
            <div className="flex justify-between gap-2 text-2xs text-fg-subtle num">
              {t.closeTicks.map((tick) => <span key={tick}>{tick}</span>)}
            </div>
          </div>
        </div>

        <p className="text-xs text-fg-subtle leading-relaxed">
          {t.assumptions(approx(avgCpc, { money: true }))}
        </p>
      </div>

      {/* 4 Revenue & Traffic Projection Cards (from user inputs + modeled demand) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Annual new ARR */}
        <div className="card p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="label min-w-0">{t.arr}</span>
            <span className="flex items-center gap-2 shrink-0">
              <EstimateBadge />
              <TrendingUp className="w-4 h-4 text-fg-subtle" />
            </span>
          </div>
          <div className="text-2xl font-semibold num text-fg">
            {approxRange(annualPipelineArr, { money: true })}
          </div>
          <p className="text-xs text-fg-muted mt-2">
            <span className="text-pos font-medium num">+{approx(monthlyNewArr, { money: true })}</span> {t.arrSub}
          </p>
        </div>

        {/* Card 2: Projected Monthly Visitors */}
        <div className="card p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="label min-w-0">{t.traffic}</span>
            <span className="flex items-center gap-2 shrink-0">
              <EstimateBadge />
              <Target className="w-4 h-4 text-fg-subtle" />
            </span>
          </div>
          <div className="text-2xl font-semibold num text-fg">
            {approxRange(targetMonthlyVisitors)}
          </div>
          <p className="text-xs text-fg-muted mt-2">
            <span className="text-pos font-medium num">+{approx(netNewVisitors)}</span> {t.trafficSub}
          </p>
        </div>

        {/* Card 3: Monthly Closed Deals */}
        <div className="card p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="label min-w-0">{t.deals}</span>
            <span className="flex items-center gap-2 shrink-0">
              <EstimateBadge />
              <ShieldCheck className="w-4 h-4 text-fg-subtle" />
            </span>
          </div>
          <div className="text-2xl font-semibold num text-fg">
            ~{dealsLabel(monthlyClosedWonDeals)}{' '}
            <span className="text-xs font-normal text-fg-muted">{t.customersMo}</span>
          </div>
          <p className="text-xs text-fg-muted mt-2">
            {t.dealsFrom} <span className="font-medium text-fg num">{approx(monthlySqls)}</span> {t.dealsFromTail}
          </p>
        </div>

        {/* Card 4: LTV:CAC Efficiency */}
        <div className="card p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="label min-w-0">{t.ltvCac}</span>
            <span className="flex items-center gap-2 shrink-0">
              <EstimateBadge />
              <BarChart3 className="w-4 h-4 text-fg-subtle" />
            </span>
          </div>
          <div className="text-2xl font-semibold num text-fg">
            {ratioLabel}
          </div>
          <p className="text-xs text-fg-muted mt-2">
            {t.payback} <strong className="text-fg font-medium num">{paybackLabel}</strong> ({t.ltv}: <span className="num">{approx(ltv, { money: true })}</span>)
          </p>
        </div>
      </div>

      {/* Channel-by-Channel Projection Matrix */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h3 className="text-base font-semibold tracking-[-0.02em] text-fg flex items-center gap-2 flex-wrap">
              <PieChart className="w-4 h-4 text-fg-subtle" />
              <span>{t.channelsTitle}</span>
              <EstimateBadge />
            </h3>
            <p className="text-xs text-fg-muted mt-1">
              {t.channelsSub}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-line">
                <th className="label py-3 pr-4 font-medium">{t.th.channel}</th>
                <th className="label py-3 px-3 font-medium">{t.th.mechanism}</th>
                <th className="label py-3 px-3 font-medium text-right">{t.th.share}</th>
                <th className="label py-3 px-3 font-medium text-right">{t.th.visits}</th>
                <th className="label py-3 px-3 font-medium text-right">{t.th.leads}</th>
                <th className="label py-3 px-3 font-medium text-right">{t.th.deals}</th>
                <th className="label py-3 pl-3 font-medium text-right">{t.th.arr}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {channels.map((chan) => {
                const chanVisits = Math.round(targetMonthlyVisitors * (chan.share / 100));
                const chanDemos = Math.round(chanVisits * (chan.cvr / 100));
                const chanDeals = Math.round((chanDemos * qualifiedOppRate * (closeRate / 100)) * 10) / 10;
                const chanArr = Math.round(chanDeals * acv * 12);
                const IconComponent = chan.icon;
                const copy = t.channels[chan.key];

                return (
                  <tr key={chan.key} className="hover:bg-surface-2 transition-colors">
                    <td className="py-3 pr-4 font-medium text-fg">
                      <span className="flex items-center gap-2">
                        <IconComponent className="w-3.5 h-3.5 text-fg-subtle shrink-0" />
                        <span>{copy.name}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-fg-muted">
                      {copy.type}
                    </td>
                    <td className="py-3 px-3 num text-fg-muted text-right">
                      ~{chan.share}%
                    </td>
                    <td className="py-3 px-3 num text-fg text-right">
                      {approx(chanVisits)}
                    </td>
                    <td className="py-3 px-3 num text-fg-muted text-right whitespace-nowrap">
                      {approx(chanDemos)} ({dec(chan.cvr.toFixed(1))}% {t.cvrShort})
                    </td>
                    <td className="py-3 px-3 num text-fg text-right">
                      ~{dealsLabel(chanDeals)}
                    </td>
                    <td className="py-3 pl-3 num font-medium text-fg text-right">
                      {approx(chanArr, { money: true })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Takeaway */}
      <div className="card p-6 space-y-2">
        <h3 className="text-sm font-medium text-fg">
          {t.summaryTitle} <span className="font-mono">{analysis.domain}</span>
        </h3>
        <p className="text-sm text-fg-muted leading-relaxed max-w-prose">
          {summaryParts.map((part, i) =>
            i % 2 === 1 ? (
              <strong key={i} className="text-fg font-medium num">{part}</strong>
            ) : (
              <React.Fragment key={i}>{part}</React.Fragment>
            )
          )}
        </p>
      </div>
    </div>
  );
};
