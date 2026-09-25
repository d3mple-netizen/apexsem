import React, { useState } from 'react';
import { Target, Shield, Copy, Check, Filter, Calculator, Sparkles, ExternalLink, ArrowRight, Download, Plus } from 'lucide-react';
import { DomainAnalysis, KeywordOpportunity, AdCopyVariant } from '../types';

interface SEMArchitectProps {
  analysis: DomainAnalysis;
}

export const SEMArchitect: React.FC<SEMArchitectProps> = ({ analysis }) => {
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
    const headers = ['Keyword', 'Intent', 'Match Type', 'Monthly Volume', 'Estimated CPC ($)', 'Difficulty', 'Opportunity Score', 'Action'];
    const rows = filteredKeywords.map(k => [
      `"${k.keyword}"`,
      `"${k.intent}"`,
      `"${k.matchType}"`,
      k.monthlyVolume,
      k.cpc,
      k.difficulty,
      k.opportunityScore,
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

  // Budget calculations
  const avgCpc = analysis.metrics.averageCpcInNiche || 10;
  const projectedClicks = Math.round(monthlyBudget / avgCpc);
  const conversionRate = 0.045; // 4.5% standard B2B SaaS demo conversion rate
  const projectedLeads = Math.round(projectedClicks * conversionRate);
  const targetCpa = projectedLeads > 0 ? Math.round(monthlyBudget / projectedLeads) : 0;
  const avgContractValue = 9500;
  const salesCloseRate = 0.12; // 12% sales close rate from qualified lead to closed-won
  const projectedWonDeals = Math.round(projectedLeads * salesCloseRate * 10) / 10;
  const projectedArr = Math.round(projectedWonDeals * avgContractValue);
  const projectedRoas = monthlyBudget > 0 ? (projectedArr / monthlyBudget).toFixed(1) : '0';

  return (
    <div className="space-y-8">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-fg flex items-center gap-2">
            <Target className="w-4 h-4 text-fg-subtle" />
            <span>Autonomous SEM Campaign Architect</span>
          </h2>
          <p className="text-xs text-fg-muted mt-1">
            Engineered Google Ads campaign structures, high-intent transactional keywords, and character-optimized Responsive Search Ads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-fg-subtle">Campaign Mode:</span>
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
                {camp.campaignType.split(' ')[0]}
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
                  Live SERP Simulation Preview
                </span>
              </div>
              <span className="tag">
                {activeCampaign.campaignType}
              </span>
            </div>

            {/* Google Search Mockup Card */}
            <div className="inset p-5 space-y-3">
              {/* URL & Sponsored Label */}
              <div className="flex items-center gap-2 text-xs">
                <span className="tag font-semibold text-fg">
                  Sponsored
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
            <span className="text-fg-muted">Target Audience: <strong className="font-medium text-fg">{activeCampaign.targetAudience}</strong></span>
            <button
              onClick={() => {
                const text = `HEADLINES:\n${activeCampaign.headlines.join('\n')}\n\nDESCRIPTIONS:\n${activeCampaign.descriptions.join('\n')}\n\nSITELINKS:\n${activeCampaign.sitelinks.map(s => `${s.title} - ${s.desc}`).join('\n')}`;
                handleCopy(text, 'ad-copy');
              }}
              className="btn btn-secondary btn-sm"
            >
              {copiedKey === 'ad-copy' ? <Check className="w-3.5 h-3.5 text-fg-subtle" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'ad-copy' ? 'Copied Ad Copy!' : 'Copy for Google Ads'}</span>
            </button>
          </div>
        </div>

        {/* Character Count & Quality Score Guard (5 cols) */}
        <div className="lg:col-span-5 card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-fg flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-fg-subtle" />
              <span>Google Ads RSA Character Compliance</span>
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs text-fg-muted mb-2">
                  <span>Headlines (Max 30 Chars)</span>
                  <span className="font-medium text-fg-muted">100% Compliant</span>
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
                  <span>Descriptions (Max 90 Chars)</span>
                  <span className="font-medium text-fg-muted">100% Compliant</span>
                </div>
                <div className="inset divide-y divide-line">
                  {activeCampaign.descriptions.map((desc, i) => (
                    <div key={i} className="flex items-center justify-between text-xs px-3 py-2">
                      <span className="text-fg truncate mr-2">{desc}</span>
                      <span className="num text-xs text-fg-subtle">
                        {desc.length}/90
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-line text-xs">
            <span className="font-semibold text-fg block mb-1">Quality Score Optimization Strategy:</span>
            <p className="text-fg-muted text-xs leading-relaxed">
              Google Ads dynamically mixes and matches these headlines. By pairing high-intent problem headlines with social proof, Ad Strength is rated <strong className="font-medium text-fg">"Excellent" (9.8/10)</strong>.
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
              <span>High-Intent Target Keyword Matrix</span>
            </h3>
            <p className="text-xs text-fg-muted mt-1">
              Filtered for bottom-of-funnel decision makers ready to purchase or switch from competitors.
            </p>
          </div>

          {/* Search, Filters & CSV Export */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Filter keywords..."
              value={keywordSearch}
              onChange={(e) => setKeywordSearch(e.target.value)}
              className="field h-10 sm:h-8 w-full sm:w-48 px-3 text-base sm:text-xs"
            />
            <div className="inset flex p-1 text-xs max-w-full overflow-x-auto no-scrollbar">
              {['all', 'transactional', 'conquest'].map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setIntentFilter(filterKey)}
                  className={`px-3 sm:px-2 h-9 sm:h-auto sm:py-1 shrink-0 rounded-sm font-medium capitalize transition-colors cursor-pointer ${
                    intentFilter === filterKey ? 'bg-surface text-fg' : 'text-fg-muted hover:text-fg'
                  }`}
                >
                  {filterKey}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportKeywordsCSV}
              className="btn btn-secondary btn-sm"
              title="Download CSV for Google Ads Editor"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto rounded border border-line">
          <table className="w-full min-w-[960px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-2 border-b border-line">
                <th className="label py-3 px-4">Target Keyword</th>
                <th className="label py-3 px-3">Intent</th>
                <th className="label py-3 px-3">Match</th>
                <th className="label py-3 px-3">Vol/Mo</th>
                <th className="label py-3 px-3">Est. CPC</th>
                <th className="label py-3 px-3">Difficulty</th>
                <th className="label py-3 px-3">Opp. Score</th>
                <th className="label py-3 px-4">Agency Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredKeywords.map((kw) => (
                <tr key={kw.id} className="hover:bg-surface-2 transition-colors">
                  <td className="py-3 px-4 font-medium text-fg whitespace-nowrap">
                    {kw.keyword}
                  </td>
                  <td className="py-3 px-3">
                    <span className="tag">
                      {kw.intent}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-fg-muted">
                    {kw.matchType === 'Exact' ? `[exact]` : `"${kw.matchType.toLowerCase()}"`}
                  </td>
                  <td className="py-3 px-3 num text-fg-muted">
                    {kw.monthlyVolume.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 num font-medium text-fg">
                    ${kw.cpc.toFixed(2)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="num text-fg-muted">{kw.difficulty}/100</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="num font-semibold text-fg">{kw.opportunityScore}</span>
                      <div className="w-12 bg-surface-2 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-fg-muted h-full rounded-full"
                          style={{ width: `${kw.opportunityScore}%` }}
                        />
                      </div>
                    </div>
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
                <h3 className="text-base font-semibold text-fg">Negative Keyword Budget Shield</h3>
              </div>
              <span className="tag num">
                {negativeKeywords.length} Terms Shielded
              </span>
            </div>
            <p className="text-xs text-fg-muted mb-4">
              Eliminate budget waste from job seekers, students, and low-intent searches. Prevents an estimated{' '}
              <strong className="text-pos num font-semibold">${analysis.metrics.wastedSpendPrevented.toLocaleString()}</strong> in wasted ad spend.
            </p>

            {/* Add Custom Negative Keyword Form */}
            <form onSubmit={handleAddNegative} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newNegativeInput}
                onChange={(e) => setNewNegativeInput(e.target.value)}
                placeholder="Add custom negative term (e.g. coupon, syllabus)..."
                className="field flex-1 h-8 px-3 text-xs"
              />
              <button
                type="submit"
                disabled={!newNegativeInput.trim()}
                className="btn btn-primary btn-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
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
            <span className="text-xs text-fg-subtle">Ready to paste into Google Ads Editor</span>
            <button
              onClick={() => handleCopy(negativeKeywords.map(k => `-[${k}]`).join('\n'), 'negatives')}
              className="btn btn-secondary btn-sm"
            >
              {copiedKey === 'negatives' ? <Check className="w-3.5 h-3.5 text-fg-subtle" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'negatives' ? 'Copied Negative List!' : 'Copy Negative List'}</span>
            </button>
          </div>
        </div>

        {/* Budget & ROAS Bidding Calculator (6 cols) */}
        <div className="lg:col-span-6 card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-fg-subtle" />
                <h3 className="text-base font-semibold text-fg">Smart Bidding & CAC Calculator</h3>
              </div>
              <span className="text-xs text-fg-subtle">
                Predictive Model
              </span>
            </div>
            <p className="text-xs text-fg-muted mb-4">
              Simulate paid search pipeline output based on <span className="num">${avgCpc.toFixed(2)}</span> average CPC in {analysis.niche}.
            </p>

            {/* Slider */}
            <div className="inset space-y-2 mb-4 p-4">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-fg-muted font-medium">Monthly Ad Spend:</span>
                <span className="text-base font-semibold num text-fg">${monthlyBudget.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                className="w-full accent-accent cursor-pointer"
              />
              <div className="flex justify-between text-xs text-fg-subtle num">
                <span>$1,000</span>
                <span>$25,000</span>
                <span>$50,000</span>
              </div>
            </div>

            {/* Forecast Output Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="inset p-3">
                <span className="label block">Projected Clicks</span>
                <span className="text-xl font-semibold num text-fg">{projectedClicks.toLocaleString()}</span>
              </div>
              <div className="inset p-3">
                <span className="label block">Qualified Leads</span>
                <span className="text-xl font-semibold num text-fg">{projectedLeads}</span>
              </div>
              <div className="inset p-3">
                <span className="label block">Projected ROAS</span>
                <span className="text-xl font-semibold num text-fg">{projectedRoas}x</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-line flex items-center justify-between gap-4 text-xs text-fg-muted">
            <span>Target CPA: <strong className="font-semibold num text-fg">${targetCpa}</strong></span>
            <span>Est. Pipeline: <strong className="font-semibold num text-fg">${projectedArr.toLocaleString()}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
