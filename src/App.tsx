import React, { useState, useEffect, useCallback } from 'react';
import { Check, Download, MessageCircle } from 'lucide-react';
import { Header } from './components/Header';
import { LangSwitch } from './components/AuthControls';
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
import { SignInModal } from './components/SignInModal';
import { Hero } from './components/Hero';
import { generateDomainAnalysis, analyzeDomain, cleanDomain, AnalyzeError } from './services/analyzer';
import { canAnalyze, dailyLimit, isPro, recordAnalysis, remainingToday, usedToday, PRO_PRICE } from './services/usage';
import { DomainAnalysis } from './types';
import { useDict } from './i18n';
import { shell } from './i18n/dict/shell';
import { useAuth } from './auth/AuthProvider';
import { approxRange, isMeasured } from './lib/honest';

const PENDING_KEY = 'apex_pending_domain';

export function App() {
  const t = useDict(shell);
  const auth = useAuth();
  const uid = auth.user?.id ?? null;
  const [currentDomain, setCurrentDomain] = useState<string>('linear.app');
  const [analysis, setAnalysis] = useState<DomainAnalysis>(() => generateDomainAnalysis('linear.app', 'sample'));
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number>(() => remainingToday(null));
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

  // Analyses need an account. A guest's domain is parked in sessionStorage so
  // it survives the Google OAuth redirect and runs as soon as they're back.
  const [gateDomain, setGateDomain] = useState<string | null>(null);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const openGate = useCallback((domain: string | null) => {
    setGateDomain(domain);
    setIsGateOpen(true);
    try {
      if (domain) sessionStorage.setItem(PENDING_KEY, domain);
    } catch {
      /* storage blocked: the user just re-enters the domain after sign-in */
    }
  }, []);
  const closeGate = useCallback(() => {
    setIsGateOpen(false);
    try {
      sessionStorage.removeItem(PENDING_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // Theme: index.html resolves it before first paint (saved choice, else OS
  // preference); React adopts that value and owns it from here.
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0c0c0d' : '#fafafa');
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('apex_theme', next);
      } catch {
        /* private mode: theme still applies for this session */
      }
      return next;
    });
  };

  // Quota follows the identity: recount when the user signs in or out.
  useEffect(() => {
    if (!auth.loading) setRemaining(remainingToday(uid));
  }, [uid, auth.loading]);

  // Back from Google with a parked domain: run it now.
  useEffect(() => {
    if (auth.loading || !auth.user) return;
    let pending: string | null = null;
    try {
      pending = sessionStorage.getItem(PENDING_KEY);
      sessionStorage.removeItem(PENDING_KEY);
    } catch {
      /* ignore */
    }
    setIsGateOpen(false);
    if (pending) void handleAnalyze(pending);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.loading, auth.user?.id]);

  useEffect(() => {
    if (auth.redirectError) {
      showToast(t.toast.authFailed(auth.redirectError));
      auth.clearRedirectError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.redirectError]);

  const handleSignIn = async () => {
    if (!auth.available) {
      showToast(t.toast.authUnavailable);
      return;
    }
    const { error } = await auth.signInWithGoogle();
    if (error) showToast(t.toast.authFailed(error));
  };

  const handleSignOut = async () => {
    await auth.signOut();
    showToast(t.toast.signedOut);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAnalyze = async (domain: string) => {
    if (isLoading) return;
    if (!auth.user) {
      openGate(cleanDomain(domain));
      return;
    }
    if (!canAnalyze(uid)) {
      setRemaining(0);
      openPlans('limit');
      return;
    }
    const cleaned = cleanDomain(domain);
    setAnalyzeError(null);
    setIsLoading(true);
    setCurrentDomain(cleaned);

    try {
      const result = await analyzeDomain(cleaned, await auth.getAccessToken());
      setAnalysis(result);
      setActiveTab('overview');
      setHasAnalyzed(true);
      recordAnalysis(uid);
      setRemaining(remainingToday(uid));
      showToast(
        result.source === 'live' ? t.toast.liveWeb(result.domain) : isMeasured(result) ? t.toast.live(result.domain) : t.toast.estimate(result.domain)
      );
    } catch (err) {
      if (err instanceof AnalyzeError && err.status === 401) {
        // Session expired or was revoked: ask to sign in again instead of erroring.
        openGate(cleaned);
        return;
      }
      setAnalyzeError(err instanceof AnalyzeError ? err.message : t.search.failed);
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
    showToast(t.toast.planned);
  };

  const handleExportPlaybook = () => {
    const reportData = `# ApexSEM Playbook
Domain: ${analysis.domain}
URL: ${analysis.url}
Niche: ${analysis.niche}
Analyzed At: ${analysis.analyzedAt}
Authority score: ${analysis.score.overall}/100 (${analysis.score.tier})${isMeasured(analysis) ? '' : ' (estimate)'}

Source: ${analysis.source === 'sample' ? 'sample data' : analysis.source === 'live' ? `live web research (Perplexity)${isMeasured(analysis) ? ' + homepage crawl' : ''}` : isMeasured(analysis) ? 'live homepage crawl' : 'estimate from the domain name (crawl failed)'}

> Figures marked (estimate) are modeled from the domain and niche, not measured. Treat them as an order of magnitude.

## Traffic and value (estimate)
- Paid-search value of current traffic: ${approxRange(analysis.metrics.monthlyPaidValue, { money: true })}/mo (estimate)
- Current traffic: ${approxRange(analysis.metrics.currentTrafficEst)} visits/mo (estimate)
- Spend a negative keyword list could save: ${approxRange(analysis.metrics.wastedSpendPrevented, { money: true })}/mo (estimate)

## Competitor overlap (estimate)
- Market searches: ${approxRange(analysis.trafficDistribution.totalMarketSearches)}/mo (estimate)
- Visits going to competitors: ${approxRange(analysis.trafficDistribution.totalLostVisits)}/mo (estimate)

## High Intent Target Keywords (volume and CPC are estimates)
${analysis.keywords.map(k => `- ${k.keyword} | Match: [${k.matchType}] | Vol: ${approxRange(k.monthlyVolume)} | CPC: ~$${Math.round(k.cpc)} | Opp Score: ${k.opportunityScore}/100`).join('\n')}

## Google Ads Responsive Search Ads
${analysis.campaigns.map(c => `### ${c.campaignType}
Headlines:
${c.headlines.map(h => `  • ${h}`).join('\n')}
Descriptions:
${c.descriptions.map(d => `  • ${d}`).join('\n')}
`).join('\n')}

## Negative keywords
${analysis.negativeKeywords.join(', ')}

## T1 Topical Authority Clusters
${analysis.topicalClusters.map(cl => `### Pillar: ${cl.pillarTitle} (Keyword: ${cl.targetKeyword})
Subtopics:
${cl.clusterSubtopics.map(sub => `  - [${sub.format}] ${sub.title} (${sub.targetKeyword})`).join('\n')}`).join('\n\n')}

## 90-day roadmap
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

    showToast(t.toast.downloaded(`ApexSEM-Playbook-${analysis.domain}.md`));
  };

  const tabs: { id: typeof activeTab; label: string }[] = [
    { id: 'overview', label: t.tabs.overview },
    { id: 'revenue', label: t.tabs.revenue },
    { id: 'traffic', label: t.tabs.traffic },
    { id: 'sem', label: t.tabs.sem },
    { id: 'organic', label: t.tabs.organic },
    { id: 'cro', label: t.tabs.cro },
    { id: 'roadmap', label: t.tabs.roadmap }
  ];

  return (
    <div className="min-h-screen bg-canvas text-fg flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div role="status" className="fixed bottom-20 inset-x-4 sm:bottom-6 sm:left-6 sm:right-auto z-50 bg-surface border border-line text-fg px-4 py-3 rounded shadow-overlay flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 shrink-0 text-accent-fg" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onHome={() => setActiveTab('overview')}
        onExport={handleExportPlaybook}
        isSubscribed={isSubscribed}
        onOpenPlans={() => openPlans('upgrade')}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main id="main" className={`flex-1 max-w-7xl w-full min-w-0 mx-auto px-4 lg:px-8 ${hasAnalyzed ? 'pt-6 sm:pt-12' : ''}`}>
        {!hasAnalyzed && <Hero />}

        {/* Domain Search & Scanner Bar */}
        <DomainSearchBar
          currentDomain={currentDomain}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          analysis={analysis}
          error={analyzeError}
          remaining={remaining}
          limit={dailyLimit(uid)}
          isSignedIn={!!auth.user}
          onSignIn={handleSignIn}
          onOpenPlans={() => openPlans(remaining === 0 ? 'limit' : 'upgrade')}
          compact={!hasAnalyzed}
        />

        {/* Report navigation */}
        <div className="flex items-end gap-6 border-b border-line mb-8">
        <nav
          aria-label={t.tabs.aria}
          className="flex flex-1 min-w-0 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-px-4 sm:scroll-px-0 overflow-x-auto no-scrollbar snap-x snap-mandatory gap-6 overscroll-x-contain"
        >
          {tabs.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={(e) => {
                  setActiveTab(t.id);
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
                }}
                aria-current={active ? 'page' : undefined}
                className={`relative h-11 sm:h-10 -mb-px shrink-0 snap-start flex items-center gap-2 text-sm whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                  active ? 'border-accent text-fg font-medium' : 'border-transparent text-fg-muted hover:text-fg'
                }`}
              >
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={handleExportPlaybook}
          title={t.header.exportTitle}
          className="hidden sm:inline-flex items-center gap-2 h-10 shrink-0 text-sm text-fg-muted hover:text-fg transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          {t.header.export}
        </button>
        </div>

        {/* Tab Content Display */}
        <div className="pb-28 sm:pb-24">
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
      <div className="group fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 pb-[env(safe-area-inset-bottom)]">
        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          aria-label={t.header.askStrategist}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
        <span
          role="tooltip"
          className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 rounded-sm bg-fg text-canvas text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:hidden"
        >
          {t.header.askStrategist}
        </span>
      </div>

      {/* AI Agency Chat Drawer */}
      <AgencyChatDrawer
        key={`${analysis.domain}-${analysis.source}`}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        analysis={analysis}
      />

      {/* Required sign-in before a live analysis */}
      <SignInModal isOpen={isGateOpen} onClose={closeGate} onSignIn={handleSignIn} domain={gateDomain} />

      {/* Free / Pro plans */}
      <SubscriptionModal
        isOpen={isSubscribeModalOpen}
        onClose={closePlans}
        analysis={analysis}
        reason={planModalReason}
        usedToday={isSubscribeModalOpen ? usedToday(uid) : 0}
        limit={dailyLimit(uid)}
        isSignedIn={!!auth.user}
        onSignIn={handleSignIn}
      />

      <footer className="border-t border-line py-8 text-xs text-fg-subtle">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span>{t.footer.about}</span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <button type="button" onClick={() => openPlans('upgrade')} className="hover:text-fg transition-colors cursor-pointer">
              {t.footer.plans(PRO_PRICE)}
            </button>
            <a href="mailto:hello@stallbay.com" className="hover:text-fg transition-colors">hello@stallbay.com</a>
            <span>{t.footer.disclaimer}</span>
            <LangSwitch />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
