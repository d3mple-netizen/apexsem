import React, { useEffect, useRef, useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useDict, useI18n, Lang } from '../i18n';
import { shell } from '../i18n/dict/shell';

/** Google's "G" mark. Brand rules require the original colors on sign-in buttons. */
export const GoogleMark: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

/** Text switch "EN | RU". Both options stay visible so the current one is obvious. */
export const LangSwitch: React.FC = () => {
  const { lang, setLang } = useI18n();
  const t = useDict(shell).header;
  const opt = (code: Lang, label: string) => (
    <button
      type="button"
      onClick={() => setLang(code)}
      aria-pressed={lang === code}
      lang={code}
      className={`h-11 sm:h-8 px-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
        lang === code ? 'text-fg' : 'text-fg-subtle hover:text-fg'
      }`}
    >
      {label}
    </button>
  );
  return (
    <div role="group" aria-label={t.language} className="flex items-center">
      {opt('en', 'EN')}
      <span className="text-fg-subtle/60 text-xs select-none" aria-hidden="true">|</span>
      {opt('ru', 'RU')}
    </div>
  );
};

interface AuthControlsProps {
  onSignIn: () => void;
  onSignOut: () => void;
}

export const AuthControls: React.FC<AuthControlsProps> = ({ onSignIn, onSignOut }) => {
  const { user, loading } = useAuth();
  const t = useDict(shell).header;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Reserve the slot while the stored session loads to avoid a layout jump.
  if (loading) return <span className="w-11 h-11 sm:w-8 sm:h-8" aria-hidden="true" />;

  if (!user) {
    return (
      <button type="button" onClick={onSignIn} aria-label={t.signInAria} className="btn btn-secondary h-11 w-11 px-0 sm:w-auto sm:h-8 sm:px-3 sm:text-xs">
        <GoogleMark />
        <span className="hidden lg:inline">{t.signIn}</span>
        <span className="hidden sm:inline lg:hidden">{t.signInShort}</span>
      </button>
    );
  }

  const initial = (user.name || user.email || '?').charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t.account}: ${user.email}`}
        title={user.email}
        className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center rounded-full cursor-pointer"
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" referrerPolicy="no-referrer" className="w-7 h-7 rounded-full border border-line object-cover" />
        ) : (
          <span className="w-7 h-7 rounded-full bg-surface-2 border border-line text-xs font-medium text-fg flex items-center justify-center">{initial}</span>
        )}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-[min(16rem,calc(100vw-2rem))] p-1 bg-surface border border-line rounded shadow-overlay anim-fade">
          <div className="px-3 pt-2 pb-3 mb-1 border-b border-line min-w-0">
            <span className="block text-xs text-fg-subtle">{t.signedInAs}</span>
            {user.name && user.name !== user.email && <span className="block text-sm text-fg truncate">{user.name}</span>}
            <span className="block text-xs text-fg-muted truncate">{user.email}</span>
          </div>
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className="w-full flex items-center gap-3 px-3 h-11 sm:h-9 text-sm text-fg-muted hover:text-fg hover:bg-surface-2 rounded-sm transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            {t.signOut}
          </button>
        </div>
      )}
    </div>
  );
};
