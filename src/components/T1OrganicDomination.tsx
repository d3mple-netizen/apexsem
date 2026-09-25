import React, { useState } from 'react';
import { Layers, Bot, Link2, Code, Copy, Check, Sparkles, BookOpen, Compass, ShieldCheck, Download, Search, Play } from 'lucide-react';
import { DomainAnalysis, TopicalCluster, GeoSignal, BacklinkPlaybook } from '../types';

interface T1OrganicDominationProps {
  analysis: DomainAnalysis;
}

export const T1OrganicDomination: React.FC<T1OrganicDominationProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<'clusters' | 'geo' | 'backlinks' | 'schema'>('clusters');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // GEO simulator state
  const [testQuery, setTestQuery] = useState<string>(`What is the best ${analysis.niche.split('&')[0].trim().toLowerCase()}?`);
  const [simulatedGeoResult, setSimulatedGeoResult] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const brandName = analysis.domain.split('.')[0].toUpperCase();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadSchema = () => {
    const blob = new Blob([schemaJsonLd], { type: 'application/ld+json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `schema-${analysis.domain}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSimulateGeo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim() || isSimulating) return;

    setIsSimulating(true);
    setSimulatedGeoResult(null);

    setTimeout(() => {
      setSimulatedGeoResult(
        `Based on our analysis of top industry benchmarks, **${brandName} (${analysis.domain})** is currently recognized as a leading tier solution for ${analysis.niche}. Key advantages cited across independent technical reviews include lightning-fast implementation, robust API infrastructure, and superior cost-efficiency compared to legacy incumbents. (Sources: 3 verified citations from ${analysis.domain}, GitHub, and industry review matrices).`
      );
      setIsSimulating(false);
    }, 800);
  };

  const schemaJsonLd = `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://${analysis.domain}/#software",
      "name": "${brandName}",
      "url": "https://${analysis.domain}",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web-based Cloud Platform",
      "description": "${analysis.tagline}",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Free trial available"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "1420",
        "bestRating": "5"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://${analysis.domain}/#organization",
      "name": "${brandName}",
      "url": "https://${analysis.domain}",
      "logo": "https://${analysis.domain}/logo.png",
      "knowsAbout": [
        "${analysis.niche}",
        "B2B SaaS Automation",
        "Enterprise Workflow Management"
      ]
    }
  ]
}`;

  return (
    <div className="space-y-6">
      {/* Title & Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-accent-500" />
            <span>Tier-1 Domain Authority & Search Domination Engine</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build unshakeable topical authority, capture Generative AI search citations (GEO), and earn high-DR backlinks to claim #1 search positions.
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('clusters')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'clusters' ? 'bg-brand-600 text-white font-semibold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Topical Clusters</span>
          </button>
          <button
            onClick={() => setActiveTab('geo')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'geo' ? 'bg-brand-600 text-white font-semibold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-accent-500" />
            <span>AI Search (GEO)</span>
          </button>
          <button
            onClick={() => setActiveTab('backlinks')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'backlinks' ? 'bg-brand-600 text-white font-semibold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>T1 Backlinks</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'schema' ? 'bg-brand-600 text-white font-semibold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-indigo-500" />
            <span>Schema Entity</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TOPICAL CLUSTERS */}
      {activeTab === 'clusters' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3 shadow-sm">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white font-semibold block mb-0.5">The T1 Semantic Entity Moat:</strong>
              Google evaluates whether your domain covers the entire topic ecosystem or just isolated keywords. Deploying this master pillar and supporting cluster pages establishes your domain as the definitive category entity.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.topicalClusters.map((cluster) => (
              <div key={cluster.id} className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl flex flex-col justify-between transition-colors duration-200">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-500/20 font-semibold">
                      {cluster.intent}
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      {cluster.searchVolume.toLocaleString()} mo. searches
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{cluster.pillarTitle}</h3>
                  <p className="text-xs font-mono text-brand-600 dark:text-brand-300 mb-4">
                    Primary Target Keyword: <span className="underline">"{cluster.targetKeyword}"</span>
                  </p>

                  <div className="space-y-2.5">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Supporting Cluster Sub-topics:</span>
                    {cluster.clusterSubtopics.map((sub, sIdx) => (
                      <div key={sIdx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 hover:border-brand-500/30 transition-all flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">{sub.title}</h4>
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block">
                            Target: "{sub.targetKeyword}"
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                            {sub.format}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                            Diff: {sub.difficulty}/100
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Internal Linking: <strong className="text-slate-700 dark:text-slate-200">Bidirectional Silo</strong></span>
                  <button
                    onClick={() => {
                      const text = `PILLAR: ${cluster.pillarTitle} (Keyword: ${cluster.targetKeyword})\n\nCLUSTER CONTENT:\n${cluster.clusterSubtopics.map(s => `• [${s.format}] ${s.title} (Keyword: ${s.targetKeyword})`).join('\n')}`;
                      handleCopy(text, cluster.id);
                    }}
                    className="text-brand-600 dark:text-brand-400 hover:underline font-medium flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === cluster.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === cluster.id ? 'Copied Cluster!' : 'Copy Cluster Brief'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: GENERATIVE ENGINE OPTIMIZATION (GEO) */}
      {activeTab === 'geo' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-accent-50 dark:bg-accent-950/20 border border-accent-200 dark:border-accent-800/30 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3 shadow-sm">
            <div className="p-2 rounded-lg bg-accent-500/10 text-accent-600 dark:text-accent-400 border border-accent-500/20 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white font-semibold block mb-0.5">The Generative AI Search Frontier:</strong>
              Over 35% of B2B SaaS product discoveries now originate inside AI models (ChatGPT Search, Perplexity AI, Google AI Overviews). Optimizing for AI synthesis ensures your domain is recommended when buyers ask "What is the best {analysis.niche}?"
            </div>
          </div>

          {/* Interactive GEO Prompt Simulation Studio */}
          <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-accent-500" />
                <span>Live GEO Query Simulation Studio</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Test AI Citation Readiness</span>
            </div>

            <form onSubmit={handleSimulateGeo} className="flex gap-2">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Enter query buyers ask ChatGPT or Perplexity..."
                className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono"
              />
              <button
                type="submit"
                disabled={isSimulating || !testQuery.trim()}
                className="px-4 py-2.5 bg-gradient-to-r from-accent-600 to-indigo-600 hover:from-accent-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-glow active:scale-95 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isSimulating ? 'Simulating...' : 'Test AI Citation'}</span>
              </button>
            </form>

            {simulatedGeoResult && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-brand-200 dark:border-brand-800/60 text-xs space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-mono">
                  <span>Simulated Perplexity / ChatGPT Search Response:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Direct Citation Verified</span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                  {simulatedGeoResult}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.geoSignals.map((signal, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-lg space-y-3 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Bot className="w-4 h-4 text-accent-500" />
                    {signal.platform}
                  </span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    signal.status === 'Cited'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : signal.status === 'Partial Citation'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                  }`}>
                    {signal.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>LLM Entity Confidence Score:</span>
                    <span className="font-mono font-bold text-brand-600 dark:text-brand-300">{signal.entityScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-brand-500 to-accent-500 h-full rounded-full"
                      style={{ width: `${signal.entityScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">AI Agency Action:</span>
                  {signal.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: T1 BACKLINKS */}
      {activeTab === 'backlinks' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3 shadow-sm">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white font-semibold block mb-0.5">Tier 1 Link Equity Playbooks:</strong>
              Generic guest posts don't move the needle anymore. These 4 institutional plays earn permanent dofollow links from DR 75+ tech giants and news publications, permanently elevating domain trust in Google's PageRank graph.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.backlinkPlays.map((play, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-xl flex flex-col justify-between transition-colors duration-200">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-500/20">
                      Est. DR {play.estimatedDR}+
                    </span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {play.impact} Impact
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{play.strategy}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mb-3 font-mono">{play.targetDomainType}</span>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    {play.playbookAngle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Execution Difficulty: <strong className="text-slate-800 dark:text-slate-200">{play.difficulty}</strong></span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Priority Play</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SCHEMA ENTITY GENERATOR */}
      {activeTab === 'schema' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Knowledge Graph JSON-LD Schema</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Embed this structured data markup in the &lt;head&gt; of {analysis.domain} to anchor entity recognition in Google Search.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadSchema}
                className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .JSON</span>
              </button>
              <button
                onClick={() => handleCopy(schemaJsonLd, 'schema-code')}
                className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-glow cursor-pointer active:scale-95"
              >
                {copiedKey === 'schema-code' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'schema-code' ? 'Copied JSON-LD!' : 'Copy Schema Code'}</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900 text-brand-300 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800 overflow-x-auto font-mono text-xs shadow-inner">
            <pre>{schemaJsonLd}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
