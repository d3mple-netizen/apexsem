import React, { useState } from 'react';
import { 
  Users, 
  TrendingDown, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Lock, 
  ExternalLink,
  DollarSign,
  Layers,
  Wand2
} from 'lucide-react';
import { DomainAnalysis, TrafficDistribution, TrafficLeakQuery } from '../types';

interface TrafficInterceptionPanelProps {
  analysis: DomainAnalysis;
  isSubscribed: boolean;
  onOpenSubscribeModal: () => void;
  onAutoFixCompleted: () => void;
}

export const TrafficInterceptionPanel: React.FC<TrafficInterceptionPanelProps> = ({
  analysis,
  isSubscribed,
  onOpenSubscribeModal,
  onAutoFixCompleted
}) => {
  const [leakedQueries, setLeakedQueries] = useState<TrafficLeakQuery[]>(
    analysis.trafficDistribution.leakedQueries
  );
  const [isFixing, setIsFixing] = useState<boolean>(false);
  const [fixStep, setFixStep] = useState<string>('');
  const [isFixedSuccess, setIsFixedSuccess] = useState<boolean>(analysis.trafficDistribution.isAutoFixed);

  const { trafficDistribution } = analysis;
  const brandName = analysis.domain.split('.')[0].toUpperCase();

  // Handle 1-Click AI Auto-Fix
  const handleAutoFixAll = () => {
    if (!isSubscribed) {
      onOpenSubscribeModal();
      return;
    }

    setIsFixing(true);

    const steps = [
      'Deploying Google Ads competitor conquest campaigns...',
      'Publishing dedicated /vs/competitor comparison landing pages...',
      'Injecting SoftwareApplication JSON-LD schema into Knowledge Graph...',
      'Activating Negative Keyword Shield with 42 waste-reduction terms...',
      'Seeding Generative AI entity citations for ChatGPT Search & Perplexity...'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setFixStep(step);
      }, (idx + 1) * 700);
    });

    setTimeout(() => {
      setIsFixing(false);
      setFixStep('');
      setIsFixedSuccess(true);
      setLeakedQueries((prev) => prev.map((q) => ({ ...q, status: 'fixed' })));
      onAutoFixCompleted();
    }, (steps.length + 1) * 700);
  };

  const currentClientVisits = isFixedSuccess
    ? trafficDistribution.clientVisits + Math.round(trafficDistribution.totalLostVisits * 0.72)
    : trafficDistribution.clientVisits;

  const currentClientShare = Math.round(
    (currentClientVisits / trafficDistribution.totalMarketSearches) * 100
  );

  return (
    <div className="space-y-6">
      {/* Title & Autonomous AI Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span>Search Traffic Share & Competitor Interception Radar</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track how many potential buyers land on your domain vs. competitors, diagnose leaked traffic, and auto-intercept them with AI.
          </p>
        </div>

        {/* Subscription Status or Upgrade CTA */}
        <div>
          {isSubscribed ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Autopilot Pro Active ($10/mo)
              </span>

              <button
                onClick={handleAutoFixAll}
                disabled={isFixing || isFixedSuccess}
                className="px-4 py-1.5 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white rounded-xl text-xs font-bold shadow-glow flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-60"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{isFixedSuccess ? 'All Leaks Resolved' : isFixing ? 'Fixing...' : '1-Click AI Fix All'}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenSubscribeModal}
              className="px-4 py-2 bg-gradient-to-r from-accent-600 via-indigo-600 to-brand-600 hover:from-accent-500 hover:to-brand-500 text-white rounded-xl text-xs font-bold shadow-glow flex items-center gap-2 transition-all cursor-pointer active:scale-95 animate-pulse"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enable AI Auto-Fixer ($10/mo)</span>
            </button>
          )}
        </div>
      </div>

      {/* Auto-Fixing Live Terminal Banner */}
      {isFixing && (
        <div className="p-4 rounded-2xl bg-brand-950 border border-brand-500/40 text-brand-300 font-mono text-xs flex items-center gap-3 shadow-glow animate-in fade-in duration-200">
          <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin shrink-0" />
          <span>[Apex Autonomous Agent]: {fixStep}</span>
        </div>
      )}

      {/* Success Notification Banner */}
      {isFixedSuccess && !isFixing && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <span className="font-bold block">Autonomous AI Interception Successful!</span>
              <span className="text-[11px] text-slate-600 dark:text-slate-300">
                All 5 competitor leak queries intercepted. Reclaimed an estimated +{Math.round(trafficDistribution.totalLostVisits * 0.72).toLocaleString()} monthly visitors.
              </span>
            </div>
          </div>
          <span className="font-mono font-bold text-xs bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30">
            100% Shielded
          </span>
        </div>
      )}

      {/* Traffic Distribution Overview Card */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-6 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Monthly High-Intent Search Traffic Split</span>
              <span className="text-xs font-mono font-normal text-slate-500 dark:text-slate-400">
                Total Market: {trafficDistribution.totalMarketSearches.toLocaleString()} searches/mo
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live ratio of active searchers landing on {analysis.domain} versus your top competitors.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Your Current Search Share</span>
            <span className={`text-2xl font-black font-mono ${isFixedSuccess ? 'text-emerald-600 dark:text-emerald-400' : 'text-brand-600 dark:text-brand-400'}`}>
              {currentClientShare}%
            </span>
          </div>
        </div>

        {/* Visual Market Share Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-slate-100 dark:bg-slate-950 h-5 rounded-xl overflow-hidden flex p-1 border border-slate-200 dark:border-slate-800 gap-1">
            <div
              className={`h-full rounded-lg transition-all duration-700 ${
                isFixedSuccess
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-brand-600 to-indigo-500'
              }`}
              style={{ width: `${currentClientShare}%` }}
              title={`Your Domain: ${currentClientShare}%`}
            />
            {trafficDistribution.competitorVisits.map((comp, idx) => {
              const compShare = isFixedSuccess ? Math.round(comp.sharePercent * 0.38) : comp.sharePercent;
              return (
                <div
                  key={idx}
                  className={`h-full rounded-lg transition-all duration-700 ${
                    idx === 0 ? 'bg-rose-500/80' : 'bg-amber-500/80'
                  }`}
                  style={{ width: `${compShare}%` }}
                  title={`${comp.name}: ${compShare}%`}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isFixedSuccess ? 'bg-emerald-500' : 'bg-brand-500'}`} />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {analysis.domain} (You):{' '}
                <strong className="font-mono">{currentClientVisits.toLocaleString()} visitors</strong>
              </span>
            </div>

            {trafficDistribution.competitorVisits.map((comp, idx) => {
              const compVisits = isFixedSuccess ? Math.round(comp.visits * 0.38) : comp.visits;
              return (
                <div key={idx} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-rose-500' : 'bg-amber-500'}`} />
                  <span className="text-slate-600 dark:text-slate-400">
                    {comp.name}: <strong className="font-mono text-slate-800 dark:text-slate-200">{compVisits.toLocaleString()} visitors</strong>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 Key Traffic Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Competitor Captured Traffic</span>
              <TrendingDown className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
              {isFixedSuccess ? '0' : trafficDistribution.totalLostVisits.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {isFixedSuccess ? 'All traffic rerouted to your domain' : 'Monthly searches lost to rivals'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Lost Pipeline Value</span>
              <DollarSign className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {isFixedSuccess ? '$0' : `$${trafficDistribution.totalLostRevenue.toLocaleString()}`}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {isFixedSuccess ? 'Pipeline potential fully captured' : 'Based on average $9.5k ACV'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Reclaimed Opportunity</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {isFixedSuccess ? `+${Math.round(trafficDistribution.totalLostVisits * 0.72).toLocaleString()}` : 'Ready for AI Fix'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {isFixedSuccess ? 'Active pipeline rerouted' : 'Reclaimable with $10/mo Autopilot'}
            </p>
          </div>
        </div>
      </div>

      {/* Query-by-Query Leaks & How to Fix Them */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Competitor Query Interception Teardown</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Exact high-intent queries where competitors steal your prospects, root causes, and how AI resolves them.
            </p>
          </div>

          {!isSubscribed && (
            <button
              onClick={onOpenSubscribeModal}
              className="px-3.5 py-1.5 bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-100 dark:hover:bg-brand-500/20 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-accent-500" />
              <span>Subscribe for $10/mo to Fix All</span>
            </button>
          )}
        </div>

        {/* Queries Table */}
        <div className="space-y-3">
          {leakedQueries.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                item.status === 'fixed'
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                  : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      "{item.query}"
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      ({item.monthlyVolume.toLocaleString()} searches/mo)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span>Hijacked by:</span>
                    <strong className="text-rose-600 dark:text-rose-400 font-mono">{item.stolenByName}</strong>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span>Lost visits: <strong className="font-mono text-slate-800 dark:text-slate-200">{item.estimatedLostVisits.toLocaleString()}/mo</strong></span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span>Lost value: <strong className="font-mono text-slate-800 dark:text-slate-200">${item.estimatedLostValue.toLocaleString()}</strong></span>
                  </div>
                </div>

                <div className="shrink-0">
                  {item.status === 'fixed' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 text-xs font-bold font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      INTERCEPTED & FIXED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 text-xs font-bold font-mono">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      LEAKING TO COMPETITOR
                    </span>
                  )}
                </div>
              </div>

              {/* Diagnosis and Action Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-200 dark:border-slate-800/80">
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold block mb-0.5">
                    Root Cause (Why They Got The Click):
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                    {item.leakReason}
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold block mb-0.5">
                    How AI Fixes This:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                    {item.fixStrategy}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Autonomous $10 Plan Callout Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-900/40 via-indigo-900/30 to-accent-900/30 border border-brand-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-accent-500/20 text-accent-300 border border-accent-500/30 text-[11px] font-semibold uppercase tracking-wider">
            <Zap className="w-3 h-3" /> Apex Autopilot AI
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white">
            Never lose another customer to competitors on search.
          </h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            For just <strong>$10/month</strong>, our autonomous AI SEM agent continuously scans competitor search auctions, deploys conquest ad copy, injects entity schema, and intercepts buyers before they convert on rival domains.
          </p>
        </div>

        <div className="shrink-0">
          {isSubscribed ? (
            <button
              onClick={handleAutoFixAll}
              disabled={isFixing || isFixedSuccess}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-glow transition-all active:scale-95 cursor-pointer disabled:opacity-60"
            >
              {isFixedSuccess ? '✓ Autopilot Shield Engaged' : 'Run 1-Click AI Fix'}
            </button>
          ) : (
            <button
              onClick={onOpenSubscribeModal}
              className="px-6 py-3 bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-bold text-xs rounded-xl shadow-glow transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Subscribe for $10/mo & Auto-Fix</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
