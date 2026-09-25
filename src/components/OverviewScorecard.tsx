import React from 'react';
import { DollarSign, TrendingUp, ShieldAlert, Target, Award, ArrowUpRight, Cpu, Layers } from 'lucide-react';
import { DomainAnalysis } from '../types';

interface OverviewScorecardProps {
  analysis: DomainAnalysis;
  onNavigateTab: (tab: string) => void;
}

export const OverviewScorecard: React.FC<OverviewScorecardProps> = ({ analysis, onNavigateTab }) => {
  const { score, metrics } = analysis;

  return (
    <div className="space-y-6">
      {/* Top Banner: Executive Summary */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="tag">
                {analysis.niche}
              </span>
              <span className="text-xs text-fg-subtle">Audience: {analysis.targetAudience}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-fg break-words">
              Agency Intelligence Dossier: <span className="font-mono text-fg-muted">{analysis.domain}</span>
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
              <span>Launch SEM Campaigns</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab('organic')}
              className="btn btn-secondary h-11 sm:h-9"
            >
              <span>View T1 Authority Plan</span>
              <Layers className="w-4 h-4 text-fg-subtle" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Grid: Master T1 Score & 5 Pillar Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Master Score Dial (4 cols) */}
        <div className="lg:col-span-4 card p-6 flex flex-col justify-between items-center text-center">
          <div className="w-full flex items-center justify-between text-xs text-fg-muted mb-2">
            <span className="flex items-center gap-1.5 font-medium text-fg">
              <Award className="w-4 h-4 text-fg-subtle" /> T1 Authority Index
            </span>
            <span className="text-fg-subtle">Calculated today</span>
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
                <span className="text-xs text-fg-subtle">out of 100</span>
              </div>
            </div>
          </div>

          <div className="w-full space-y-2">
            <div className="inset px-3 py-2 flex items-center justify-between">
              <span className="text-xs text-fg-muted">Current status</span>
              <span className="text-xs font-semibold text-fg">{score.tier}</span>
            </div>
            <p className="text-xs text-fg-muted text-center leading-relaxed pt-2">
              {score.overall >= 80
                ? 'High authority presence. Ready for aggressive competitor conquest & automated bidding scale.'
                : score.overall >= 65
                ? 'Strong challenger domain. Needs negative keyword shielding and topical cluster completion to capture Tier-1 rank.'
                : 'Emerging domain. Prioritize BOFU high-intent search ads while seeding technical schema and foundational backlinks.'}
            </p>
          </div>
        </div>

        {/* 5 Pillar Breakdown (8 cols) */}
        <div className="lg:col-span-8 card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-fg flex items-center gap-2">
              <Cpu className="w-4 h-4 text-fg-subtle" />
              <span>Core SEM & Search Authority Vectors</span>
            </h3>
            <span className="text-xs text-fg-subtle">Weighted algorithm</span>
          </div>

          <div className="space-y-5">
            {/* Vector 1 */}
            <div>
              <div className="flex justify-between gap-4 text-xs mb-2">
                <span className="text-fg-muted">Technical Crawlability & Indexing Infrastructure</span>
                <span className="font-semibold num text-fg">{score.technicalHealth}%</span>
              </div>
              <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-fg-muted transition-all duration-700"
                  style={{ width: `${score.technicalHealth}%` }}
                />
              </div>
            </div>

            {/* Vector 2 */}
            <div>
              <div className="flex justify-between gap-4 text-xs mb-2">
                <span className="text-fg-muted">SEM Architecture & High-Intent Conversion Readiness</span>
                <span className="font-semibold num text-fg">{score.semReadiness}%</span>
              </div>
              <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-fg-muted transition-all duration-700"
                  style={{ width: `${score.semReadiness}%` }}
                />
              </div>
            </div>

            {/* Vector 3 */}
            <div>
              <div className="flex justify-between gap-4 text-xs mb-2">
                <span className="text-fg-muted">Topical Authority & Semantic Knowledge Graph</span>
                <span className="font-semibold num text-fg">{score.topicalAuthority}%</span>
              </div>
              <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-fg-muted transition-all duration-700"
                  style={{ width: `${score.topicalAuthority}%` }}
                />
              </div>
            </div>

            {/* Vector 4 */}
            <div>
              <div className="flex justify-between gap-4 text-xs mb-2">
                <span className="text-fg-muted">Generative Engine Optimization (GEO: Perplexity, ChatGPT, SGE)</span>
                <span className="font-semibold num text-fg">{score.aiSearchVisibility}%</span>
              </div>
              <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-fg-muted transition-all duration-700"
                  style={{ width: `${score.aiSearchVisibility}%` }}
                />
              </div>
            </div>

            {/* Vector 5 */}
            <div>
              <div className="flex justify-between gap-4 text-xs mb-2">
                <span className="text-fg-muted">Transactional & Competitor Conquest Keyword Capture</span>
                <span className="font-semibold num text-fg">{score.highIntentCoverage}%</span>
              </div>
              <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-fg-muted transition-all duration-700"
                  style={{ width: `${score.highIntentCoverage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-line flex items-center justify-between text-xs text-fg-muted">
            <span>Next Target: <strong className="font-semibold text-fg">Tier 1 Authority (90+ Score)</strong></span>
            <button
              onClick={() => onNavigateTab('roadmap')}
              className="text-accent-fg hover:underline font-medium flex items-center gap-1 cursor-pointer"
            >
              View 30-60-90 Day Roadmap &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 4 Financial & Traffic Impact Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-fg-muted">Monthly Traffic Value</span>
            <DollarSign className="w-4 h-4 text-fg-subtle" />
          </div>
          <div className="text-2xl font-semibold num text-fg">
            ${metrics.monthlyPaidValue.toLocaleString()}
          </div>
          <p className="text-xs text-fg-subtle mt-1 flex items-center gap-1">
            <span className="text-pos font-medium num">+$24.5k</span> in organic search value
          </p>
        </div>

        {/* Metric 2 */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-fg-muted">Potential Monthly Pipeline</span>
            <TrendingUp className="w-4 h-4 text-fg-subtle" />
          </div>
          <div className="text-2xl font-semibold num text-fg">
            ${metrics.potentialMonthlyRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-fg-subtle mt-1 flex items-center gap-1">
            With 3.8x B2B funnel expansion
          </p>
        </div>

        {/* Metric 3 */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-fg-muted">T1 Target Traffic Ceiling</span>
            <Target className="w-4 h-4 text-fg-subtle" />
          </div>
          <div className="text-2xl font-semibold num text-fg">
            {metrics.targetT1TrafficEst.toLocaleString()}{' '}
            <span className="text-xs font-normal text-fg-subtle">visits/mo</span>
          </div>
          <p className="text-xs text-fg-subtle mt-1 flex items-center gap-1">
            Current: <span className="num text-fg-muted">{metrics.currentTrafficEst.toLocaleString()}</span> (3.4x upside)
          </p>
        </div>

        {/* Metric 4 */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-fg-muted">Shielded Wasted Ad Spend</span>
            <ShieldAlert className="w-4 h-4 text-fg-subtle" />
          </div>
          <div className="text-2xl font-semibold num text-fg">
            ${metrics.wastedSpendPrevented.toLocaleString()}
          </div>
          <p className="text-xs text-fg-subtle mt-1 flex items-center gap-1">
            Saved via Negative Keyword Shield
          </p>
        </div>
      </div>

      {/* Competitor Search Share Teardown */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-semibold text-fg flex items-baseline gap-2 flex-wrap">
              <span>Competitor Paid & Organic Search Landscape</span>
              <span className="text-xs font-normal text-fg-subtle">Market share distribution</span>
            </h3>
            <p className="text-xs text-fg-muted mt-1">
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
                className={`p-4 rounded border transition-colors cursor-pointer ${
                  isUserDomain
                    ? 'bg-accent-soft border-line'
                    : 'bg-surface-2 border-transparent hover:border-line-strong'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold ${isUserDomain ? 'text-accent-fg' : 'text-fg'}`}>
                    {comp.name}
                  </span>
                  <span className="text-xs num text-fg-muted">
                    {comp.marketSharePercentage}% Share
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-fg-muted">
                    <span>Est. Monthly Paid Spend:</span>
                    <span className="num font-semibold text-fg">
                      ${comp.monthlyPaidSpend.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-fg-muted block mb-1">Top Paid Keywords:</span>
                    <div className="flex flex-wrap gap-1">
                      {comp.topPaidKeywords.map((kw, i) => (
                        <span key={i} className="tag bg-surface">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-line">
                    <span className="text-fg-muted block mb-1">Exploitable Vulnerabilities:</span>
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
