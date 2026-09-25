import React, { useState } from 'react';
import { Eye, CheckCircle2, AlertTriangle, Copy, Check, Sparkles, ArrowRight, Video, X, RefreshCw } from 'lucide-react';
import { DomainAnalysis } from '../types';

interface CROStudioProps {
  analysis: DomainAnalysis;
}

export const CROStudio: React.FC<CROStudioProps> = ({ analysis }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);
  const [leadEmail, setLeadEmail] = useState<string>('');
  const [leadSubmitted, setLeadSubmitted] = useState<boolean>(false);

  // Dynamic Headline variants generator
  const [headlineIndex, setHeadlineIndex] = useState<number>(0);

  const brandName = analysis.domain.split('.')[0].toUpperCase();
  const nicheName = analysis.niche.split('&')[0].trim();

  const headlineVariants = [
    {
      head: analysis.croAudit.recommendedHeroHeadline,
      sub: analysis.croAudit.recommendedHeroSubhead,
      lift: '+42% vs Baseline'
    },
    {
      head: `Stop Losing Customers to Legacy ${nicheName} Tools.`,
      sub: `Switch to ${brandName} in 5 minutes. 10x faster execution, enterprise SOC2 compliance, and zero setup lag.`,
      lift: '+54% vs Baseline'
    },
    {
      head: `The Modern Infrastructure Built for Scalable ${nicheName}.`,
      sub: `Empower your team with autonomous workflows and automated insights. Start your 14-day free trial today.`,
      lift: '+38% vs Baseline'
    }
  ];

  const currentVariant = headlineVariants[headlineIndex % headlineVariants.length];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail.trim()) return;
    setLeadSubmitted(true);
    setTimeout(() => {
      setLeadSubmitted(false);
      setIsLeadModalOpen(false);
      setLeadEmail('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-500" />
            <span>Landing Page & Conversion Rate Optimization (CRO)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ensure high-intent search traffic actually converts into paying pipeline through message match, friction reduction, and high-impact copy.
          </p>
        </div>

        <button
          onClick={() => setHeadlineIndex((prev) => prev + 1)}
          className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5 text-brand-500" />
          <span>Generate New Variant ({((headlineIndex % headlineVariants.length) + 1)}/3)</span>
        </button>
      </div>

      {/* CRO Scorecard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg transition-colors duration-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hero Headline Clarity</span>
            <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">{analysis.croAudit.headlineScore}/100</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
            <div className="bg-brand-500 h-full rounded-full" style={{ width: `${analysis.croAudit.headlineScore}%` }} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Measures how quickly a visitor understands your core value proposition within 3 seconds.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg transition-colors duration-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">SEM Message-Match Alignment</span>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{analysis.croAudit.messageMatchScore}/100</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${analysis.croAudit.messageMatchScore}%` }} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Directly impacts Google Ads Quality Score and drops average Cost-Per-Click by up to 35%.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg transition-colors duration-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Checkout / Signup Friction</span>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">{analysis.croAudit.frictionScore}/100</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${analysis.croAudit.frictionScore}%` }} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Low friction score is optimal. Evaluates form fields, auth barriers, and demo booking steps.
          </p>
        </div>
      </div>

      {/* Side-by-Side: Current Landing Page Critique vs AI Optimized Hero Variant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recommended Hero Variant (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-500/10 px-2.5 py-1 rounded-md border border-accent-200 dark:border-accent-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> AI Optimized Hero Section
            </span>
            <button
              onClick={() => {
                const text = `HEADLINE: ${currentVariant.head}\nSUBHEAD: ${currentVariant.sub}\nCTA: ${analysis.croAudit.recommendedCTA}`;
                handleCopy(text, 'hero-copy');
              }}
              className="text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer shadow-sm active:scale-95"
            >
              {copiedKey === 'hero-copy' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'hero-copy' ? 'Copied Hero!' : 'Copy Copy'}</span>
            </button>
          </div>

          {/* Hero Preview Card */}
          <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800/90 text-center space-y-4">
            <span className="inline-block text-[11px] font-mono text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-500/20">
              Target Conversion Lift: {currentVariant.lift}
            </span>

            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
              {currentVariant.head}
            </h3>

            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              {currentVariant.sub}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setIsLeadModalOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-glow flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{analysis.croAudit.recommendedCTA}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5 text-accent-500" />
                <span>Watch 2-Min Interactive Demo</span>
              </button>
            </div>

            <div className="pt-3 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-4">
              <span>✓ Instant setup</span>
              <span>✓ SOC2 Type II Certified</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Actionable CRO Findings (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-3 transition-colors duration-200">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">High-Priority Conversion Bottlenecks</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {analysis.croAudit.findings.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                    item.severity === 'high'
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}>
                    {item.severity} Priority
                  </span>
                </div>
                <div className="text-slate-700 dark:text-slate-300 font-medium">
                  <strong>Issue:</strong> {item.issue}
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 text-[11px]">
                  <strong>Agency Fix:</strong> {item.solution}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Lead Flow Modal */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setIsLeadModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Test High-Converting Lead Form
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Experience the 1-field friction-free signup flow designed for {analysis.domain}.
              </p>
            </div>

            {leadSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center text-xs text-emerald-700 dark:text-emerald-400 font-semibold space-y-1">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-500" />
                <p>Lead Captured Successfully!</p>
                <span className="text-[11px] font-normal text-slate-500">Redirecting to onboarding workspace...</span>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-glow transition-all cursor-pointer active:scale-95"
                >
                  Start Free 14-Day Enterprise Trial
                </button>
                <p className="text-[10px] text-center text-slate-400">
                  Instant activation • No credit card required • SOC-2 certified
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Interactive Demo Video Walkthrough Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsDemoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-accent-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Interactive Product Walkthrough ({analysis.domain})
              </h3>
            </div>

            <div className="aspect-video bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-6 text-center text-xs space-y-3 shadow-inner">
              <div className="w-14 h-14 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 animate-pulse">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-white">Interactive Interactive Tour Simulation</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                  Demonstrating automatic schema deployment, high-intent Google Ads sync, and AI search citation tracking for {analysis.domain}.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsDemoModalOpen(false)}
                className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-glow active:scale-95"
              >
                Close Walkthrough
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
