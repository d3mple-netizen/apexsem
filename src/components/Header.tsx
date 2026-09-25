import React, { useEffect, useRef, useState } from 'react';
import { Download, MoreHorizontal, MessageSquare, Sun, Moon, ArrowUpRight } from 'lucide-react';
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

export const Logo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <rect width="64" height="64" rx="14" className="fill-accent" />
    <path d="M32 13 49 51h-8.6l-3.3-7.8H26.9L23.6 51H15zm0 14.6-3 7.6h6z" fill="#fff" />
  </svg>
);

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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const runAndClose = (fn: () => void) => () => {
    setMenuOpen(false);
    fn();
  };

  const menuItem =
    'w-full flex items-center gap-3 px-3 h-9 text-sm text-fg-muted hover:text-fg hover:bg-surface-2 rounded-sm transition-colors cursor-pointer';

  return (
    <header className="sticky top-0 z-40 bg-canvas/85 backdrop-blur-md border-b border-line px-4 lg:px-8">
      <div className="max-w-7xl mx-auto h-14 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6 min-w-0">
          <button
            type="button"
            onClick={() => onNavigateToTab('overview')}
            aria-label="ApexSEM, go to overview"
            className="flex items-center gap-2 shrink-0 rounded-sm cursor-pointer"
          >
            <Logo />
            <span className="text-base font-semibold tracking-[-0.02em] text-fg">ApexSEM</span>
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs text-fg-subtle min-w-0">
            <span className="w-px h-4 bg-line-strong" aria-hidden="true" />
            <a
              href={analysis.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group ml-2 inline-flex items-center gap-1 font-mono text-fg-muted hover:text-fg transition-colors truncate"
              title="Open domain in new tab"
            >
              {analysis.domain}
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={() => onNavigateToTab('organic')}
              className="hover:text-fg transition-colors cursor-pointer whitespace-nowrap"
              title="View authority plan"
            >
              {analysis.score.tier}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={onExport} className="btn btn-ghost btn-sm hidden sm:inline-flex" title="Download the full playbook as Markdown">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>

          {isSubscribed ? (
            <span className="text-xs text-fg-muted px-2">Pro plan</span>
          ) : (
            <button type="button" onClick={onOpenSubscribeModal} className="btn btn-primary btn-sm">
              Upgrade
            </button>
          )}

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="More actions"
              className="btn btn-ghost btn-sm w-8 px-0"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div role="menu" className="absolute right-0 mt-2 w-56 p-1 bg-surface border border-line rounded shadow-overlay">
                <button role="menuitem" type="button" onClick={runAndClose(onOpenChat)} className={menuItem}>
                  <MessageSquare className="w-4 h-4" />
                  Ask the strategist
                </button>
                <button role="menuitem" type="button" onClick={runAndClose(onExport)} className={menuItem}>
                  <Download className="w-4 h-4" />
                  Export playbook
                </button>
                <div className="my-1 h-px bg-line" />
                <button role="menuitem" type="button" onClick={runAndClose(onToggleTheme)} className={menuItem}>
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {theme === 'dark' ? 'Light theme' : 'Dark theme'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
