import React from 'react';

const FEATURES = [
  {
    term: 'Reads your real site',
    detail: 'We crawl your homepage and check title, meta, headings, schema, CTAs and speed. Every finding points at something on the page.'
  },
  {
    term: 'Writes the campaigns',
    detail: 'Buyer-intent keywords with match types, three ad sets within Google’s 30/90-character limits, and a negative keyword list.'
  },
  {
    term: 'Ranks what to do first',
    detail: 'A 90-day plan ordered by impact and effort, plus a strategist you can question about any line of it.'
  }
];

export const Hero: React.FC = () => (
  <section aria-labelledby="hero-title" className="pt-6 pb-10 md:pt-12 md:pb-14 grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-end">
    <div>
      <h1
        id="hero-title"
        className="text-[2.5rem] leading-[1.05] md:text-[3.5rem] font-extrabold tracking-[-0.035em] text-slate-900 dark:text-white [text-wrap:balance]"
      >
        Type a domain. Get a full SEM strategy in 30 seconds.
      </h1>
      <p className="mt-5 text-base md:text-lg leading-relaxed text-slate-600 dark:text-slate-400 max-w-[34rem] [text-wrap:pretty]">
        Keywords, ad copy, landing-page fixes and a 90-day plan, built from what is actually on your homepage.
      </p>
      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        Built on the playbooks of $10M+ ad spend.
      </p>
    </div>

    <dl className="divide-y divide-slate-200 dark:divide-slate-800/80 border-y border-slate-200 dark:border-slate-800/80">
      {FEATURES.map((f) => (
        <div key={f.term} className="py-4 grid sm:grid-cols-[10.5rem_1fr] gap-x-6 gap-y-1">
          <dt className="text-sm font-semibold text-slate-900 dark:text-slate-100">{f.term}</dt>
          <dd className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.detail}</dd>
        </div>
      ))}
    </dl>
  </section>
);
