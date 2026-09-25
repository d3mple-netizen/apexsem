import React from 'react';
import { DollarSign, TrendingUp, ShieldAlert, Target, Award, ArrowUpRight, Cpu, Layers } from 'lucide-react';
import { DomainAnalysis } from '../types';

interface OverviewScorecardProps {
  analysis: DomainAnalysis;
  onNavigateTab: (tab: string) => void;
}

export const OverviewScorecard: React.FC<OverviewScorecardProps> = ({ analysis, onNavigateTab }) => {
  const { score, metrics } = analysis;

  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (val >= 65) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getBarColor = (val: number) => {
    if (val >= 80) return 'bg-gradient-to-r from-emerald-500 to-teal-400';
    if (val >= 65) return 'bg-gradient-to-r from-amber-500 to-yellow-400';
    return 'bg-gradient-to-r from-rose-500 to-orange-400';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Executive Summary */}
      <div className="bg-gradient-to-r from-white via-slate-50 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-sm transition-colors duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-2.5 py-1 rounded-md border border-brand-200 dark:border-brand-500/20">
                {analysis.niche}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Audience: {analysis.targetAudience}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Agency Intelligence Dossier: <span className="font-mono text-brand-600 dark:text-brand-400">{analysis.domain}</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {analysis.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('sem')}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-glow transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>Launch SEM Campaigns</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('organic')}
              className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
            >
              <span>View T1 Authority Plan</span>
              <Layers className="w-3.5 h-3.5 text-accent-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Grid: Master T1 Score & 5 Pillar Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Master Score Dial (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between items-center text-center relative shadow-sm dark:shadow-lg transition-colors duration-200">
          <div className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Award className="w-4 h-4 text-brand-500" /> T1 Authority Index
            </span>
            <span className="font-mono text-slate-400">Calculated Today</span>
          </div>

          {/* Radial / Circle Score Indicator */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center relative shadow-inner">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-brand-500 transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * score.overall) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-4xl font-extrabold font-mono ${getScoreColor(score.overall)}`}>
                  {score.overall}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">out of 100</span>
              </div>
            </div>
          </div>

          <div className="w-full space-y-2">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">Current Status:</span>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-300 font-mono">{score.tier}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
              {score.overall >= 80
                ? 'High authority presence. Ready for aggressive competitor conquest & automated bidding scale.'
                : score.overall >= 65
                ? 'Strong challenger domain. Needs negative keyword shielding and topical cluster completion to capture Tier-1 rank.'
                : 'Emerging domain. Prioritize BOFU high-intent search ads while seeding technical schema and foundational backlinks.'}
            </p>
          </div>
        </div>

        {/* 5 Pillar Breakdown (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-lg flex flex-col justify-between transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-500" />
              <span>Core SEM & Search Authority Vectors</span>
            </h3>
            <span className="text-xs text-slate-400">Weighted Algorithm</span>
          </div>

          <div className="space-y-4">
            {/* Vector 1 */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Technical Crawlability & Indexing Infrastructure</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{score.technicalHealth}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getBarColor(score.technicalHealth)}`}
                  style={{ width: `${score.technicalHealth}%` }}
                />
              </div>
            </div>

            {/* Vector 2 */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-700 dark:text-slate-300 font-medium">SEM Architecture & High-Intent Conversion Readiness</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{score.semReadiness}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getBarColor(score.semReadiness)}`}
                  style={{ width: `${score.semReadiness}%` }}
                />
              </div>
            </div>

            {/* Vector 3 */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Topical Authority & Semantic Knowledge Graph</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{score.topicalAuthority}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getBarColor(score.topicalAuthority)}`}
                  style={{ width: `${score.topicalAuthority}%` }}
                />
              </div>
            </div>

            {/* Vector 4 */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Generative Engine Optimization (GEO: Perplexity, ChatGPT, SGE)</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{score.aiSearchVisibility}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getBarColor(score.aiSearchVisibility)}`}
                  style={{ width: `${score.aiSearchVisibility}%` }}
                />
              </div>
            </div>

            {/* Vector 5 */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Transactional & Competitor Conquest Keyword Capture</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{score.highIntentCoverage}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getBarColor(score.highIntentCoverage)}`}
                  style={{ width: `${score.highIntentCoverage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Next Target: <strong className="text-slate-800 dark:text-white">Tier 1 Authority (90+ Score)</strong></span>
            <button
              onClick={() => onNavigateTab('roadmap')}
              className="text-brand-600 dark:text-brand-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              View 30-60-90 Day Roadmap &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 4 Financial & Traffic Impact Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Monthly Traffic Value</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            ${metrics.monthlyPaidValue.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">+$24.5k</span> in organic search value
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Potential Monthly Pipeline</span>
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            ${metrics.potentialMonthlyRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            With 3.8x B2B funnel expansion
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">T1 Target Traffic Ceiling</span>
            <div className="p-2 rounded-lg bg-accent-500/10 text-accent-600 dark:text-accent-400 border border-accent-500/20">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {metrics.targetT1TrafficEst.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400 font-sans">visits/mo</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            Current: <span className="font-mono text-slate-700 dark:text-slate-300">{metrics.currentTrafficEst.toLocaleString()}</span> (3.4x upside)
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Shielded Wasted Ad Spend</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            ${metrics.wastedSpendPrevented.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            Saved via Negative Keyword Shield
          </p>
        </div>
      </div>

      {/* Competitor Search Share Teardown */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-lg transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Competitor Paid & Organic Search Landscape</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">Market Share Distribution</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Identify where legacy competitors are spending budget and where conquest opportunities exist.
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
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isUserDomain
                    ? 'bg-brand-50 dark:bg-brand-950/30 border-brand-300 dark:border-brand-500/40 shadow-glow'
                    : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800/80 hover:border-brand-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-bold ${isUserDomain ? 'text-brand-600 dark:text-brand-300' : 'text-slate-900 dark:text-white'}`}>
                    {comp.name}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    {comp.marketSharePercentage}% Share
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Est. Monthly Paid Spend:</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      ${comp.monthlyPaidSpend.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Top Paid Keywords:</span>
                    <div className="flex flex-wrap gap-1">
                      {comp.topPaidKeywords.map((kw, i) => (
                        <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Exploitable Vulnerabilities:</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-700 dark:text-slate-300 space-y-0.5">
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
