// Free-tier metering. Client-side only until accounts + Stripe exist, so it is
// a soft gate: it shapes the upgrade path, it does not enforce billing.

export const FREE_DAILY_LIMIT = 3;
export const PRO_PRICE = 49;
export const PRO_MAILTO = 'mailto:hello@stallbay.com?subject=ApexSEM%20Pro';

const KEY = 'apex_usage_v1';
const PRO_KEY = 'apex_pro_v1';

interface UsageRecord {
  day: string;
  count: number;
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function read(): UsageRecord {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null') as UsageRecord | null;
    if (raw && raw.day === today() && Number.isFinite(raw.count)) return raw;
  } catch {
    // Corrupt value; start fresh.
  }
  return { day: today(), count: 0 };
}

export function isPro(): boolean {
  return localStorage.getItem(PRO_KEY) === 'true';
}

export function usedToday(): number {
  return read().count;
}

export function remainingToday(): number {
  return isPro() ? Infinity : Math.max(0, FREE_DAILY_LIMIT - read().count);
}

export function canAnalyze(): boolean {
  return remainingToday() > 0;
}

/** Records one completed analysis and returns the new count for today. */
export function recordAnalysis(): number {
  const rec = read();
  rec.count += 1;
  localStorage.setItem(KEY, JSON.stringify(rec));
  return rec.count;
}
