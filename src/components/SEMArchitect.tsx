import React, { useState } from 'react';
import { Target, Shield, Copy, Check, Calculator, Sparkles, ExternalLink, Download, Plus } from 'lucide-react';
import { DomainAnalysis, AdCopyVariant } from '../types';
import { useDict, useI18n } from '../i18n';
import { common } from '../i18n/common';
import { useLabels } from '../i18n/labels';
import { semDict } from '../i18n/dict/sem';
import { approx, approxRange, EstimateBadge } from '../lib/honest';

// Click-to-lead conversion band used by the budget calculator. A stated
// assumption, not a measurement: typical B2B search lands somewhere in here.
const LEAD_RATE_LO = 0.02;
const LEAD_RATE_HI = 0.05;

function difficultyLevel(d: number): 'Low' | 'Medium' | 'High' {
  return d <= 33 ? 'Low' : d <= 66 ? 'Medium' : 'High';
}

interface SEMArchitectProps {
  analysis: DomainAnalysis;
}

export const SEMArchitect: React.FC<SEMArchitectProps> = ({ analysis }) => {
  const t = useDict(semDict);
  const c = useDict(common);
  const L = useLabels();
  const { fmt } = useI18n();
  const [selectedCampaignIdx, setSelectedCampaignIdx] = useState<number>(0);
  const [intentFilter, setIntentFilter] = useState<string>('all');
  const [keywordSearch, setKeywordSearch] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Negative keywords state
  const [negativeKeywords, setNegativeKeywords] = useState<string[]>(analysis.negativeKeywords);
  const [newNegativeInput, setNewNegativeInput] = useState<string>('');

  // Budget Calculator State
  const [monthlyBudget, setMonthlyBudget] = useState<number>(5000);

  const activeCampaign: AdCopyVariant = analysis.campaigns[selectedCampaignIdx] || analysis.campaigns[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddNegative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNegativeInput.trim()) return;
    const term = newNegativeInput.trim().toLowerCase();
    if (!negativeKeywords.includes(term)) {
      setNegativeKeywords([term, ...negativeKeywords]);
    }
    setNewNegativeInput('');
  };

  // Filter keywords
  const filteredKeywords = analysis.keywords.filter((kw) => {
    const matchesIntent = intentFilter === 'all' || kw.intent.toLowerCase().includes(intentFilter.toLowerCase());
    const matchesSearch = kw.keyword.toLowerCase().includes(keywordSearch.toLowerCase());
    return matchesIntent && matchesSearch;
  });

  // Export Keywords to CSV
  const handleExportKeywordsCSV = () => {
    // Data file: headers stay in English. Volume/CPC/difficulty are modeled estimates.
    const headers = ['Keyword', 'Intent', 'Match Type', 'Est. Monthly Volume', 'Est. CPC ($)', 'Est. Difficulty', 'Action'];
    const rows = filteredKeywords.map(k => [
      `"${k.keyword}"`,
      `"${k.intent}"`,
      `"${k.matchType}"`,
      k.monthlyVolume,
      k.cpc,
      k.difficulty,
      `"${k.recommendedAction.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SEM-Keywords-${analysis.domain}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Budget calculations. CPC is modeled and the lead rate is an assumed band,
  // so every output is shown as a range.
  const avgCpc = analysis.metrics.averageCpcInNiche || 10;
  const projectedClicks = Math.round(monthlyBudget / avgCpc);
  const leadsLo = Math.max(1, Math.round(projectedClicks * LEAD_RATE_LO));
  const leadsHi = Math.max(leadsLo, Math.round(projectedClicks * LEAD_RATE_HI));
  const round10 = (n: number) => Math.max(10, Math.round(n / 10) * 10);
  const cplLo = round10(monthlyBudget / leadsHi);
  const cplHi = round10(monthlyBudget / leadsLo);
  const span = (lo: string, hi: string) => (lo === hi ? `~${lo}` : `~${lo}-${hi}`);
  const leadsRange = span(fmt(leadsLo), fmt(leadsHi));
  const cplRange = span(`$${fmt(cplLo)}`, fmt(cplHi));

  const headlinesOver = activeCampaign.headlines.filter((h) => h.length > 30).length;
  const descriptionsOver = activeCampaign.descriptions.filter((d) => d.length > 90).length;

  return (
    <div className="space-y-8">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-fg flex items-center gap-2">
            <Target className="w-4 h-4 text-fg-subtle" />
            <span>{t.title}</span>
          </h2>
          <p className="text-xs text-fg-muted mt-1">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-fg-subtle shrink-0">{t.campaign}</span>
          <div className="inset flex p-1 max-w-full overflow-x-auto no-scrollbar">
            {analysis.campaigns.map((camp, idx) => (
              <button
                key={camp.id}
                onClick={() => setSelectedCampaignIdx(idx)}
                className={`px-3 h-9 sm:h-auto sm:py-1 shrink-0 whitespace-nowrap text-xs rounded-sm font-medium transition-colors cursor-pointer ${
                  selectedCampaignIdx === idx
                    ? 'bg-surface text-fg'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                {L.campaign(camp.campaignType)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real Google Search Ad Preview & Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SERP Ad Preview (7 cols) */}
        <div className="lg:col-span-7 card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-sm font-semibold text-fg">
                  {t.previewTitle}
                </span>
              </div>
              <span className="tag">
                {L.campaign(activeCampaign.campaignType)}
              </span>
            </div>

            {/* Google Search Mockup Card */}
            <div className="inset p-5 space-y-3">
              {/* URL & Sponsored Label */}
              <div className="flex items-center gap-2 text-xs">
                <span className="tag font-semibold text-fg">
                  {t.sponsored}
                </span>
                <span className="text-fg-subtle flex items-center gap-1 font-mono text-xs">
                  https://{activeCampaign.displayPath}
                </span>
              </div>

              {/* Ad Headlines */}
              <h4 className="text-base font-semibold text-accent-fg hover:underline cursor-pointer flex items-center gap-1.5 flex-wrap">
                <span>{activeCampaign.headlines.slice(0, 3).join(' | ')}</span>
                <ExternalLink className="w-3.5 h-3.5 inline opacity-60" />
              </h4>

              {/* Description */}
              <p className="text-xs text-fg-muted leading-relaxed">
                {activeCampaign.descriptions.join(' ')}
              </p>

              {/* Sitelinks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-line">
                {activeCampaign.sitelinks.map((sitelink, sIdx) => (
                  <div key={sIdx} className="p-2 rounded-sm hover:bg-surface transition-colors">
                    <span className="text-xs font-semibold text-fg hover:underline cursor-pointer block">
                      {sitelink.title}
                    </span>
                    <span className="text-xs text-fg-subtle line-clamp-1">
                      {sitelink.desc}
                    </span>
                  </div>
                ))}
              </div>

              {/* Callouts */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeCampaign.callouts.map((callout, cIdx) => (
                  <span key={cIdx} className="tag bg-surface">
                    {callout}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Ad Copy Copy-to-Clipboard Action */}
          <div className="mt-4 pt-4 border-t border-line flex items-center justify-between gap-4 text-xs">
            <span className="text-fg-muted min-w-0">{t.audience} <strong className="font-medium text-fg">{activeCampaign.targetAudience}</strong></span>
            <button
              onClick={() => {
                const text = `${t.clipHeadlines}:\n${activeCampaign.headlines.join('\n')}\n\n${t.clipDescriptions}:\n${activeCampaign.descriptions.join('\n')}\n\n${t.clipSitelinks}:\n${activeCampaign.sitelinks.map(s => `${s.title} - ${s.desc}`).join('\n')}`;
                handleCopy(text, 'ad-copy');
              }}
              className="btn btn-secondary btn-sm shrink-0"
            >
              {copiedKey === 'ad-copy' ? <Check className="w-3.5 h-3.5 text-fg-subtle" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'ad-copy' ? t.copiedAd : t.copyAd}</span>
            </button>
          </div>
        </div>

        {/* Character Count & Quality Score Guard (5 cols) */}
        <div className="lg:col-span-5 card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-fg flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-fg-subtle" />
              <span>{t.limitsTitle}</span>
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs text-fg-muted mb-2">
                  <span>{t.headlinesMax}</span>
                  <span className={`font-medium ${headlinesOver ? 'text-accent-fg' : 'text-fg-muted'}`}>{headlinesOver ? t.overLimit(headlinesOver) : t.allFit}</span>
                </div>
                <div className="inset divide-y divide-line max-h-36 overflow-y-auto">
                  {activeCampaign.headlines.map((hl, i) => (
                    <div key={i} className="flex items-center justify-between text-xs px-3 py-2">
                      <span className="text-fg truncate mr-2">{hl}</span>
                      <span className={`num text-xs ${
                        hl.length <= 30 ? 'text-fg-subtle' : 'text-accent-fg font-medium'
                      }`}>
                        {hl.length}/30
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-fg-muted mb-2">
                  <span>{t.descriptionsMax}</span>
                  <span className={`font-medium ${descriptionsOver ? 'text-accent-fg' : 'text-fg-muted'}`}>{descriptionsOver ? t.overLimit(descriptionsOver) : t.allFit}</span>
                </div>
                <div className="inset divide-y divide-line">
                  {activeCampaign.descriptions.map((desc, i) => (
                    <div key={i} className="flex items-center justify-between text-xs px-3 py-2">
                      <span className="text-fg truncate mr-2">{desc}</span>
                      <span className={`num text-xs ${
                        desc.length <= 90 ? 'text-fg-subtle' : 'text-accent-fg font-medium'
                      }`}>
                        {desc.length}/90
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-line text-xs">
            <span className="font-semibold text-fg block mb-1">{t.mixTitle}</span>
            <p className="text-fg-muted text-xs leading-relaxed">
              {t.mixBody}
            </p>
          </div>
        </div>
      </div>

      {/* Target Keywords Matrix */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-semibold text-fg flex items-center gap-2">
              <Target className="w-4 h-4 text-fg-subtle" />
              <span>{t.kwTitle}</span>
              <EstimateBadge />
            </h3>
            <p className="text-xs text-fg-muted mt-1">
              {t.kwSubtitle} {t.kwEstimateNote}
            </p>
          </div>

          {/* Search, Filters & CSV Export */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder={t.filterPlaceholder}
              aria-label={t.filterPlaceholder}
              value={keywordSearch}
              onChange={(e) => setKeywordSearch(e.target.value)}
              className="field h-10 sm:h-8 w-full sm:w-48 px-3 text-base sm:text-xs"
            />
            <div className="inset flex p-1 text-xs max-w-full overflow-x-auto no-scrollbar">
              {([
                ['all', t.filterAll],
                ['transactional', t.filterTransactional],
                ['conquest', t.filterConquest]
              ] as const).map(([filterKey, filterLabel]) => (
                <button
                  key={filterKey}
                  onClick={() => setIntentFilter(filterKey)}
                  className={`px-3 sm:px-2 h-9 sm:h-auto sm:py-1 shrink-0 whitespace-nowrap rounded-sm font-medium transition-colors cursor-pointer ${
                    intentFilter === filterKey ? 'bg-surface text-fg' : 'text-fg-muted hover:text-fg'
                  }`}
                >
                  {filterLabel}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportKeywordsCSV}
              className="btn btn-secondary btn-sm"
              title={t.exportHint}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.exportCsv}</span>
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto rounded border border-line">
          <table className="w-full min-w-[960px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-2 border-b border-line">
                <th className="label py-3 px-4">{t.colKeyword}</th>
                <th className="label py-3 px-3">{t.colIntent}</th>
                <th className="label py-3 px-3">{t.colMatch}</th>
                <th className="label py-3 px-3 whitespace-nowrap">{t.colVolume}</th>
                <th className="label py-3 px-3">{t.colCpc}</th>
                <th className="label py-3 px-3">{t.colDifficulty}</th>
                <th className="label py-3 px-4">{t.colAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredKeywords.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 px-4 text-center text-fg-subtle">{t.noKeywords}</td>
                </tr>
              )}
              {filteredKeywords.map((kw) => (
                <tr key={kw.id} className="hover:bg-surface-2 transition-colors">
                  <td className="py-3 px-4 font-medium text-fg whitespace-nowrap">
                    {kw.keyword}
                  </td>
                  <td className="py-3 px-3">
                    <span className="tag whitespace-nowrap">
                      {L.intent(kw.intent)}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-fg-muted whitespace-nowrap">
                    {kw.matchType === 'Exact'
                      ? `[${L.match(kw.matchType).toLowerCase()}]`
                      : kw.matchType === 'Phrase'
                        ? `"${L.match(kw.matchType).toLowerCase()}"`
                        : L.match(kw.matchType).toLowerCase()}
                  </td>
                  <td className="py-3 px-3 num text-fg-muted whitespace-nowrap">
                    {approx(kw.monthlyVolume)}
                  </td>
                  <td className="py-3 px-3 num font-medium text-fg whitespace-nowrap">
                    {approx(kw.cpc, { money: true })}
                  </td>
                  <td className="py-3 px-3 text-fg-muted whitespace-nowrap">
                    {L.level(difficultyLevel(kw.difficulty))}
                  </td>
                  <td className="py-3 px-4 text-fg-muted text-xs">
                    {kw.recommendedAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Negative Keyword Shield & Budget Planner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Negative Keyword Shield (6 cols) */}
        <div className="lg:col-span-6 card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-fg-subtle" />
                <h3 className="text-base font-semibold text-fg">{t.negTitle}</h3>
              </div>
              <span className="tag num whitespace-nowrap">
                {t.negCount(fmt(negativeKeywords.length))}
              </span>
            </div>
            <p className="text-xs text-fg-muted mb-4">
              {t.negBody}{' '}
              <strong className="text-fg num font-semibold whitespace-nowrap">{approxRange(analysis.metrics.wastedSpendPrevented, { money: true })}{c.perMonth}</strong>{' '}
              {t.negBodyEnd} <EstimateBadge />
            </p>

            {/* Add Custom Negative Keyword Form */}
            <form onSubmit={handleAddNegative} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newNegativeInput}
                onChange={(e) => setNewNegativeInput(e.target.value)}
                placeholder={t.negPlaceholder}
                aria-label={t.negPlaceholder}
                className="field flex-1 min-w-0 h-8 px-3 text-xs"
              />
              <button
                type="submit"
                disabled={!newNegativeInput.trim()}
                className="btn btn-primary btn-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.add}</span>
              </button>
            </form>

            <div className="inset flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-3">
              {negativeKeywords.map((neg, idx) => (
                <span
                  key={idx}
                  className="tag bg-surface font-mono"
                >
                  <span className="text-fg-subtle">-</span>
                  {neg}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-line flex items-center justify-between gap-4">
            <span className="text-xs text-fg-subtle min-w-0">{t.negReady}</span>
            <button
              onClick={() => handleCopy(negativeKeywords.map(k => `-[${k}]`).join('\n'), 'negatives')}
              className="btn btn-secondary btn-sm shrink-0"
            >
              {copiedKey === 'negatives' ? <Check className="w-3.5 h-3.5 text-fg-subtle" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'negatives' ? t.copiedNeg : t.copyNeg}</span>
            </button>
          </div>
        </div>

        {/* Budget & ROAS Bidding Calculator (6 cols) */}
        <div className="lg:col-span-6 card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-fg-subtle" />
                <h3 className="text-base font-semibold text-fg">{t.calcTitle}</h3>
              </div>
              <EstimateBadge />
            </div>
            <p className="text-xs text-fg-muted mb-4">
              {t.calcBody(approx(avgCpc, { money: true }), analysis.niche)}
            </p>

            {/* Slider */}
            <div className="inset space-y-2 mb-4 p-4">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-fg-muted font-medium">{t.monthlySpend}</span>
                <span className="text-base font-semibold num text-fg">${fmt(monthlyBudget)}{c.perMonth}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                aria-label={t.monthlySpend}
                className="w-full accent-accent cursor-pointer"
              />
              <div className="flex justify-between text-xs text-fg-subtle num">
                <span>${fmt(1000)}</span>
                <span>${fmt(25000)}</span>
                <span>${fmt(50000)}</span>
              </div>
            </div>

            {/* Forecast Output Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
              <div className="inset p-3 min-w-0">
                <span className="label block truncate">{t.clicks}</span>
                <span className="text-xl font-semibold num text-fg">{approxRange(projectedClicks)}</span>
              </div>
              <div className="inset p-3 min-w-0">
                <span className="label block truncate">{t.leads}</span>
                <span className="text-xl font-semibold num text-fg">{leadsRange}</span>
              </div>
              <div className="inset p-3 min-w-0">
                <span className="label block truncate">{t.costPerLead}</span>
                <span className="text-xl font-semibold num text-fg">{cplRange}</span>
              </div>
            </div>
          </div>

          <p className="mt-4 pt-4 border-t border-line text-xs text-fg-subtle leading-relaxed">
            {t.calcAssumption}
          </p>
        </div>
      </div>
    </div>
  );
};
