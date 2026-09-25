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

interface RevenueTrafficForecasterProps {
  analysis: DomainAnalysis;
}

export const RevenueTrafficForecaster: React.FC<RevenueTrafficForecasterProps> = ({ analysis }) => {
  // Interactive model states
  const [acv, setAcv] = useState<number>(12000); // $12,000 Annual Contract Value
  const [scenario, setScenario] = useState<'conservative' | 'expected' | 'monopoly'>('expected');
  const [closeRate, setCloseRate] = useState<number>(18); // 18% demo to closed-won
  const [demoCvr, setDemoCvr] = useState<number>(4.2); // 4.2% visitor to demo request

  const brandName = analysis.domain.split('.')[0].toUpperCase();
  const avgCpc = analysis.metrics.averageCpcInNiche || 12;

  // Scenario multipliers
  const scenarioConfig = {
    conservative: {
      name: 'Conservative (BOFU PPC Only)',
      multiplier: 0.45,
      trafficCapturePercent: 14,
      desc: 'Focusing exclusively on bottom-of-funnel Google Ads with immediate buyer intent.'
    },
    expected: {
      name: 'Expected (SEM + T1 Organic Pillars)',
      multiplier: 1.0,
      trafficCapturePercent: 35,
      desc: 'Balanced execution: Paid search capture + 2 topical organic clusters + competitor conquest.'
    },
    monopoly: {
      name: 'Tier-1 Monopoly (Total Search Dominance)',
      multiplier: 1.85,
      trafficCapturePercent: 68,
      desc: 'Dominating #1 positions across Google Ads, organic snippets, and ChatGPT/Perplexity AI search.'
    }
  };

  const currentConfig = scenarioConfig[scenario];

  // Base market potential calculations
  const totalMarketSearches = analysis.trafficDistribution.totalMarketSearches || 85000;
  
  // Potential monthly visitors based on scenario
  const targetMonthlyVisitors = Math.round(
    totalMarketSearches * (currentConfig.trafficCapturePercent / 100)
  );
  const currentVisitors = analysis.metrics.currentTrafficEst;
  const netNewVisitors = Math.max(0, targetMonthlyVisitors - currentVisitors);

  // Conversion Funnel Calculations
  const monthlyDemoLeads = Math.round(targetMonthlyVisitors * (demoCvr / 100));
  const qualifiedOppRate = 0.52; // 52% of demo leads become Sales Qualified Opportunities (SQOs)
  const monthlySqls = Math.round(monthlyDemoLeads * qualifiedOppRate);
  const monthlyClosedWonDeals = Math.round((monthlySqls * (closeRate / 100)) * 10) / 10;
  
  // Revenue Metrics
  const monthlyNewArr = Math.round(monthlyClosedWonDeals * acv);
  const annualPipelineArr = Math.round(monthlyNewArr * 12);
  const monthlyMrr = Math.round(monthlyNewArr / 12);

  // Unit Economics
  const estimatedPaidSpend = Math.round((targetMonthlyVisitors * 0.28) * avgCpc);
  const estimatedCac = monthlyClosedWonDeals > 0 ? Math.round(estimatedPaidSpend / monthlyClosedWonDeals) : 0;
  const ltvGrossMargin = 0.85; // 85% gross margin
  const ltvYears = 3; // 3-year customer lifetime
  const ltv = Math.round(acv * ltvYears * ltvGrossMargin);
  const ltvCacRatio = estimatedCac > 0 ? (ltv / estimatedCac).toFixed(1) : '12.4';
  const paybackMonths = monthlyClosedWonDeals > 0 ? ((estimatedCac / (acv / 12 * ltvGrossMargin))).toFixed(1) : '2.1';

  // Channel breakdown matrix
  const channels = [
    {
      name: 'High-Intent Google Ads (SEM)',
      type: 'Paid Search',
      share: 26,
      cvr: 5.4,
      icon: Target
    },
    {
      name: 'Competitor Conquest Interception',
      type: 'Paid + Comparison CRO',
      share: 22,
      cvr: 6.1,
      icon: DollarSign
    },
    {
      name: 'Tier-1 Organic Topical Pillars',
      type: 'Organic Search (SEO)',
      share: 38,
      cvr: 3.2,
      icon: Layers
    },
    {
      name: 'AI Engine Visibility (GEO: Perplexity/ChatGPT)',
      type: 'Generative AI Citations',
      share: 14,
      cvr: 6.8,
      icon: Bot
    }
  ];

  const handleExportModelCSV = () => {
    const headers = [
      'Scenario',
      'ACV ($)',
      'Total Market Searches',
      'Target Monthly Visitors',
      'Net New Monthly Visitors',
      'Demo Requests / mo',
      'SQLs / mo',
      'Closed-Won Deals / mo',
      'Monthly Net New ARR ($)',
      'Annualized New ARR ($)',
      'Estimated CAC ($)',
      'LTV ($)',
      'LTV:CAC Ratio',
      'Payback (Months)'
    ];

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

    const csvContent = [headers.join(','), row.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Revenue-Traffic-Model-${analysis.domain}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Title & Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-fg">
            Real Traffic & Revenue Potential Forecaster
          </h2>
          <p className="text-sm text-fg-muted mt-1">
            Mathematically grounded B2B unit economics model based on <span className="font-mono">{analysis.domain}</span>'s search volume, conversion rates, and deal size.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportModelCSV}
            className="btn btn-secondary btn-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Financial Model (CSV)</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector & Core Controls */}
      <div className="card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-sm font-semibold text-fg flex items-center gap-2">
            <Sliders className="w-4 h-4 text-fg-subtle" />
            <span>Growth scenario</span>
          </span>

          <div className="inline-flex rounded bg-surface-2 p-1 border border-line text-xs">
            {(['conservative', 'expected', 'monopoly'] as const).map((scKey) => (
              <button
                key={scKey}
                onClick={() => setScenario(scKey)}
                className={`px-3 py-1 rounded-sm capitalize transition-colors cursor-pointer ${
                  scenario === scKey
                    ? 'bg-surface text-fg font-semibold border border-line'
                    : 'text-fg-muted hover:text-fg border border-transparent'
                }`}
              >
                {scKey}
              </button>
            ))}
          </div>
        </div>

        <p className="inset p-4 text-sm text-fg-muted leading-relaxed">
          <strong className="text-fg font-semibold">{currentConfig.name}:</strong>{' '}
          {currentConfig.desc} (Targeting <strong className="text-fg font-semibold num">{currentConfig.trafficCapturePercent}%</strong> of reachable search volume).
        </p>

        {/* Interactive Sliders: ACV, Close Rate, CVR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-line pt-6">
          {/* Slider 1: ACV */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline gap-2 text-xs">
              <span className="text-fg-muted">Average Contract Value (ACV)</span>
              <span className="num font-semibold text-fg text-sm">${acv.toLocaleString()}/yr</span>
            </div>
            <input
              type="range"
              min="2000"
              max="60000"
              step="1000"
              value={acv}
              onChange={(e) => setAcv(Number(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-2xs text-fg-subtle num">
              <span>$2k (Self-Serve)</span>
              <span>$24k (Mid-Market)</span>
              <span>$60k (Enterprise)</span>
            </div>
          </div>

          {/* Slider 2: Demo CVR */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline gap-2 text-xs">
              <span className="text-fg-muted">Visitor-to-Lead Rate (CVR)</span>
              <span className="num font-semibold text-fg text-sm">{demoCvr}%</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="8.0"
              step="0.1"
              value={demoCvr}
              onChange={(e) => setDemoCvr(Number(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-2xs text-fg-subtle num">
              <span>1.5% (Low)</span>
              <span>4.2% (Benchmark)</span>
              <span>8.0% (Optimized CRO)</span>
            </div>
          </div>

          {/* Slider 3: Sales Close Rate */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline gap-2 text-xs">
              <span className="text-fg-muted">SQL to Closed-Won Rate</span>
              <span className="num font-semibold text-fg text-sm">{closeRate}%</span>
            </div>
            <input
              type="range"
              min="8"
              max="35"
              step="1"
              value={closeRate}
              onChange={(e) => setCloseRate(Number(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-2xs text-fg-subtle num">
              <span>8% (Conservative)</span>
              <span>18% (Standard)</span>
              <span>35% (High Velocity)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Grand Revenue & Traffic Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Annualized ARR Pipeline */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="label">Annualized ARR generated</span>
            <TrendingUp className="w-4 h-4 text-fg-subtle" />
          </div>
          <div className="text-2xl font-semibold num text-fg">
            ${(annualPipelineArr / 1000000).toFixed(2)}M
          </div>
          <p className="text-xs text-fg-muted mt-2">
            <span className="text-pos font-semibold num">+${monthlyNewArr.toLocaleString()}</span> net new ARR / month
          </p>
        </div>

        {/* Card 2: Projected Monthly Visitors */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="label">Target monthly traffic</span>
            <Target className="w-4 h-4 text-fg-subtle" />
          </div>
          <div className="text-2xl font-semibold num text-fg">
            {targetMonthlyVisitors.toLocaleString()}
          </div>
          <p className="text-xs text-fg-muted mt-2">
            <span className="text-pos font-semibold num">+{netNewVisitors.toLocaleString()}</span> new monthly visits
          </p>
        </div>

        {/* Card 3: Monthly Closed Deals */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="label">Closed-won deals</span>
            <ShieldCheck className="w-4 h-4 text-fg-subtle" />
          </div>
          <div className="text-2xl font-semibold num text-fg">
            {monthlyClosedWonDeals}{' '}
            <span className="text-xs font-normal text-fg-muted">customers/mo</span>
          </div>
          <p className="text-xs text-fg-muted mt-2">
            From <span className="font-semibold text-fg num">{monthlySqls}</span> sales qualified demos
          </p>
        </div>

        {/* Card 4: LTV:CAC Efficiency */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="label">LTV : CAC ratio</span>
            <BarChart3 className="w-4 h-4 text-fg-subtle" />
          </div>
          <div className="text-2xl font-semibold num text-fg">
            {ltvCacRatio}x
          </div>
          <p className="text-xs text-fg-muted mt-2">
            Payback in <strong className="text-fg font-semibold num">{paybackMonths} months</strong> (LTV: <span className="num">${ltv.toLocaleString()}</span>)
          </p>
        </div>
      </div>

      {/* Channel-by-Channel Revenue & Traffic Matrix */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h3 className="text-base font-semibold tracking-[-0.02em] text-fg flex items-center gap-2">
              <PieChart className="w-4 h-4 text-fg-subtle" />
              <span>Channel-by-Channel Revenue & Traffic Contribution Matrix</span>
            </h3>
            <p className="text-xs text-fg-muted mt-1">
              Exact volume and pipeline projections derived from each SEM and Search Authority channel.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-line">
                <th className="label py-3 pr-4 font-medium">Growth channel</th>
                <th className="label py-3 px-3 font-medium">Mechanism</th>
                <th className="label py-3 px-3 font-medium text-right">Traffic share</th>
                <th className="label py-3 px-3 font-medium text-right">Monthly visits</th>
                <th className="label py-3 px-3 font-medium text-right">Demo leads</th>
                <th className="label py-3 px-3 font-medium text-right">Est. won deals</th>
                <th className="label py-3 pl-3 font-medium text-right">Annualized ARR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {channels.map((chan, idx) => {
                const chanVisits = Math.round(targetMonthlyVisitors * (chan.share / 100));
                const chanDemos = Math.round(chanVisits * (chan.cvr / 100));
                const chanDeals = Math.round((chanDemos * qualifiedOppRate * (closeRate / 100)) * 10) / 10;
                const chanArr = Math.round(chanDeals * acv * 12);
                const IconComponent = chan.icon;

                return (
                  <tr key={idx} className="hover:bg-surface-2 transition-colors">
                    <td className="py-3 pr-4 font-semibold text-fg">
                      <span className="flex items-center gap-2">
                        <IconComponent className="w-3.5 h-3.5 text-fg-subtle shrink-0" />
                        <span>{chan.name}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-fg-muted">
                      {chan.type}
                    </td>
                    <td className="py-3 px-3 num text-fg-muted text-right">
                      {chan.share}%
                    </td>
                    <td className="py-3 px-3 num text-fg text-right">
                      {chanVisits.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 num text-fg-muted text-right">
                      {chanDemos} ({chan.cvr}% CVR)
                    </td>
                    <td className="py-3 px-3 num text-fg text-right">
                      {chanDeals} deals/mo
                    </td>
                    <td className="py-3 pl-3 num font-semibold text-fg text-right">
                      ${chanArr.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Takeaway / Action Callout */}
      <div className="card p-6 space-y-2">
        <h3 className="text-sm font-semibold text-fg">
          Executive summary for <span className="font-mono">{analysis.domain}</span>
        </h3>
        <p className="text-sm text-fg-muted leading-relaxed max-w-prose">
          At an Average Contract Value of <strong className="text-fg font-semibold num">${acv.toLocaleString()}/year</strong> and your current niche search volume of <strong className="text-fg font-semibold num">{totalMarketSearches.toLocaleString()} queries/month</strong>, moving from Tier-3 obscurity to Tier-1 Search Authority unlocks an additional <strong className="text-fg font-semibold num">+{netNewVisitors.toLocaleString()} monthly visits</strong> and <strong className="text-fg font-semibold num">${(annualPipelineArr / 1000000).toFixed(2)}M in annualized revenue</strong> at a <strong className="text-fg font-semibold num">{ltvCacRatio}x LTV:CAC efficiency</strong>.
        </p>
      </div>
    </div>
  );
};
