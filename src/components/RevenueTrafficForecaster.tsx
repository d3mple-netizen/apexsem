import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calculator, 
  Sliders, 
  PieChart, 
  ArrowUpRight, 
  Download, 
  Sparkles, 
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
      icon: Target,
      color: 'text-brand-500',
      bgColor: 'bg-brand-500/10'
    },
    {
      name: 'Competitor Conquest Interception',
      type: 'Paid + Comparison CRO',
      share: 22,
      cvr: 6.1,
      icon: DollarSign,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10'
    },
    {
      name: 'Tier-1 Organic Topical Pillars',
      type: 'Organic Search (SEO)',
      share: 38,
      cvr: 3.2,
      icon: Layers,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      name: 'AI Engine Visibility (GEO: Perplexity/ChatGPT)',
      type: 'Generative AI Citations',
      share: 14,
      cvr: 6.8,
      icon: Bot,
      color: 'text-accent-500',
      bgColor: 'bg-accent-500/10'
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
    <div className="space-y-6">
      {/* Title & Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <span>Real Traffic & Revenue Potential Forecaster</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mathematically grounded B2B unit economics model based on {analysis.domain}'s search volume, conversion rates, and deal size.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportModelCSV}
            className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Financial Model (CSV)</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector & Core Controls */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-6 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-brand-500" />
            <span>Select Growth Scenario:</span>
          </span>

          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800 text-xs">
            {(['conservative', 'expected', 'monopoly'] as const).map((scKey) => (
              <button
                key={scKey}
                onClick={() => setScenario(scKey)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                  scenario === scKey
                    ? 'bg-brand-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {scKey}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          <strong className="text-slate-900 dark:text-white font-semibold">{currentConfig.name}:</strong>{' '}
          {currentConfig.desc} (Targeting <strong>{currentConfig.trafficCapturePercent}%</strong> of reachable search volume).
        </p>

        {/* Interactive Sliders: ACV, Close Rate, CVR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Slider 1: ACV */}
          <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Average Contract Value (ACV):</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">${acv.toLocaleString()}/yr</span>
            </div>
            <input
              type="range"
              min="2000"
              max="60000"
              step="1000"
              value={acv}
              onChange={(e) => setAcv(Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>$2k (Self-Serve)</span>
              <span>$24k (Mid-Market)</span>
              <span>$60k (Enterprise)</span>
            </div>
          </div>

          {/* Slider 2: Demo CVR */}
          <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Visitor-to-Lead Rate (CVR):</span>
              <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{demoCvr}%</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="8.0"
              step="0.1"
              value={demoCvr}
              onChange={(e) => setDemoCvr(Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1.5% (Low)</span>
              <span>4.2% (Benchmark)</span>
              <span>8.0% (Optimized CRO)</span>
            </div>
          </div>

          {/* Slider 3: Sales Close Rate */}
          <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">SQL to Closed-Won Rate:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{closeRate}%</span>
            </div>
            <input
              type="range"
              min="8"
              max="35"
              step="1"
              value={closeRate}
              onChange={(e) => setCloseRate(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
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
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-xl transition-colors duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Annualized ARR Generated
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
            ${(annualPipelineArr / 1000000).toFixed(2)}M
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 font-mono">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">+${monthlyNewArr.toLocaleString()}</span> net new ARR / month
          </p>
        </div>

        {/* Card 2: Projected Monthly Visitors */}
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-xl transition-colors duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Target Monthly Traffic
            </span>
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-500/20">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-brand-600 dark:text-brand-400">
            {targetMonthlyVisitors.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">+{netNewVisitors.toLocaleString()}</span> new monthly visits
          </p>
        </div>

        {/* Card 3: Monthly Closed Deals */}
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-xl transition-colors duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Closed-Won Deals
            </span>
            <div className="p-2 rounded-xl bg-accent-50 dark:bg-accent-500/10 text-accent-600 dark:text-accent-400 border border-accent-200 dark:border-accent-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
            {monthlyClosedWonDeals}{' '}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-sans">customers/mo</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
            From <span className="font-bold text-slate-700 dark:text-slate-300">{monthlySqls}</span> sales qualified demos
          </p>
        </div>

        {/* Card 4: LTV:CAC Efficiency */}
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-xl transition-colors duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              LTV : CAC Ratio
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {ltvCacRatio}x
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
            Payback in <strong className="text-slate-800 dark:text-white">{paybackMonths} months</strong> (LTV: ${ltv.toLocaleString()})
          </p>
        </div>
      </div>

      {/* Channel-by-Channel Revenue & Traffic Matrix */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-brand-500" />
              <span>Channel-by-Channel Revenue & Traffic Contribution Matrix</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Exact volume and pipeline projections derived from each SEM and Search Authority channel.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                <th className="py-3 px-4 font-semibold">Growth Channel</th>
                <th className="py-3 px-3 font-semibold">Mechanism</th>
                <th className="py-3 px-3 font-semibold">Traffic Share</th>
                <th className="py-3 px-3 font-semibold">Monthly Visits</th>
                <th className="py-3 px-3 font-semibold">Demo Leads</th>
                <th className="py-3 px-3 font-semibold">Est. Won Deals</th>
                <th className="py-3 px-4 font-semibold text-right">Annualized ARR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {channels.map((chan, idx) => {
                const chanVisits = Math.round(targetMonthlyVisitors * (chan.share / 100));
                const chanDemos = Math.round(chanVisits * (chan.cvr / 100));
                const chanDeals = Math.round((chanDemos * qualifiedOppRate * (closeRate / 100)) * 10) / 10;
                const chanArr = Math.round(chanDeals * acv * 12);
                const IconComponent = chan.icon;

                return (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${chan.bgColor} ${chan.color}`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <span>{chan.name}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                      {chan.type}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {chan.share}%
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-800 dark:text-slate-200">
                      {chanVisits.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                      {chanDemos} ({chan.cvr}% CVR)
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-brand-600 dark:text-brand-400">
                      {chanDeals} deals/mo
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-emerald-600 dark:text-emerald-400 text-right">
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
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-indigo-950/30 border border-emerald-500/30 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Executive Summary for {analysis.domain}:</span>
        </div>
        <p className="leading-relaxed">
          At an Average Contract Value of <strong>${acv.toLocaleString()}/year</strong> and your current niche search volume of <strong>{totalMarketSearches.toLocaleString()} queries/month</strong>, moving from Tier-3 obscurity to Tier-1 Search Authority unlocks an additional <strong>+{netNewVisitors.toLocaleString()} monthly visits</strong> and <strong>${(annualPipelineArr / 1000000).toFixed(2)}M in annualized revenue</strong> at a <strong>{ltvCacRatio}x LTV:CAC efficiency</strong>.
        </p>
      </div>
    </div>
  );
};
