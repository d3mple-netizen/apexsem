import React, { useEffect, useRef, useState } from 'react';
import { Download, MoreHorizontal, Menu, MessageSquare, Sun, Moon, ArrowUpRight, Layers, Sparkles } from 'lucide-react';
import { DomainAnalysis } from '../types';
import { useDict } from '../i18n';
import { shell } from '../i18n/dict/shell';
import { useLabels } from '../i18n/labels';
import { SampleBadge } from '../lib/honest';
import { AuthControls, LangSwitch } from './AuthControls';

interface HeaderProps {
  analysis: DomainAnalysis;
  onExport: () => void;
  onOpenChat: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onNavigateToTab: (tab: string) => void;
  isSubscribed: boolean;
  onOpenSubscribeModal: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
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
  onOpenSubscribeModal,
  onSignIn,
  onSignOut
}) => {
  const t = useDict(shell).header;
  const L = useLabels();
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
    'w-full flex items-center gap-3 px-3 h-11 sm:h-9 text-sm text-fg-muted hover:text-fg hover:bg-surface-2 rounded-sm transition-colors cursor-pointer';

  return (
    <header className="sticky top-0 z-40 bg-canvas/85 backdrop-blur-md border-b border-line px-4 lg:px-8">
      <div className="max-w-7xl mx-auto h-14 flex items-center justify-between gap-3 sm:gap-6">
        <div className="flex items-center gap-6 min-w-0">
          <button
            type="button"
            onClick={() => onNavigateToTab('overview')}
            aria-label={t.home}
            className="flex items-center gap-2 shrink-0 h-11 rounded-sm cursor-pointer"
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
              title={t.openDomain}
            >
              {analysis.domain}
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={() => onNavigateToTab('organic')}
              className="hover:text-fg transition-colors cursor-pointer whitespace-nowrap"
              title={t.viewAuthority}
            >
              {L.tier(analysis.score.tier)}
            </button>
            {analysis.source === 'sample' && <SampleBadge className="ml-1" />}
          </div>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-2">
          <button type="button" onClick={onExport} className="btn btn-ghost btn-sm hidden sm:inline-flex" title={t.exportTitle}>
            <Download className="w-4 h-4" />
            <span>{t.export}</span>
          </button>

          <LangSwitch />

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? t.toLight : t.toDark}
            title={theme === 'dark' ? t.lightTheme : t.darkTheme}
            className="btn btn-ghost w-11 h-11 sm:w-8 sm:h-8 px-0"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <AuthControls onSignIn={onSignIn} onSignOut={onSignOut} />

          {isSubscribed ? (
            <span className="hidden sm:inline text-xs text-fg-muted px-2">{t.proPlan}</span>
          ) : (
            <button type="button" onClick={onOpenSubscribeModal} className="btn btn-primary hidden sm:inline-flex h-8 px-3 text-xs">
              {t.upgrade}
            </button>
          )}

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label={t.moreActions}
              className="btn btn-ghost w-11 h-11 sm:w-8 sm:h-8 px-0"
            >
              <Menu className="w-5 h-5 sm:hidden" />
              <MoreHorizontal className="w-4 h-4 hidden sm:block" />
            </button>
            {menuOpen && (
              <div role="menu" className="absolute right-0 mt-2 w-[min(16rem,calc(100vw-2rem))] p-1 bg-surface border border-line rounded shadow-overlay anim-fade">
                <div className="md:hidden px-3 pt-2 pb-3 mb-1 border-b border-line">
                  <a
                    href={analysis.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-mono text-sm text-fg truncate"
                  >
                    <span className="truncate">{analysis.domain}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-fg-subtle" />
                  </a>
                  <span className="flex items-center gap-2 text-xs text-fg-subtle">
                    {L.tier(analysis.score.tier)}
                    {analysis.source === 'sample' && <SampleBadge />}
                  </span>
                </div>
                <button role="menuitem" type="button" onClick={runAndClose(() => onNavigateToTab('organic'))} className={`${menuItem} md:hidden`}>
                  <Layers className="w-4 h-4" />
                  {t.authorityPlan}
                </button>
                <button role="menuitem" type="button" onClick={runAndClose(onOpenChat)} className={menuItem}>
                  <MessageSquare className="w-4 h-4" />
                  {t.askStrategist}
                </button>
                <button role="menuitem" type="button" onClick={runAndClose(onExport)} className={menuItem}>
                  <Download className="w-4 h-4" />
                  {t.exportPlaybook}
                </button>
                {!isSubscribed && (
                  <button role="menuitem" type="button" onClick={runAndClose(onOpenSubscribeModal)} className={`${menuItem} sm:hidden`}>
                    <Sparkles className="w-4 h-4" />
                    {t.upgrade}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
