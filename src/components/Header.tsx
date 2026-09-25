import React from 'react';
import { Sparkles, ShieldCheck, Download, ExternalLink, Zap, Sun, Moon } from 'lucide-react';
import { DomainAnalysis } from '../types';

interface HeaderProps {
  analysis: DomainAnalysis;
  onExport: () => void;
  onOpenChat: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onNavigateToTab: (tab: string) => void;
  isSubscribed: boolean;
  onOpenSubscribeModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  analysis,
  onExport,
  onOpenChat,
  theme,
  onToggleTheme,
  onNavigateToTab,
  isSubscribed,
  onOpenSubscribeModal
}) => {
  const isTier1 = analysis.score.tier.includes('Tier 1');
  const isTier2 = analysis.score.tier.includes('Tier 2');

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div 
            onClick={() => onNavigateToTab('overview')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-accent-500 p-0.5 shadow-glow flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-brand-600 dark:text-brand-400 fill-brand-400/20" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white font-sans">ApexSEM</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                  AI Agency SaaS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Autonomous B2B SEM Engine & T1 Search Domination</p>
            </div>
          </div>

          {/* Active Domain Badge (Mobile) */}
          <div className="md:hidden flex items-center gap-2">
            <span className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg">
              {analysis.domain}
            </span>
          </div>
        </div>

        {/* Center / Domain Status */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-1.5 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Analyzing:</span>
            <a
              href={analysis.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              title="Open domain in new tab"
            >
              {analysis.domain}
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              onClick={() => onNavigateToTab('organic')}
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 ${
                isTier1
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : isTier2
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
              }`}
              title="View T1 Authority Plan"
            >
              <ShieldCheck className="w-3 h-3" />
              {analysis.score.tier}
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Subscription Badge / Trigger */}
          {isSubscribed ? (
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Autopilot Active ($10/mo)</span>
            </span>
          ) : (
            <button
              onClick={onOpenSubscribeModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-accent-700 dark:text-accent-300 bg-accent-50 dark:bg-accent-500/10 hover:bg-accent-100 dark:hover:bg-accent-500/20 border border-accent-200 dark:border-accent-500/30 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-500" />
              <span>Upgrade ($10/mo)</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition-all cursor-pointer shadow-sm"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* AI Partner Chat Trigger */}
          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
            title="Chat with Local LLM Agency Partner"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent-500" />
            <span className="hidden sm:inline">AI Partner</span>
          </button>

          {/* Export Playbook Button */}
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl shadow-glow transition-all active:scale-95 cursor-pointer"
            title="Download full strategic dossier"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Playbook</span>
          </button>
        </div>
      </div>
    </header>
  );
};
