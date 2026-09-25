import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { FREE_DAILY_LIMIT } from '../services/usage';
import { useDict } from '../i18n';
import { shell } from '../i18n/dict/shell';
import { GoogleMark } from './AuthControls';
import { Logo } from './Header';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
  /** Domain the guest tried to analyze; it runs automatically after sign-in. */
  domain: string | null;
}

/** Shown when a guest presses Analyze or a "Try one" chip. */
export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onSignIn, domain }) => {
  const t = useDict(shell).gate;
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    ctaRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 sm:p-4 anim-fade"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="gate-title"
        aria-describedby="gate-lead"
        className="bg-surface border border-line rounded-t-[14px] rounded-b-none sm:rounded w-full sm:max-w-[26rem] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-8 shadow-overlay relative anim-sheet"
      >
        <button
          onClick={onClose}
          aria-label={t.close}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-11 h-11 flex items-center justify-center rounded text-fg-subtle hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <X className="w-4 h-4" />
        </button>

        <Logo className="w-10 h-10" />
        <h3 id="gate-title" className="mt-5 pr-8 text-xl font-semibold text-fg [text-wrap:balance]">
          {t.title}
        </h3>
        <p id="gate-lead" className="mt-2 text-sm text-fg-muted [text-wrap:pretty]">
          {t.lead(domain)}
        </p>

        <button
          ref={ctaRef}
          type="button"
          onClick={onSignIn}
          className="btn mt-6 w-full h-12 text-base bg-fg text-canvas hover:bg-fg/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
            <GoogleMark className="w-4 h-4" />
          </span>
          {t.cta}
        </button>
        <p className="mt-3 text-xs text-fg-subtle text-center">{t.fine(FREE_DAILY_LIMIT)}</p>

        <div className="mt-6 pt-4 border-t border-line text-center">
          <button
            type="button"
            onClick={onClose}
            className="h-11 sm:h-auto text-sm text-fg-muted underline decoration-line-strong underline-offset-4 hover:text-fg transition-colors cursor-pointer"
          >
            {t.browse}
          </button>
        </div>
      </div>
    </div>
  );
};
