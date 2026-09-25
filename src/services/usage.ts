// Free-tier metering. Client-side only until billing exists, so it is a soft
// gate: it shapes the sign-in and upgrade path, it does not enforce billing.
// Analyses require Google sign-in; usage is counted per user id. Guests can
// only browse the bundled sample report.

export const FREE_DAILY_LIMIT = 3;
export const PRO_PRICE = 49;
export const PRO_MAILTO = 'mailto:hello@stallbay.com?subject=ApexSEM%20Pro';

const PREFIX = 'apex_usage_v2';
const PRO_KEY = 'apex_pro_v1';

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const keyFor = (userId: string | null) => `${PREFIX}:${userId ?? 'anon'}:${today()}`;

export function dailyLimit(userId: string | null): number {
  return userId ? FREE_DAILY_LIMIT : 0;
}

export function isPro(): boolean {
  try {
    return localStorage.getItem(PRO_KEY) === 'true';
  } catch {
    return false;
  }
}

export function usedToday(userId: string | null): number {
  try {
    const n = Number(localStorage.getItem(keyFor(userId)) ?? 0);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function remainingToday(userId: string | null): number {
  return isPro() ? Infinity : Math.max(0, dailyLimit(userId) - usedToday(userId));
}

export function canAnalyze(userId: string | null): boolean {
  return !!userId && remainingToday(userId) > 0;
}

/** Records one completed analysis and returns the new count for today. */
export function recordAnalysis(userId: string | null): number {
  const next = usedToday(userId) + 1;
  try {
    // Drop older days for this identity so storage doesn't grow forever.
    const prefix = `${PREFIX}:${userId ?? 'anon'}:`;
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix) && k !== keyFor(userId)) localStorage.removeItem(k);
    }
    localStorage.setItem(keyFor(userId), String(next));
  } catch {
    /* storage blocked: the gate simply doesn't persist */
  }
  return next;
}
