import React, { useState } from 'react';
import { Layers, Bot, Link2, Code, Copy, Check, Sparkles, BookOpen, Compass, ShieldCheck, Download, X } from 'lucide-react';
import { DomainAnalysis } from '../types';
import { useDict, useI18n } from '../i18n';
import { organic } from '../i18n/dict/organic';
import { common } from '../i18n/common';
import { useLabels } from '../i18n/labels';
import { isMeasured, approxRange, EstimateBadge } from '../lib/honest';

interface T1OrganicDominationProps {
  analysis: DomainAnalysis;
}

/** Hand-set 0-100 difficulty shown as a coarse level: the figure is not measured. */
function difficultyLevel(d: number): 'Low' | 'Medium' | 'High' {
  return d < 35 ? 'Low' : d < 45 ? 'Medium' : 'High';
}

export const T1OrganicDomination: React.FC<T1OrganicDominationProps> = ({ analysis }) => {
  const t = useDict(organic);
  const c = useDict(common);
  const L = useLabels();
  const { fmt } = useI18n();
  const [activeTab, setActiveTab] = useState<'clusters' | 'geo' | 'backlinks' | 'schema'>('clusters');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const brandName = analysis.domain.split('.')[0].toUpperCase();
  const measured = isMeasured(analysis);
  const site = measured ? analysis.site : undefined;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // No ratings, prices or review counts are invented here: the user fills
  // every YOUR_... placeholder with real values.
  const schemaJsonLd = `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://${analysis.domain}/#software",
      "name": "${brandName}",
      "url": "https://${analysis.domain}",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": "${analysis.tagline.replace(/"/g, '\\"')}",
      "offers": {
        "@type": "Offer",
        "price": "YOUR_PRICE",
        "priceCurrency": "USD"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://${analysis.domain}/#organization",
      "name": "${brandName}",
      "url": "https://${analysis.domain}",
      "logo": "https://${analysis.domain}/YOUR_LOGO.png",
      "sameAs": ["YOUR_LINKEDIN_URL", "YOUR_G2_OR_CRUNCHBASE_URL"],
      "knowsAbout": ["${analysis.niche.replace(/"/g, '\\"')}"]
    }
  ]
}`;

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

  // AI citation readiness: plain checks on the crawled homepage.
  const readiness = site
    ? (() => {
        const questionH2 = site.h2.filter((h) => h.trim().endsWith('?')).length;
        const types = site.jsonLdTypes.join(', ');
        const hasOrg = site.jsonLdTypes.some((x) => /Organization|Corporation|LocalBusiness|Brand/i.test(x));
        return [
          { label: t.checks.questionH2, detail: t.checks.questionH2Detail(questionH2, site.h2.length), ok: questionH2 > 0 },
          { label: t.checks.schema, detail: t.checks.schemaDetail(types), ok: site.jsonLdTypes.length > 0 },
          { label: t.checks.org, detail: t.checks.orgDetail(hasOrg), ok: hasOrg },
          { label: t.checks.depth, detail: t.checks.depthDetail(fmt(site.wordCount)), ok: site.wordCount >= 300 },
          { label: t.checks.meta, detail: t.checks.metaDetail(!!site.description), ok: !!site.description }
        ];
      })()
    : null;

  const tabs = [
    { id: 'clusters' as const, icon: BookOpen, label: t.tabs.clusters },
    { id: 'geo' as const, icon: Bot, label: t.tabs.geo },
    { id: 'backlinks' as const, icon: Link2, label: t.tabs.backlinks },
    { id: 'schema' as const, icon: Code, label: t.tabs.schema }
  ];

  return (
    <div className="space-y-8">
      {/* Title & Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-fg flex items-center gap-2">
            <Layers className="w-4 h-4 text-fg-subtle shrink-0" />
            <span>{t.title}</span>
          </h2>
          <p className="text-sm text-fg-muted mt-1">{t.subtitle}</p>
        </div>

        <div
          role="tablist"
          aria-label={t.tabsAria}
          className="flex rounded bg-surface-2 p-1 gap-1 text-xs shrink-0 max-w-full overflow-x-auto no-scrollbar"
        >
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`h-10 sm:h-8 px-3 shrink-0 whitespace-nowrap rounded-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === id ? 'bg-surface text-fg' : 'text-fg-muted hover:text-fg'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: TOPICAL CLUSTERS */}
      {activeTab === 'clusters' && (
        <div className="space-y-6">
          <div className="inset p-4 text-xs text-fg-muted leading-relaxed flex items-start gap-3">
            <Compass className="w-4 h-4 text-fg-subtle shrink-0" />
            <div>
              <strong className="text-fg font-semibold block mb-1">{t.clustersIntroTitle}</strong>
              {t.clustersIntro}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.topicalClusters.map((cluster) => (
              <div key={cluster.id} className="card p-6 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="tag">{t.pillarIntent[cluster.intent] ?? cluster.intent}</span>
                    <span className="text-xs text-fg-subtle num flex items-center gap-1.5 whitespace-nowrap">
                      {approxRange(cluster.searchVolume)} {c.searchesMo}
                      <EstimateBadge />
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-fg mb-2">{cluster.pillarTitle}</h3>
                  <p className="text-xs text-fg-muted mb-6">
                    {t.targetKeyword}: <span className="text-fg font-medium">"{cluster.targetKeyword}"</span>
                  </p>

                  <div>
                    <span className="label block mb-2">{t.subtopics}</span>
                    <div className="divide-y divide-line border-t border-line">
                      {cluster.clusterSubtopics.map((sub, sIdx) => (
                        <div key={sIdx} className="py-3 flex items-start justify-between gap-4">
                          <div className="space-y-1 min-w-0">
                            <h4 className="text-xs font-medium text-fg">{sub.title}</h4>
                            <span className="text-xs text-fg-subtle block">
                              {t.target}: "{sub.targetKeyword}"
                            </span>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="tag">{L.format(sub.format)}</span>
                            <span className="text-2xs text-fg-subtle">
                              {t.difficulty}: {L.level(difficultyLevel(sub.difficulty)).toLowerCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs">
                  <span className="text-fg-muted min-w-0">
                    {t.linking}: <strong className="font-medium text-fg">{t.linkingValue}</strong>
                  </span>
                  <button
                    onClick={() => {
                      const text = `${t.briefPillar}: ${cluster.pillarTitle} (${t.briefKeyword}: ${cluster.targetKeyword})\n\n${t.briefCluster}:\n${cluster.clusterSubtopics
                        .map((s) => `- [${L.format(s.format)}] ${s.title} (${t.briefKeyword}: ${s.targetKeyword})`)
                        .join('\n')}`;
                      handleCopy(text, cluster.id);
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    {copiedKey === cluster.id ? <Check className="w-3.5 h-3.5 text-fg-subtle" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === cluster.id ? c.copied : t.copyBrief}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AI SEARCH (GEO) */}
      {activeTab === 'geo' && (
        <div className="space-y-6">
          <div className="inset p-4 text-xs text-fg-muted leading-relaxed flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-fg-subtle shrink-0" />
            <div>
              <strong className="text-fg font-semibold block mb-1">{t.geoIntroTitle}</strong>
              {t.geoIntro(analysis.niche)}
            </div>
          </div>

          {/* Readiness checks computed from the crawl */}
          <div className="card p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <span className="text-sm font-semibold text-fg flex items-center gap-2">
                <Bot className="w-4 h-4 text-fg-subtle shrink-0" />
                <span>{t.readinessTitle}</span>
              </span>
              <span className="text-xs text-fg-subtle">{t.readinessNote}</span>
            </div>

            {readiness ? (
              <div className="divide-y divide-line border-t border-line">
                {readiness.map((c) => (
                  <div key={c.label} className="py-3 flex items-start justify-between gap-4 text-xs">
                    <div className="min-w-0 space-y-0.5">
                      <span className="text-fg font-medium block">{c.label}</span>
                      <span className="text-fg-subtle block break-words">{c.detail}</span>
                    </div>
                    <span className={`tag shrink-0 flex items-center gap-1 ${c.ok ? 'text-fg-muted' : 'text-accent-fg'}`}>
                      {c.ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {c.ok ? t.pass : t.fail}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="inset p-4 text-xs text-fg-muted">{t.readinessUnavailable}</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="label">{t.signalsTitle}</span>
              <EstimateBadge />
              <span className="text-xs text-fg-subtle">{t.signalsNote}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.geoSignals.map((signal, idx) => (
                <div key={idx} className="card p-5 space-y-4 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-fg flex items-center gap-2 min-w-0">
                      <Bot className="w-4 h-4 text-fg-subtle shrink-0" />
                      <span className="truncate">{signal.platform}</span>
                    </span>
                    <span
                      className={`tag shrink-0 ${
                        signal.status === 'Cited'
                          ? 'text-fg'
                          : signal.status === 'Partial Citation'
                          ? 'text-fg-muted'
                          : 'text-accent-fg'
                      }`}
                    >
                      {L.geoStatus(signal.status)}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between gap-4 text-fg-muted">
                      <span>{t.likelihood}</span>
                      <span className="font-semibold text-fg num">~{Math.round(signal.entityScore / 5) * 5}/100</span>
                    </div>
                    <div className="w-full bg-surface-2 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-fg-muted h-full rounded-full" style={{ width: `${signal.entityScore}%` }} />
                    </div>
                  </div>

                  <div className="inset p-3 text-xs text-fg-muted leading-relaxed">
                    <span className="text-fg font-medium block mb-1">{t.action}</span>
                    {signal.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BACKLINKS */}
      {activeTab === 'backlinks' && (
        <div className="space-y-6">
          <div className="inset p-4 text-xs text-fg-muted leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-fg-subtle shrink-0" />
            <div>
              <strong className="text-fg font-semibold flex flex-wrap items-center gap-2 mb-1">
                <span>{t.backlinksIntroTitle}</span>
                <EstimateBadge />
              </strong>
              {t.backlinksIntro}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.backlinkPlays.map((play, idx) => (
              <div key={idx} className="card p-5 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="text-xs font-semibold text-fg num">
                      {t.typicalDr} {Math.floor(play.estimatedDR / 10) * 10}+
                    </span>
                    <span className="tag">
                      {t.impact}: {L.level(play.impact).toLowerCase()}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-fg mb-1">{play.strategy}</h3>
                  <span className="text-xs text-fg-subtle block mb-4">{play.targetDomainType}</span>

                  <p className="inset p-3 text-xs text-fg-muted leading-relaxed">{play.playbookAngle}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-line text-xs text-fg-muted">
                  {t.effort}: <strong className="font-medium text-fg">{L.level(play.difficulty)}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SCHEMA */}
      {activeTab === 'schema' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-fg">{t.schemaTitle}</h3>
              <p className="text-xs text-fg-muted mt-1 break-words">{t.schemaIntro(analysis.domain)}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={handleDownloadSchema} className="btn btn-secondary btn-sm">
                <Download className="w-3.5 h-3.5" />
                <span>{t.download}</span>
              </button>
              <button onClick={() => handleCopy(schemaJsonLd, 'schema-code')} className="btn btn-primary btn-sm">
                {copiedKey === 'schema-code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'schema-code' ? c.copied : t.copySchema}</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-fg-muted space-y-1">
            <p>{t.schemaFill}</p>
            {site && site.jsonLdTypes.length > 0 && <p className="text-fg-subtle">{t.schemaFound(site.jsonLdTypes.join(', '))}</p>}
          </div>

          <div className="inset border border-line p-4 overflow-x-auto font-mono text-xs text-fg-muted">
            <pre>{schemaJsonLd}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
