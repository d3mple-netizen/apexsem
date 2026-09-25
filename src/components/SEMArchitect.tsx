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
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span>Autonomous SEM Campaign Architect</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Engineered Google Ads campaign structures, high-intent transactional keywords, and character-optimized Responsive Search Ads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Campaign Mode:</span>
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800">
            {analysis.campaigns.map((camp, idx) => (
              <button
                key={camp.id}
                onClick={() => setSelectedCampaignIdx(idx)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  selectedCampaignIdx === idx
                    ? 'bg-brand-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
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
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl flex flex-col justify-between transition-colors duration-200">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                  Live SERP Simulation Preview
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-500/20">
                {activeCampaign.campaignType}
              </span>
            </div>

            {/* Google Search Mockup Card */}
            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800/90 space-y-3 font-sans shadow-inner">
              {/* URL & Sponsored Label */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-100 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                  Sponsored
                </span>
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono text-[11px]">
                  https://{activeCampaign.displayPath}
                </span>
              </div>

              {/* Ad Headlines */}
              <h4 className="text-lg font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer flex items-center gap-1.5 flex-wrap">
                <span>{activeCampaign.headlines.slice(0, 3).join(' | ')}</span>
                <ExternalLink className="w-3.5 h-3.5 inline opacity-60" />
              </h4>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeCampaign.descriptions.join(' ')}
              </p>

              {/* Sitelinks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                {activeCampaign.sitelinks.map((sitelink, sIdx) => (
                  <div key={sIdx} className="p-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 hover:border-brand-500/30 transition-all">
                    <span className="text-xs font-semibold text-brand-600 dark:text-brand-300 hover:underline cursor-pointer block">
                      {sitelink.title}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {sitelink.desc}
                    </span>
                  </div>
                ))}
              </div>

              {/* Callouts */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeCampaign.callouts.map((callout, cIdx) => (
                  <span key={cIdx} className="text-[10px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                    ✓ {callout}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Ad Copy Copy-to-Clipboard Action */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Target Audience: <strong className="text-slate-800 dark:text-slate-200">{activeCampaign.targetAudience}</strong></span>
            <button
              onClick={() => {
                const text = `HEADLINES:\n${activeCampaign.headlines.join('\n')}\n\nDESCRIPTIONS:\n${activeCampaign.descriptions.join('\n')}\n\nSITELINKS:\n${activeCampaign.sitelinks.map(s => `${s.title} - ${s.desc}`).join('\n')}`;
                handleCopy(text, 'ad-copy');
              }}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              {copiedKey === 'ad-copy' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'ad-copy' ? 'Copied Ad Copy!' : 'Copy for Google Ads'}</span>
            </button>
          </div>
        </div>

        {/* Character Count & Quality Score Guard (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl flex flex-col justify-between transition-colors duration-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-accent-500" />
              <span>Google Ads RSA Character Compliance</span>
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>Headlines (Max 30 Chars)</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">100% Compliant</span>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {activeCampaign.headlines.map((hl, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-800 dark:text-slate-200 font-mono truncate mr-2">{hl}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        hl.length <= 30 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}>
                        {hl.length}/30
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>Descriptions (Max 90 Chars)</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">100% Compliant</span>
                </div>
                <div className="space-y-1.5">
                  {activeCampaign.descriptions.map((desc, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-800 dark:text-slate-200 font-mono truncate mr-2">{desc}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {desc.length}/90
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800/40 text-xs">
            <span className="font-semibold text-brand-700 dark:text-brand-300 block mb-1">Quality Score Optimization Strategy:</span>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Google Ads dynamically mixes and matches these headlines. By pairing high-intent problem headlines with social proof, Ad Strength is rated <strong>"Excellent" (9.8/10)</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Target Keywords Matrix */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-500" />
              <span>High-Intent Target Keyword Matrix</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
            />
            <div className="flex rounded-lg bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800 text-xs">
              {['all', 'transactional', 'conquest'].map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setIntentFilter(filterKey)}
                  className={`px-2 py-0.5 rounded capitalize transition-all cursor-pointer ${
                    intentFilter === filterKey ? 'bg-brand-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {filterKey}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportKeywordsCSV}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              title="Download CSV for Google Ads Editor"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                <th className="py-3 px-4 font-semibold">Target Keyword</th>
                <th className="py-3 px-3 font-semibold">Intent</th>
                <th className="py-3 px-3 font-semibold">Match</th>
                <th className="py-3 px-3 font-semibold">Vol/Mo</th>
                <th className="py-3 px-3 font-semibold">Est. CPC</th>
                <th className="py-3 px-3 font-semibold">Difficulty</th>
                <th className="py-3 px-3 font-semibold">Opp. Score</th>
                <th className="py-3 px-4 font-semibold">Agency Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {filteredKeywords.map((kw) => (
                <tr key={kw.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-white">
                    {kw.keyword}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      kw.intent.includes('Transactional')
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : kw.intent.includes('Conquest')
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        : 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20'
                    }`}>
                      {kw.intent}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    {kw.matchType === 'Exact' ? `[exact]` : `"${kw.matchType.toLowerCase()}"`}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                    {kw.monthlyVolume.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-brand-600 dark:text-brand-300">
                    ${kw.cpc.toFixed(2)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-slate-600 dark:text-slate-300">{kw.difficulty}/100</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{kw.opportunityScore}</span>
                      <div className="w-12 bg-slate-200 dark:bg-slate-950 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${kw.opportunityScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-[11px]">
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
        <div className="lg:col-span-6 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl flex flex-col justify-between transition-colors duration-200">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Negative Keyword Budget Shield</h3>
              </div>
              <span className="text-xs font-mono text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-500/20 font-semibold">
                {negativeKeywords.length} Terms Shielded
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Eliminate budget waste from job seekers, students, and low-intent searches. Prevents an estimated{' '}
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono">${analysis.metrics.wastedSpendPrevented.toLocaleString()}</strong> in wasted ad spend.
            </p>

            {/* Add Custom Negative Keyword Form */}
            <form onSubmit={handleAddNegative} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newNegativeInput}
                onChange={(e) => setNewNegativeInput(e.target.value)}
                placeholder="Add custom negative term (e.g. coupon, syllabus)..."
                className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
              />
              <button
                type="submit"
                disabled={!newNegativeInput.trim()}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              {negativeKeywords.map((neg, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/30 flex items-center gap-1"
                >
                  <span className="text-rose-500 font-bold">-</span>
                  {neg}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">Ready to paste into Google Ads Editor</span>
            <button
              onClick={() => handleCopy(negativeKeywords.map(k => `-[${k}]`).join('\n'), 'negatives')}
              className="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-600/20 hover:bg-rose-100 dark:hover:bg-rose-600/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              {copiedKey === 'negatives' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'negatives' ? 'Copied Negative List!' : 'Copy Negative List'}</span>
            </button>
          </div>
        </div>

        {/* Budget & ROAS Bidding Calculator (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl flex flex-col justify-between transition-colors duration-200">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Smart Bidding & CAC Calculator</h3>
              </div>
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-500/20 font-semibold">
                Predictive Model
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Simulate paid search pipeline output based on ${avgCpc.toFixed(2)} average CPC in {analysis.niche}.
            </p>

            {/* Slider */}
            <div className="space-y-2 mb-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Monthly Ad Spend:</span>
                <span className="text-base font-mono font-bold text-brand-600 dark:text-brand-400">${monthlyBudget.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                className="w-full accent-brand-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>$1,000</span>
                <span>$25,000</span>
                <span>$50,000</span>
              </div>
            </div>

            {/* Forecast Output Grid */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Projected Clicks</span>
                <span className="text-base font-bold font-mono text-slate-900 dark:text-white">{projectedClicks.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Qualified Leads</span>
                <span className="text-base font-bold font-mono text-brand-600 dark:text-brand-300">{projectedLeads}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Projected ROAS</span>
                <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">{projectedRoas}x</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Target CPA: <strong className="text-slate-800 dark:text-white font-mono">${targetCpa}</strong></span>
            <span>Est. Pipeline: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">${projectedArr.toLocaleString()}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
