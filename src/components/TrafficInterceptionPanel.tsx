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
  Wand2,
  Check
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
    <div className="space-y-8">
      {/* Title & Autonomous AI Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-fg flex items-center gap-2">
            <Users className="w-4 h-4 text-fg-subtle" />
            <span>Search Traffic Share & Competitor Interception Radar</span>
          </h2>
          <p className="text-sm text-fg-muted mt-1">
            Track how many potential buyers land on your domain vs. competitors, diagnose leaked traffic, and auto-intercept them with AI.
          </p>
        </div>

        {/* Subscription Status or Upgrade CTA */}
        <div>
          {isSubscribed ? (
            <div className="flex items-center gap-4">
              <span className="text-xs text-fg-muted flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Autopilot Pro Active <span className="num">($49/mo)</span>
              </span>

              <button
                onClick={handleAutoFixAll}
                disabled={isFixing || isFixedSuccess}
                className="btn btn-primary btn-sm"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{isFixedSuccess ? 'All Leaks Resolved' : isFixing ? 'Fixing...' : '1-Click AI Fix All'}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenSubscribeModal}
              className="btn btn-primary btn-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="num">Enable AI Auto-Fixer ($49/mo)</span>
            </button>
          )}
        </div>
      </div>

      {/* Auto-Fixing Live Terminal Banner */}
      {isFixing && (
        <div className="card p-4 font-mono text-xs text-fg-muted flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin shrink-0" />
          <span>[Apex Autonomous Agent]: {fixStep}</span>
        </div>
      )}

      {/* Success Notification Banner */}
      {isFixedSuccess && !isFixing && (
        <div className="card p-4 text-xs flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Check className="w-4 h-4 text-fg-subtle shrink-0" />
            <div>
              <span className="text-sm font-semibold text-fg block">Autonomous AI Interception Successful</span>
              <span className="text-xs text-fg-muted">
                All 5 competitor leak queries intercepted. Reclaimed an estimated <span className="num text-pos">+{Math.round(trafficDistribution.totalLostVisits * 0.72).toLocaleString()}</span> monthly visitors.
              </span>
            </div>
          </div>
          <span className="tag num shrink-0">
            100% Shielded
          </span>
        </div>
      )}

      {/* Traffic Distribution Overview Card */}
      <div className="card p-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-fg">
              Monthly High-Intent Search Traffic Split
            </h3>
            <p className="text-xs text-fg-muted mt-1">
              Live ratio of active searchers landing on {analysis.domain} versus your top competitors.{' '}
              <span className="text-fg-subtle num">
                Total Market: {trafficDistribution.totalMarketSearches.toLocaleString()} searches/mo
              </span>
            </p>
          </div>

          <div className="sm:text-right">
            <span className="label block">Your Current Search Share</span>
            <span className={`text-2xl font-semibold num ${isFixedSuccess ? 'text-pos' : 'text-fg'}`}>
              {currentClientShare}%
            </span>
          </div>
        </div>

        {/* Visual Market Share Progress Bar */}
        <div className="space-y-4">
          <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden flex gap-px">
            <div
              className="h-full bg-accent transition-all duration-700"
              style={{ width: `${currentClientShare}%` }}
              title={`Your Domain: ${currentClientShare}%`}
            />
            {trafficDistribution.competitorVisits.map((comp, idx) => {
              const compShare = isFixedSuccess ? Math.round(comp.sharePercent * 0.38) : comp.sharePercent;
              return (
                <div
                  key={idx}
                  className={`h-full transition-all duration-700 ${
                    idx === 0 ? 'bg-fg-muted' : 'bg-fg-subtle'
                  }`}
                  style={{ width: `${compShare}%` }}
                  title={`${comp.name}: ${compShare}%`}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center text-xs gap-x-6 gap-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-fg">
                {analysis.domain} (You):{' '}
                <strong className="font-semibold num">{currentClientVisits.toLocaleString()} visitors</strong>
              </span>
            </div>

            {trafficDistribution.competitorVisits.map((comp, idx) => {
              const compVisits = isFixedSuccess ? Math.round(comp.visits * 0.38) : comp.visits;
              return (
                <div key={idx} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-fg-muted' : 'bg-fg-subtle'}`} />
                  <span className="text-fg-muted">
                    {comp.name}: <strong className="font-semibold num text-fg">{compVisits.toLocaleString()} visitors</strong>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 Key Traffic Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="inset p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="label">Competitor Captured Traffic</span>
              <TrendingDown className="w-4 h-4 text-fg-subtle" />
            </div>
            <div className={`text-2xl font-semibold num ${isFixedSuccess ? 'text-fg' : 'text-neg'}`}>
              {isFixedSuccess ? '0' : trafficDistribution.totalLostVisits.toLocaleString()}
            </div>
            <p className="text-xs text-fg-subtle mt-1">
              {isFixedSuccess ? 'All traffic rerouted to your domain' : 'Monthly searches lost to rivals'}
            </p>
          </div>

          <div className="inset p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="label">Lost Pipeline Value</span>
              <DollarSign className="w-4 h-4 text-fg-subtle" />
            </div>
            <div className="text-2xl font-semibold num text-fg">
              {isFixedSuccess ? '$0' : `$${trafficDistribution.totalLostRevenue.toLocaleString()}`}
            </div>
            <p className="text-xs text-fg-subtle mt-1">
              {isFixedSuccess ? 'Pipeline potential fully captured' : 'Based on average $9.5k ACV'}
            </p>
          </div>

          <div className="inset p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="label">Reclaimed Opportunity</span>
              <TrendingUp className="w-4 h-4 text-fg-subtle" />
            </div>
            <div className={isFixedSuccess ? 'text-2xl font-semibold num text-pos' : 'text-base font-semibold text-fg-muted py-1'}>
              {isFixedSuccess ? `+${Math.round(trafficDistribution.totalLostVisits * 0.72).toLocaleString()}` : 'Ready for AI Fix'}
            </div>
            <p className="text-xs text-fg-subtle mt-1">
              {isFixedSuccess ? 'Active pipeline rerouted' : 'Reclaimable with $49/mo Autopilot'}
            </p>
          </div>
        </div>
      </div>

      {/* Query-by-Query Leaks & How to Fix Them */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-semibold text-fg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-fg-subtle" />
              <span>Competitor Query Interception Teardown</span>
            </h3>
            <p className="text-xs text-fg-muted mt-1">
              Exact high-intent queries where competitors steal your prospects, root causes, and how AI resolves them.
            </p>
          </div>

          {!isSubscribed && (
            <button
              onClick={onOpenSubscribeModal}
              className="btn btn-secondary btn-sm"
            >
              <Zap className="w-3.5 h-3.5 text-fg-subtle" />
              <span>Subscribe for $49/mo to Fix All</span>
            </button>
          )}
        </div>

        {/* Queries Table */}
        <div className="divide-y divide-line border-t border-line">
          {leakedQueries.map((item) => (
            <div
              key={item.id}
              className="py-5 last:pb-0"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-fg">
                      "{item.query}"
                    </span>
                    <span className="text-xs text-fg-subtle num">
                      ({item.monthlyVolume.toLocaleString()} searches/mo)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs text-fg-muted">
                    <span>Hijacked by:</span>
                    <strong className="font-medium text-fg">{item.stolenByName}</strong>
                    <span className="text-fg-subtle">·</span>
                    <span>Lost visits: <strong className="font-medium num text-fg">{item.estimatedLostVisits.toLocaleString()}/mo</strong></span>
                    <span className="text-fg-subtle">·</span>
                    <span>Lost value: <strong className="font-medium num text-neg">${item.estimatedLostValue.toLocaleString()}</strong></span>
                  </div>
                </div>

                <div className="shrink-0">
                  {item.status === 'fixed' ? (
                    <span className="tag">
                      <Check className="w-3 h-3 text-fg-subtle" />
                      Intercepted & fixed
                    </span>
                  ) : (
                    <span className="tag">
                      <AlertTriangle className="w-3 h-3" />
                      Leaking to competitor
                    </span>
                  )}
                </div>
              </div>

              {/* Diagnosis and Action Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="inset p-3">
                  <span className="text-fg-subtle font-medium block mb-1">
                    Root Cause (Why They Got The Click):
                  </span>
                  <p className="text-fg-muted text-xs leading-relaxed">
                    {item.leakReason}
                  </p>
                </div>

                <div className="inset p-3">
                  <span className="text-fg-subtle font-medium block mb-1">
                    How AI Fixes This:
                  </span>
                  <p className="text-fg-muted text-xs leading-relaxed">
                    {item.fixStrategy}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Autonomous $10 Plan Callout Box */}
      <div className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
            <Zap className="w-3.5 h-3.5 text-fg-subtle" /> Apex Autopilot AI
          </div>
          <h3 className="text-xl font-semibold text-fg">
            Never lose another customer to competitors on search.
          </h3>
          <p className="text-sm text-fg-muted max-w-xl leading-relaxed">
            For just <strong className="font-semibold text-fg num">$49/month</strong>, our autonomous AI SEM agent continuously scans competitor search auctions, deploys conquest ad copy, injects entity schema, and intercepts buyers before they convert on rival domains.
          </p>
        </div>

        <div className="shrink-0">
          {isSubscribed ? (
            <button
              onClick={handleAutoFixAll}
              disabled={isFixing || isFixedSuccess}
              className="btn btn-primary"
            >
              {isFixedSuccess && <Check className="w-4 h-4" />}
              {isFixedSuccess ? 'Autopilot Shield Engaged' : 'Run 1-Click AI Fix'}
            </button>
          ) : (
            <button
              onClick={onOpenSubscribeModal}
              className="btn btn-primary"
            >
              <span>Subscribe for $49/mo & Auto-Fix</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
