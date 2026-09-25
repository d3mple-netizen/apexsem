// Honest-number helpers. Rule: a figure on screen is either measured from the
// crawl, shown as a rounded range with an Estimate badge, or not shown at all.
import React from 'react';
import type { DomainAnalysis } from '../types';
import { useDict } from '../i18n';
import { common } from '../i18n/common';

/** Scores and CRO checks are computed from the crawl only for live runs. */
export function isMeasured(a: DomainAnalysis): boolean {
  return a.source === 'crawl' || a.source === 'crawl+ai';
}

function roundSig(n: number): number {
  if (n <= 0) return 0;
  const mag = Math.pow(10, Math.floor(Math.log10(n)) - 1);
  return Math.round(n / mag) * mag;
}

function compact(n: number): { v: string; unit: string } {
  if (n >= 1_000_000) return { v: trim(n / 1_000_000), unit: 'M' };
  if (n >= 1_000) return { v: trim(n / 1_000), unit: 'K' };
  return { v: String(Math.round(n)), unit: '' };
}

function trim(x: number): string {
  return x >= 10 ? String(Math.round(x)) : String(Math.round(x * 10) / 10);
}

/**
 * Turns a modeled point value into an honest range: 12,847 -> "~10-15K",
 * 48,300 (money) -> "~$39-58K". Precision is capped at two significant digits.
 */
export function approxRange(n: number, opts: { money?: boolean; spread?: number } = {}): string {
  const spread = opts.spread ?? 0.2;
  if (!Number.isFinite(n) || n <= 0) return '~0';
  const lo = compact(roundSig(n * (1 - spread)));
  const hi = compact(roundSig(n * (1 + spread)));
  const $ = opts.money ? '$' : '';
  if (lo.unit === hi.unit) return lo.v === hi.v ? `~${$}${lo.v}${lo.unit}` : `~${$}${lo.v}-${hi.v}${hi.unit}`;
  return `~${$}${lo.v}${lo.unit}-${hi.v}${hi.unit}`;
}

/** Single rounded figure for tight spots (table cells): 12,847 -> "~13K". */
export function approx(n: number, opts: { money?: boolean } = {}): string {
  if (!Number.isFinite(n) || n <= 0) return '~0';
  const c = compact(roundSig(n));
  return `~${opts.money ? '$' : ''}${c.v}${c.unit}`;
}

const badge =
  'inline-flex items-center h-4 px-1 rounded-sm text-[10px] leading-none font-medium text-fg-subtle bg-surface-2 border border-line whitespace-nowrap align-middle cursor-help select-none';

/** Small grey label marking a modeled figure. */
export const EstimateBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const t = useDict(common);
  return (
    <span className={`${badge} ${className}`} title={t.estimateHint}>
      {t.estimate}
    </span>
  );
};

/** Marks the bundled demo report. */
export const SampleBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const t = useDict(common);
  return (
    <span className={`${badge} ${className}`} title={t.sampleHint}>
      {t.sampleData}
    </span>
  );
};
