import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, googleSignInAvailable } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

interface AuthValue {
  user: AuthUser | null;
  /** True until the stored session has been read, so the header doesn't flash "Sign in". */
  loading: boolean;
  /** False on origins Google OAuth isn't registered for (localhost, previews). */
  available: boolean;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  /** Current Supabase access token for API calls, refreshed if needed. */
  getAccessToken: () => Promise<string | null>;
  /** OAuth error returned in the redirect URL, if any. Cleared after reading. */
  redirectError: string | null;
  clearRedirectError: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

function toAuthUser(u: User | null | undefined): AuthUser | null {
  if (!u) return null;
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
  const s = (v: unknown) => (typeof v === 'string' && v ? v : undefined);
  const email = u.email ?? s(meta.email) ?? '';
  return {
    id: u.id,
    email,
    name: s(meta.full_name) ?? s(meta.name) ?? email.split('@')[0] ?? '',
    avatarUrl: s(meta.avatar_url) ?? s(meta.picture) ?? null
  };
}

function readRedirectError(): string | null {
  const params = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const msg = params.get('error_description') ?? hash.get('error_description') ?? params.get('error') ?? hash.get('error');
  if (!msg) return null;
  window.history.replaceState(null, '', window.location.pathname);
  return msg.replace(/\+/g, ' ');
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectError, setRedirectError] = useState<string | null>(() => readRedirectError());

  useEffect(() => {
    let alive = true;
    supabase.auth
      .getSession()
      .then(({ data }) => alive && setUser(toAuthUser(data.session?.user)))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toAuthUser(session?.user));
      setLoading(false);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!googleSignInAvailable()) return { error: 'unavailable' };
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin, queryParams: { prompt: 'select_account' } }
    });
    return error ? { error: error.message } : {};
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut().catch(() => {});
    setUser(null);
  }, []);

  const getAccessToken = useCallback(async () => {
    const { data } = await supabase.auth.getSession().catch(() => ({ data: { session: null } }));
    return data.session?.access_token ?? null;
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      loading,
      available: googleSignInAvailable(),
      signInWithGoogle,
      signOut,
      getAccessToken,
      redirectError,
      clearRedirectError: () => setRedirectError(null)
    }),
    [user, loading, signInWithGoogle, signOut, getAccessToken, redirectError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
