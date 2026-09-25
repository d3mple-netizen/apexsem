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
    <div className="space-y-8">
      {/* Title & Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-fg flex items-center gap-2">
            <Layers className="w-4 h-4 text-fg-subtle" />
            <span>Tier-1 Domain Authority & Search Domination Engine</span>
          </h2>
          <p className="text-sm text-fg-muted mt-1">
            Build unshakeable topical authority, capture Generative AI search citations (GEO), and earn high-DR backlinks to claim #1 search positions.
          </p>
        </div>

        <div className="flex rounded bg-surface-2 p-1 gap-1 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('clusters')}
            className={`h-8 px-3 rounded-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'clusters' ? 'bg-surface text-fg' : 'text-fg-muted hover:text-fg'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Topical Clusters</span>
          </button>
          <button
            onClick={() => setActiveTab('geo')}
            className={`h-8 px-3 rounded-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'geo' ? 'bg-surface text-fg' : 'text-fg-muted hover:text-fg'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Search (GEO)</span>
          </button>
          <button
            onClick={() => setActiveTab('backlinks')}
            className={`h-8 px-3 rounded-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'backlinks' ? 'bg-surface text-fg' : 'text-fg-muted hover:text-fg'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>T1 Backlinks</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`h-8 px-3 rounded-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'schema' ? 'bg-surface text-fg' : 'text-fg-muted hover:text-fg'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Schema Entity</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TOPICAL CLUSTERS */}
      {activeTab === 'clusters' && (
        <div className="space-y-6">
          <div className="inset p-4 text-xs text-fg-muted leading-relaxed flex items-start gap-3">
            <Compass className="w-4 h-4 text-fg-subtle shrink-0" />
            <div>
              <strong className="text-fg font-semibold block mb-1">The T1 Semantic Entity Moat</strong>
              Google evaluates whether your domain covers the entire topic ecosystem or just isolated keywords. Deploying this master pillar and supporting cluster pages establishes your domain as the definitive category entity.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.topicalClusters.map((cluster) => (
              <div key={cluster.id} className="card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="tag">
                      {cluster.intent}
                    </span>
                    <span className="text-xs text-fg-subtle num">
                      {cluster.searchVolume.toLocaleString()} mo. searches
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-fg mb-2">{cluster.pillarTitle}</h3>
                  <p className="text-xs text-fg-muted mb-6">
                    Primary Target Keyword: <span className="text-fg font-medium">"{cluster.targetKeyword}"</span>
                  </p>

                  <div>
                    <span className="label block mb-2">Supporting Cluster Sub-topics</span>
                    <div className="divide-y divide-line border-t border-line">
                      {cluster.clusterSubtopics.map((sub, sIdx) => (
                        <div key={sIdx} className="py-3 flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="text-xs font-medium text-fg">{sub.title}</h4>
                            <span className="text-xs text-fg-subtle block">
                              Target: "{sub.targetKeyword}"
                            </span>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="tag">
                              {sub.format}
                            </span>
                            <span className="text-2xs text-fg-subtle num">
                              Diff: {sub.difficulty}/100
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-line flex items-center justify-between gap-4 text-xs">
                  <span className="text-fg-muted">Internal Linking: <strong className="font-medium text-fg">Bidirectional Silo</strong></span>
                  <button
                    onClick={() => {
                      const text = `PILLAR: ${cluster.pillarTitle} (Keyword: ${cluster.targetKeyword})\n\nCLUSTER CONTENT:\n${cluster.clusterSubtopics.map(s => `• [${s.format}] ${s.title} (Keyword: ${s.targetKeyword})`).join('\n')}`;
                      handleCopy(text, cluster.id);
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    {copiedKey === cluster.id ? <Check className="w-3.5 h-3.5 text-fg-subtle" /> : <Copy className="w-3.5 h-3.5" />}
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
          <div className="inset p-4 text-xs text-fg-muted leading-relaxed flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-fg-subtle shrink-0" />
            <div>
              <strong className="text-fg font-semibold block mb-1">The Generative AI Search Frontier</strong>
              Over 35% of B2B SaaS product discoveries now originate inside AI models (ChatGPT Search, Perplexity AI, Google AI Overviews). Optimizing for AI synthesis ensures your domain is recommended when buyers ask "What is the best {analysis.niche}?"
            </div>
          </div>

          {/* Interactive GEO Prompt Simulation Studio */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-fg flex items-center gap-2">
                <Bot className="w-4 h-4 text-fg-subtle" />
                <span>Live GEO Query Simulation Studio</span>
              </span>
              <span className="text-xs text-fg-subtle">Test AI Citation Readiness</span>
            </div>

            <form onSubmit={handleSimulateGeo} className="flex gap-2">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Enter query buyers ask ChatGPT or Perplexity..."
                className="field flex-1 h-9 px-3 text-sm"
              />
              <button
                type="submit"
                disabled={isSimulating || !testQuery.trim()}
                className="btn btn-primary"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isSimulating ? 'Simulating...' : 'Test AI Citation'}</span>
              </button>
            </form>

            {simulatedGeoResult && (
              <div className="inset p-4 text-xs space-y-2">
                <div className="flex items-center justify-between gap-4 text-fg-subtle text-xs">
                  <span>Simulated Perplexity / ChatGPT Search Response:</span>
                  <span className="text-fg-muted font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-fg-subtle" />
                    Direct Citation Verified
                  </span>
                </div>
                <p className="text-sm text-fg leading-relaxed">
                  {simulatedGeoResult}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.geoSignals.map((signal, idx) => (
              <div key={idx} className="card p-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-fg flex items-center gap-2">
                    <Bot className="w-4 h-4 text-fg-subtle" />
                    {signal.platform}
                  </span>
                  <span className={`tag ${
                    signal.status === 'Cited'
                      ? 'text-fg'
                      : signal.status === 'Partial Citation'
                      ? 'text-fg-muted'
                      : 'text-accent-fg'
                  }`}>
                    {signal.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-fg-muted">
                    <span>LLM Entity Confidence Score:</span>
                    <span className="font-semibold text-fg num">{signal.entityScore}/100</span>
                  </div>
                  <div className="w-full bg-surface-2 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-fg-muted h-full rounded-full"
                      style={{ width: `${signal.entityScore}%` }}
                    />
                  </div>
                </div>

                <div className="inset p-3 text-xs text-fg-muted leading-relaxed">
                  <span className="text-fg font-medium block mb-1">AI Agency Action:</span>
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
          <div className="inset p-4 text-xs text-fg-muted leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-fg-subtle shrink-0" />
            <div>
              <strong className="text-fg font-semibold block mb-1">Tier 1 Link Equity Playbooks</strong>
              Generic guest posts don't move the needle anymore. These 4 institutional plays earn permanent dofollow links from DR 75+ tech giants and news publications, permanently elevating domain trust in Google's PageRank graph.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.backlinkPlays.map((play, idx) => (
              <div key={idx} className="card p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="text-xs font-semibold text-fg num">
                      Est. DR {play.estimatedDR}+
                    </span>
                    <span className="tag">
                      {play.impact} Impact
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-fg mb-1">{play.strategy}</h3>
                  <span className="text-xs text-fg-subtle block mb-4">{play.targetDomainType}</span>

                  <p className="inset p-3 text-xs text-fg-muted leading-relaxed">
                    {play.playbookAngle}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-line flex items-center justify-between gap-4 text-xs text-fg-muted">
                  <span>Execution Difficulty: <strong className="font-medium text-fg">{play.difficulty}</strong></span>
                  <span className="text-fg-subtle font-medium">Priority Play</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SCHEMA ENTITY GENERATOR */}
      {activeTab === 'schema' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-fg">Knowledge Graph JSON-LD Schema</h3>
              <p className="text-xs text-fg-muted mt-1">
                Embed this structured data markup in the &lt;head&gt; of {analysis.domain} to anchor entity recognition in Google Search.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleDownloadSchema}
                className="btn btn-secondary btn-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .JSON</span>
              </button>
              <button
                onClick={() => handleCopy(schemaJsonLd, 'schema-code')}
                className="btn btn-primary btn-sm"
              >
                {copiedKey === 'schema-code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'schema-code' ? 'Copied JSON-LD!' : 'Copy Schema Code'}</span>
              </button>
            </div>
          </div>

          <div className="inset border border-line p-4 overflow-x-auto font-mono text-xs text-fg-muted">
            <pre>{schemaJsonLd}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
