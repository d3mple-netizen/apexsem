import React, { useState } from 'react';
import { Search, Loader2, Sparkles, Globe, ArrowRight } from 'lucide-react';

interface DomainSearchBarProps {
  currentDomain: string;
  onAnalyze: (domain: string) => void;
  isLoading: boolean;
}

const PRESET_DOMAINS = [
  { domain: 'linear.app', label: 'Linear', tag: 'Productivity' },
  { domain: 'supabase.com', label: 'Supabase', tag: 'DevTools' },
  { domain: 'ramp.com', label: 'Ramp', tag: 'FinTech' },
  { domain: 'posthog.com', label: 'PostHog', tag: 'Analytics' },
  { domain: 'brex.com', label: 'Brex', tag: 'Corporate Spend' }
];

export const DomainSearchBar: React.FC<DomainSearchBarProps> = ({
  currentDomain,
  onAnalyze,
  isLoading
}) => {
  const [inputVal, setInputVal] = useState(currentDomain);
  const [scanStep, setScanStep] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    
    setScanStep('Inspecting robots.txt, Core Web Vitals & indexing readiness...');
    setTimeout(() => {
      setScanStep('Extracting high-intent SEM keywords & competitor conquest terms...');
    }, 400);
    setTimeout(() => {
      setScanStep('Computing T1 Topical Authority Graph & AI Search GEO signals...');
    }, 800);
    setTimeout(() => {
      onAnalyze(inputVal.trim());
      setScanStep('');
    }, 1200);
  };

  const handleSelectPreset = (domain: string) => {
    setInputVal(domain);
    onAnalyze(domain);
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 md:p-6 mb-8 backdrop-blur-md relative overflow-hidden shadow-sm dark:shadow-xl transition-colors duration-200">
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Domain Authority & SEM Optimization Engine</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-500/10 dark:bg-accent-500/20 text-accent-600 dark:text-accent-300 border border-accent-500/20 dark:border-accent-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Tier-1 Blueprint
              </span>
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Analyze any B2B SaaS domain to reverse-engineer high-intent traffic, eliminate wasted ad spend, and claim #1 search dominance.
            </p>
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Globe className="w-4 h-4 text-brand-500" />
            </div>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter domain or URL (e.g. acmesaas.com, linear.app)..."
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-mono text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-glow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Running Agency Teardown...</span>
              </>
            ) : (
              <>
                <span>Analyze & Optimize</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Scan Progress State */}
        {scanStep && (
          <div className="mt-3.5 flex items-center gap-2.5 text-xs font-mono text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/40 px-3.5 py-2 rounded-lg animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>{scanStep}</span>
          </div>
        )}

        {/* Preset Domain Quick Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <Search className="w-3 h-3" /> Quick Benchmark:
          </span>
          {PRESET_DOMAINS.map((item) => (
            <button
              key={item.domain}
              type="button"
              onClick={() => handleSelectPreset(item.domain)}
              className={`px-2.5 py-1 rounded-lg border transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer ${
                currentDomain === item.domain
                  ? 'bg-brand-50 dark:bg-brand-500/20 border-brand-500/50 text-brand-700 dark:text-brand-300 font-semibold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                {item.tag}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
