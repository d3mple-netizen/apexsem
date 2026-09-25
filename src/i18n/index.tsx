// Minimal i18n: a context holding the current language and typed per-feature
// dictionaries. Each dictionary is declared once with defineDict(en, ru); the
// Russian half must match the English shape, so a missing key fails `tsc`.
// Values may be functions for interpolation: `left: (n: number) => ...`.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'en' | 'ru';

const STORAGE_KEY = 'apex_lang';

/** Widens string literals so `ru` can hold different text than `en`. */
type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => Widen<R>
    : T extends readonly (infer U)[]
      ? readonly Widen<U>[]
      : T extends object
        ? { [K in keyof T]: Widen<T[K]> }
        : T;

export type Dict<T> = { en: T; ru: Widen<T> };

export function defineDict<T>(en: T, ru: Widen<T>): Dict<T> {
  return { en, ru };
}

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'ru') return saved;
  } catch {
    /* storage blocked: fall through to the browser language */
  }
  const nav = typeof navigator !== 'undefined' ? navigator.languages?.[0] ?? navigator.language ?? '' : '';
  return /^ru\b/i.test(nav) ? 'ru' : 'en';
}

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Locale-aware integer formatting (1,234 / 1 234). */
  fmt: (n: number) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode: choice lasts for this session */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<I18nValue>(() => {
    const nf = new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : 'en-US');
    return { lang, setLang, fmt: (n: number) => nf.format(n) };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}

/** Returns the dictionary for the active language. */
export function useDict<T>(dict: Dict<T>): T {
  const { lang } = useI18n();
  return (lang === 'ru' ? dict.ru : dict.en) as T;
}
