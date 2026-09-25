import { createClient } from '@supabase/supabase-js';

// Publishable (anon) key: safe in the browser, access is governed by RLS.
const SUPABASE_URL = 'https://jbyjldejhlizvfuxxsek.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_gMNTIhZMqmYTXfkW7Fq4Mw_MGbxM0-n';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' }
});

/** Google OAuth is registered for production only; other origins get a pointer there. */
export const PROD_ORIGIN = 'https://apexsem.vercel.app';
export const googleSignInAvailable = (): boolean => window.location.origin === PROD_ORIGIN;
