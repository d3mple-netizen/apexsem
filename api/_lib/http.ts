// Server-only helpers shared by the /api functions. Files under api/_lib are
// not exposed as routes by Vercel.

export function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers }
  });
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  return (fwd?.split(',')[0] ?? request.headers.get('x-real-ip') ?? 'unknown').trim();
}

// Best-effort sliding-window limiter. State lives per function instance, so it
// caps bursts from one client rather than enforcing a global quota; it exists to
// keep a single visitor from burning the Anthropic budget.
const buckets = new Map<string, number[]>();

export function rateLimited(request: Request, scope: string, limit: number, windowMs: number): boolean {
  const key = `${scope}:${clientIp(request)}`;
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return true;
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) buckets.clear();
  return false;
}
