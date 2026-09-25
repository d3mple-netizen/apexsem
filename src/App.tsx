import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Target, 
  Layers, 
  Eye, 
  CheckSquare, 
  Sparkles, 
  Download, 
  Zap, 
  CheckCircle2,
  Users,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
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
import { generateDomainAnalysis, cleanDomain } from './services/analyzer';
import { DomainAnalysis } from './types';

export function App() {
  const [currentDomain, setCurrentDomain] = useState<string>('linear.app');
  const [analysis, setAnalysis] = useState<DomainAnalysis>(() => generateDomainAnalysis('linear.app'));
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'traffic' | 'sem' | 'organic' | 'cro' | 'roadmap'>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // $10/mo Subscription & Autonomous Fix State
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    return localStorage.getItem('apex_subscribed') === 'true';
  });
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState<boolean>(false);

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

  const handleAnalyze = (domain: string) => {
    setIsLoading(true);
    const cleaned = cleanDomain(domain);
    setCurrentDomain(cleaned);

    setTimeout(() => {
      const result = generateDomainAnalysis(cleaned);
      setAnalysis(result);
      setIsLoading(false);
      showToast(`Analyzed ${cleaned} — Generated custom SEM & T1 Domination Playbook`);
    }, 1200);
  };

  const handleSubscriptionSuccess = () => {
    setIsSubscribed(true);
    localStorage.setItem('apex_subscribed', 'true');
    setIsSubscribeModalOpen(false);
    showToast('Apex Autopilot Pro Active ($10/mo)! Autonomous AI Fixer Engaged.');
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
    const reportData = `# ApexSEM AI Intelligence Dossier & T1 Playbook
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-white dark:bg-slate-900 border border-brand-500/40 text-slate-900 dark:text-white px-4 py-3 rounded-xl shadow-glow flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
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
        onOpenSubscribeModal={() => setIsSubscribeModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* Domain Search & Scanner Bar */}
        <DomainSearchBar
          currentDomain={currentDomain}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />

        {/* Primary SaaS Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800/80 mb-6 overflow-x-auto no-scrollbar gap-2 transition-colors duration-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-3 text-xs md:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-brand-500 text-brand-600 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-brand-500" />
            <span>Executive Dossier & T1 Index</span>
          </button>

          {/* NEW TAB: Revenue & Traffic Potential */}
          <button
            onClick={() => setActiveTab('revenue')}
            className={`pb-3 px-3 text-xs md:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'revenue'
                ? 'border-brand-500 text-brand-600 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span>Revenue & Traffic Potential</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              Unit Economics
            </span>
          </button>

          {/* Traffic Radar & Auto-Fix */}
          <button
            onClick={() => setActiveTab('traffic')}
            className={`pb-3 px-3 text-xs md:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'traffic'
                ? 'border-brand-500 text-brand-600 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-rose-500" />
            <span>Traffic Radar & Auto-Fix</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 flex items-center gap-1">
              <AlertTriangle className="w-2.5 h-2.5" />
              <span>5 Leaks</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sem')}
            className={`pb-3 px-3 text-xs md:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'sem'
                ? 'border-brand-500 text-brand-600 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Target className="w-4 h-4 text-emerald-500" />
            <span>SEM & Paid Ads Architect</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              {analysis.keywords.length} KWs
            </span>
          </button>

          <button
            onClick={() => setActiveTab('organic')}
            className={`pb-3 px-3 text-xs md:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'organic'
                ? 'border-brand-500 text-brand-600 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 text-accent-500" />
            <span>T1 Organic & AI Search (GEO)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-accent-50 dark:bg-accent-500/10 text-accent-600 dark:text-accent-400 border border-accent-200 dark:border-accent-500/20">
              Perplexity & Google
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cro')}
            className={`pb-3 px-3 text-xs md:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'cro'
                ? 'border-brand-500 text-brand-600 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4 text-amber-500" />
            <span>Landing Page CRO Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`pb-3 px-3 text-xs md:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'roadmap'
                ? 'border-brand-500 text-brand-600 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-indigo-500" />
            <span>30-60-90 Day Roadmap</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
              {analysis.roadmap.length} Steps
            </span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="pb-16">
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
              onOpenSubscribeModal={() => setIsSubscribeModalOpen(true)}
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

      {/* Floating AI Agency Partner Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsChatOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-semibold text-xs rounded-2xl shadow-glow transition-all active:scale-95 cursor-pointer"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <span>Ask Local AI Strategist</span>
        </button>
      </div>

      {/* AI Agency Chat Drawer */}
      <AgencyChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        analysis={analysis}
      />

      {/* $10/mo Autonomous AI Fixer Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        onSuccess={handleSubscriptionSuccess}
        analysis={analysis}
      />

      {/* Modern B2B SaaS Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-brand-500" />
            <span>ApexSEM AI — Autonomous B2B SEM Agency SaaS</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Google Ads API Ready</span>
            <span>•</span>
            <span>$10/mo Autopilot Pro</span>
            <span>•</span>
            <span>Local Ollama Powered</span>
            <span>•</span>
            <span>T1 Knowledge Graph Certified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
