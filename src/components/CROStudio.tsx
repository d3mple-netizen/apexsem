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
          <h2 className="text-xl font-semibold text-fg flex items-center gap-2">
            <Eye className="w-4 h-4 text-fg-subtle" />
            <span>Landing Page & Conversion Rate Optimization (CRO)</span>
          </h2>
          <p className="text-sm text-fg-muted mt-1 max-w-3xl">
            Ensure high-intent search traffic actually converts into paying pipeline through message match, friction reduction, and high-impact copy.
          </p>
        </div>

        <button
          onClick={() => setHeadlineIndex((prev) => prev + 1)}
          className="btn btn-secondary btn-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-fg-subtle" />
          <span className="num">Generate New Variant ({((headlineIndex % headlineVariants.length) + 1)}/3)</span>
        </button>
      </div>

      {/* CRO Scorecard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-fg-muted">Hero Headline Clarity</span>
            <span className="text-sm font-semibold num text-fg">{analysis.croAudit.headlineScore}/100</span>
          </div>
          <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden">
            <div className="bg-fg-muted h-full rounded-full" style={{ width: `${analysis.croAudit.headlineScore}%` }} />
          </div>
          <p className="text-xs text-fg-subtle mt-3 leading-relaxed">
            Measures how quickly a visitor understands your core value proposition within 3 seconds.
          </p>
        </div>

        <div className="card p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-fg-muted">SEM Message-Match Alignment</span>
            <span className="text-sm font-semibold num text-fg">{analysis.croAudit.messageMatchScore}/100</span>
          </div>
          <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden">
            <div className="bg-fg-muted h-full rounded-full" style={{ width: `${analysis.croAudit.messageMatchScore}%` }} />
          </div>
          <p className="text-xs text-fg-subtle mt-3 leading-relaxed">
            Directly impacts Google Ads Quality Score and drops average Cost-Per-Click by up to 35%.
          </p>
        </div>

        <div className="card p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-fg-muted">Checkout / Signup Friction</span>
            <span className="text-sm font-semibold num text-fg">{analysis.croAudit.frictionScore}/100</span>
          </div>
          <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden">
            <div className="bg-fg-muted h-full rounded-full" style={{ width: `${analysis.croAudit.frictionScore}%` }} />
          </div>
          <p className="text-xs text-fg-subtle mt-3 leading-relaxed">
            Low friction score is optimal. Evaluates form fields, auth barriers, and demo booking steps.
          </p>
        </div>
      </div>

      {/* Side-by-Side: Current Landing Page Critique vs AI Optimized Hero Variant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recommended Hero Variant (7 cols) */}
        <div className="lg:col-span-7 card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-fg flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-fg-subtle" /> AI optimized hero section
            </span>
            <button
              onClick={() => {
                const text = `HEADLINE: ${currentVariant.head}\nSUBHEAD: ${currentVariant.sub}\nCTA: ${analysis.croAudit.recommendedCTA}`;
                handleCopy(text, 'hero-copy');
              }}
              className="btn btn-ghost btn-sm"
            >
              {copiedKey === 'hero-copy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'hero-copy' ? 'Copied' : 'Copy text'}</span>
            </button>
          </div>

          {/* Hero Preview Card */}
          <div className="inset p-8 text-center space-y-4">
            <span className="inline-block text-xs text-fg-muted num">
              Target conversion lift: <span className="text-pos font-medium">{currentVariant.lift}</span>
            </span>

            <h3 className="text-xl md:text-2xl font-semibold text-fg tracking-[-0.02em]">
              {currentVariant.head}
            </h3>

            <p className="text-sm text-fg-muted max-w-xl mx-auto leading-relaxed">
              {currentVariant.sub}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setIsLeadModalOpen(true)}
                className="btn btn-primary"
              >
                <span>{analysis.croAudit.recommendedCTA}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="btn btn-secondary bg-surface"
              >
                <Video className="w-4 h-4 text-fg-subtle" />
                <span>Watch 2-Min Interactive Demo</span>
              </button>
            </div>

            <div className="pt-2 text-xs text-fg-subtle flex flex-wrap items-center justify-center gap-4">
              <span>Instant setup</span>
              <span>SOC2 Type II Certified</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Actionable CRO Findings (5 cols) */}
        <div className="lg:col-span-5 card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-fg">High-Priority Conversion Bottlenecks</h3>
          <div className="divide-y divide-line max-h-96 overflow-y-auto pr-1">
            {analysis.croAudit.findings.map((item, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`tag capitalize ${
                    item.severity === 'high'
                      ? 'text-fg'
                      : ''
                  }`}>
                    {item.severity} Priority
                  </span>
                </div>
                <div className="text-fg leading-relaxed">
                  <span className="font-medium">Issue:</span> {item.issue}
                </div>
                <div className="text-fg-muted leading-relaxed">
                  <span className="font-medium text-fg">Agency Fix:</span> {item.solution}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Lead Flow Modal */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div className="card shadow-overlay p-6 max-w-md w-full relative">
            <button
              onClick={() => setIsLeadModalOpen(false)}
              className="absolute top-4 right-4 text-fg-subtle hover:text-fg hover:bg-surface-2 p-1 rounded-sm transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2 mb-6 pr-8">
              <h3 className="text-base font-semibold text-fg">
                Test High-Converting Lead Form
              </h3>
              <p className="text-sm text-fg-muted">
                Experience the 1-field friction-free signup flow designed for {analysis.domain}.
              </p>
            </div>

            {leadSubmitted ? (
              <div className="inset p-4 text-center text-sm text-fg font-medium space-y-1">
                <CheckCircle2 className="w-4 h-4 mx-auto mb-2 text-accent-fg" />
                <p>Lead Captured Successfully!</p>
                <span className="text-xs font-normal text-fg-muted">Redirecting to onboarding workspace...</span>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-fg-muted block mb-2">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="field h-9 px-3 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                >
                  Start Free 14-Day Enterprise Trial
                </button>
                <p className="text-xs text-center text-fg-subtle">
                  Instant activation • No credit card required • SOC-2 certified
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Interactive Demo Video Walkthrough Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div className="card shadow-overlay p-6 max-w-lg w-full relative space-y-4">
            <button
              onClick={() => setIsDemoModalOpen(false)}
              className="absolute top-4 right-4 text-fg-subtle hover:text-fg hover:bg-surface-2 p-1 rounded-sm transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-fg-subtle" />
              <h3 className="text-base font-semibold text-fg pr-8">
                Interactive Product Walkthrough ({analysis.domain})
              </h3>
            </div>

            <div className="aspect-video inset flex flex-col items-center justify-center p-6 text-center text-xs space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-fg">Interactive Interactive Tour Simulation</p>
                <p className="text-xs text-fg-muted mt-1 max-w-sm">
                  Demonstrating automatic schema deployment, high-intent Google Ads sync, and AI search citation tracking for {analysis.domain}.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-line">
              <button
                onClick={() => setIsDemoModalOpen(false)}
                className="btn btn-secondary"
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
