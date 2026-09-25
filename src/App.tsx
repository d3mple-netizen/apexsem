import React, { useState, useEffect, useCallback } from 'react';
import { Check, MessageSquare } from 'lucide-react';
import { Header } from './components/Header';
import { DomainSearchBar } from './components/DomainSearchBar';
import { OverviewScorecard } from './components/OverviewScorecard';
import { RevenueTrafficForecaster } from './components/RevenueTrafficForecaster';
import { TrafficInterceptionPanel } from './components/TrafficInterceptionPanel';
import { SEMArchitect } from './components/SEMArchitect';
import { T1OrganicDomination } from './components/T1OrganicDomination';
import { CROStudio } from './components/CROStudio';
import { ActionRoadmap } from './components/ActionRoadmap';
import { AgencyChatDrawer } from './components/AgencyChatDrawer';
import { SubscriptionModal } from './components/SubscriptionModal';
import { Hero } from './components/Hero';
import { generateDomainAnalysis, analyzeDomain, cleanDomain, AnalyzeError } from './services/analyzer';
import { canAnalyze, isPro, recordAnalysis, remainingToday, usedToday, PRO_PRICE } from './services/usage';
import { DomainAnalysis } from './types';

export function App() {
  const [currentDomain, setCurrentDomain] = useState<string>('linear.app');
  const [analysis, setAnalysis] = useState<DomainAnalysis>(() => generateDomainAnalysis('linear.app', 'sample'));
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number>(() => remainingToday());
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'traffic' | 'sem' | 'organic' | 'cro' | 'roadmap'>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Plans: Free (daily quota) and Pro (activated manually for now)
  const [isSubscribed] = useState<boolean>(() => isPro());
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState<boolean>(false);
  const [planModalReason, setPlanModalReason] = useState<'limit' | 'upgrade'>('upgrade');
  const openPlans = useCallback((reason: 'limit' | 'upgrade' = 'upgrade') => {
    setPlanModalReason(reason);
    setIsSubscribeModalOpen(true);
  }, []);
  const closePlans = useCallback(() => setIsSubscribeModalOpen(false), []);

  // Theme Management (Light & Dark)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('apex_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('apex_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAnalyze = async (domain: string) => {
    if (isLoading) return;
    if (!canAnalyze()) {
      setRemaining(0);
      openPlans('limit');
      return;
    }
    const cleaned = cleanDomain(domain);
    setAnalyzeError(null);
    setIsLoading(true);
    setCurrentDomain(cleaned);

    try {
      const result = await analyzeDomain(cleaned);
      setAnalysis(result);
      setActiveTab('overview');
      setHasAnalyzed(true);
      recordAnalysis();
      setRemaining(remainingToday());
      showToast(
        result.source === 'crawl' || result.source === 'crawl+ai'
          ? `Analyzed ${result.domain} from a live crawl`
          : `Couldn't crawl ${result.domain}; showing an estimate`
      );
    } catch (err) {
      setAnalyzeError(err instanceof AnalyzeError ? err.message : 'Analysis failed. Check the domain and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoFixCompleted = () => {
    setAnalysis((prev) => ({
      ...prev,
      trafficDistribution: {
        ...prev.trafficDistribution,
        isAutoFixed: true,
        leakedQueries: prev.trafficDistribution.leakedQueries.map((q) => ({ ...q, status: 'fixed' }))
      }
    }));
    showToast('AI Auto-Fixer: All 5 competitor traffic leaks resolved & rerouted!');
  };

  const handleExportPlaybook = () => {
    const reportData = `# ApexSEM Playbook
Domain: ${analysis.domain}
URL: ${analysis.url}
Niche: ${analysis.niche}
Analyzed At: ${analysis.analyzedAt}
T1 Authority Score: ${analysis.score.overall}/100 (${analysis.score.tier})

## Core Financial & Traffic Metrics
- Monthly Paid Traffic Value: $${analysis.metrics.monthlyPaidValue.toLocaleString()}
- Potential Monthly Pipeline: $${analysis.metrics.potentialMonthlyRevenue.toLocaleString()}
- Current Traffic Estimate: ${analysis.metrics.currentTrafficEst.toLocaleString()} visits/mo
- Target T1 Traffic: ${analysis.metrics.targetT1TrafficEst.toLocaleString()} visits/mo
- Shielded Wasted Spend: $${analysis.metrics.wastedSpendPrevented.toLocaleString()}

## Competitor Traffic Leak Analysis
- Total Monthly Searches: ${analysis.trafficDistribution.totalMarketSearches.toLocaleString()}
- Client Domain Visits: ${analysis.trafficDistribution.clientVisits.toLocaleString()} (${analysis.trafficDistribution.clientSharePercent}%)
- Competitor Stolen Visits: ${analysis.trafficDistribution.totalLostVisits.toLocaleString()}
- Competitor Stolen Value: $${analysis.trafficDistribution.totalLostRevenue.toLocaleString()}

## High Intent Target Keywords
${analysis.keywords.map(k => `- ${k.keyword} | Match: [${k.matchType}] | Vol: ${k.monthlyVolume} | CPC: $${k.cpc} | Opp Score: ${k.opportunityScore}/100`).join('\n')}

## Google Ads Responsive Search Ads
${analysis.campaigns.map(c => `### ${c.campaignType}
Headlines:
${c.headlines.map(h => `  • ${h}`).join('\n')}
Descriptions:
${c.descriptions.map(d => `  • ${d}`).join('\n')}
`).join('\n')}

## Negative Keyword Shield (Prevented Waste)
${analysis.negativeKeywords.join(', ')}

## T1 Topical Authority Clusters
${analysis.topicalClusters.map(cl => `### Pillar: ${cl.pillarTitle} (Keyword: ${cl.targetKeyword})
Subtopics:
${cl.clusterSubtopics.map(sub => `  - [${sub.format}] ${sub.title} (${sub.targetKeyword})`).join('\n')}`).join('\n\n')}

## 30-60-90 Day Domination Roadmap
${analysis.roadmap.map(r => `[${r.status.toUpperCase()}] ${r.phase}: ${r.title} (${r.category} | ${r.impact} Impact)`).join('\n')}
`;

    const blob = new Blob([reportData], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ApexSEM-Playbook-${analysis.domain}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Downloaded ApexSEM-Playbook-${analysis.domain}.md`);
  };

  const tabs: { id: typeof activeTab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'revenue', label: 'Revenue potential' },
    { id: 'traffic', label: 'Traffic radar', count: analysis.trafficDistribution.leakedQueries.length },
    { id: 'sem', label: 'Paid search', count: analysis.keywords.length },
    { id: 'organic', label: 'Organic & AI search' },
    { id: 'cro', label: 'Landing page' },
    { id: 'roadmap', label: '90-day roadmap', count: analysis.roadmap.length }
  ];

  return (
    <div className="min-h-screen bg-canvas text-fg flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div role="status" className="fixed bottom-6 left-6 z-50 bg-surface border border-line text-fg px-4 py-3 rounded shadow-overlay flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-accent-fg" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        analysis={analysis}
        onExport={handleExportPlaybook}
        onOpenChat={() => setIsChatOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigateToTab={(tab) => setActiveTab(tab as any)}
        isSubscribed={isSubscribed}
        onOpenSubscribeModal={() => openPlans('upgrade')}
      />

      {/* Main Content Area */}
      <main id="main" className={`flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 ${hasAnalyzed ? 'pt-12' : ''}`}>
        {!hasAnalyzed && <Hero />}

        {/* Domain Search & Scanner Bar */}
        <DomainSearchBar
          currentDomain={currentDomain}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          analysis={analysis}
          error={analyzeError}
          remaining={remaining}
          onOpenPlans={() => openPlans(remaining === 0 ? 'limit' : 'upgrade')}
          compact={!hasAnalyzed}
        />

        {/* Report navigation */}
        <nav aria-label="Report sections" className="flex border-b border-line mb-8 overflow-x-auto no-scrollbar gap-6">
          {tabs.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                aria-current={active ? 'page' : undefined}
                className={`relative h-10 -mb-px flex items-center gap-2 text-sm whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                  active ? 'border-accent text-fg font-medium' : 'border-transparent text-fg-muted hover:text-fg'
                }`}
              >
                <span>{t.label}</span>
                {t.count !== undefined && <span className="num text-xs text-fg-subtle">{t.count}</span>}
              </button>
            );
          })}
        </nav>

        {/* Tab Content Display */}
        <div className="pb-24">
          {activeTab === 'overview' && (
            <OverviewScorecard analysis={analysis} onNavigateTab={(tab) => setActiveTab(tab as any)} />
          )}

          {activeTab === 'revenue' && (
            <RevenueTrafficForecaster analysis={analysis} />
          )}

          {activeTab === 'traffic' && (
            <TrafficInterceptionPanel
              analysis={analysis}
              isSubscribed={isSubscribed}
              onOpenSubscribeModal={() => openPlans('upgrade')}
              onAutoFixCompleted={handleAutoFixCompleted}
            />
          )}

          {activeTab === 'sem' && (
            <SEMArchitect analysis={analysis} />
          )}

          {activeTab === 'organic' && (
            <T1OrganicDomination analysis={analysis} />
          )}

          {activeTab === 'cro' && (
            <CROStudio analysis={analysis} />
          )}

          {activeTab === 'roadmap' && (
            <ActionRoadmap analysis={analysis} />
          )}
        </div>
      </main>

      {/* Strategist chat trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          className="btn bg-surface text-fg border border-line hover:border-line-strong shadow-overlay"
        >
          <MessageSquare className="w-4 h-4 text-fg-muted" />
          <span>Ask the strategist</span>
        </button>
      </div>

      {/* AI Agency Chat Drawer */}
      <AgencyChatDrawer
        key={`${analysis.domain}-${analysis.source}`}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        analysis={analysis}
      />

      {/* Free / Pro plans */}
      <SubscriptionModal
        isOpen={isSubscribeModalOpen}
        onClose={closePlans}
        analysis={analysis}
        reason={planModalReason}
        usedToday={isSubscribeModalOpen ? usedToday() : 0}
      />

      <footer className="border-t border-line py-8 px-4 lg:px-8 text-xs text-fg-subtle">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span>ApexSEM. SEM and SEO strategy from your homepage.</span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <button type="button" onClick={() => openPlans('upgrade')} className="hover:text-fg transition-colors cursor-pointer">
              Free or Pro ${PRO_PRICE}/mo
            </button>
            <a href="mailto:hello@stallbay.com" className="hover:text-fg transition-colors">hello@stallbay.com</a>
            <span>Traffic, volume and CPC figures are modeled estimates, not Google Ads data.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
