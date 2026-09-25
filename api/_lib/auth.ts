// Verifies the Supabase session token the browser sends as a Bearer header.
// URL and publishable key are public (they ship in the client bundle too).
const SUPABASE_URL = 'https://jbyjldejhlizvfuxxsek.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_gMNTIhZMqmYTXfkW7Fq4Mw_MGbxM0-n';

export type AuthCheck = { ok: true; userId: string | null } | { ok: false };

/**
 * ok:false only when the token is missing or Supabase rejects it. If Supabase
 * itself is unreachable we let the request through rather than lock out
 * signed-in users during an auth outage.
 */
export async function verifyUser(request: Request): Promise<AuthCheck> {
  const token = request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return { ok: false };
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { authorization: `Bearer ${token}`, apikey: SUPABASE_ANON_KEY },
      signal: AbortSignal.timeout(5_000)
    });
    if (res.status === 400 || res.status === 401 || res.status === 403) return { ok: false };
    if (!res.ok) return { ok: true, userId: null };
    const user = (await res.json()) as { id?: string };
    return user.id ? { ok: true, userId: user.id } : { ok: false };
  } catch {
    return { ok: true, userId: null };
  }
}
