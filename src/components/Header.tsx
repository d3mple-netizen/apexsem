import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useDict } from '../i18n';
import { shell } from '../i18n/dict/shell';
import { AuthControls } from './AuthControls';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onHome: () => void;
  onExport: () => void;
  isSubscribed: boolean;
  onOpenPlans: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
}

/**
 * Logomark: an A whose right leg rebounds into an arrow (rankings going up).
 * White glyph, accent arrow, on a fixed ink tile so it reads in both themes.
 * Same geometry as public/favicon.svg; strokes are sized to hold at 16px.
 */
export const Logo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <rect width="64" height="64" rx="15" fill="#141416" />
    <path d="M11.5 50.5 25 16.5 38.5 50.5M16.8 38.5h16.4" fill="none" stroke="#fff" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M38.5 50.5 47.9 24.3" fill="none" className="stroke-accent" strokeWidth="7.5" strokeLinecap="round" />
    <path d="M52 13 54.9 30 38.9 24.2z" className="fill-accent stroke-accent" strokeWidth="3" strokeLinejoin="round" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, onHome, ...account }) => {
  const t = useDict(shell).header;

  return (
    <header className="sticky top-0 z-40 bg-canvas/85 backdrop-blur-md border-b border-line">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-14 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onHome}
          aria-label={t.home}
          className="flex items-center gap-2 shrink-0 h-11 rounded-sm cursor-pointer"
        >
          <Logo />
          <span className="text-base font-semibold tracking-[-0.02em] text-fg">ApexSEM</span>
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? t.toLight : t.toDark}
            title={theme === 'dark' ? t.toLight : t.toDark}
            className="inline-flex items-center justify-center w-11 h-11 sm:w-8 sm:h-8 rounded-sm text-fg-subtle hover:text-fg transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <AuthControls {...account} />
        </div>
      </div>
    </header>
  );
};
