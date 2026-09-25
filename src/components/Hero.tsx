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
  <section aria-labelledby="hero-title" className="pt-12 pb-12 md:pt-24 md:pb-16 grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-end">
    <div>
      <h1
        id="hero-title"
        className="text-2xl md:text-4xl font-semibold text-fg [text-wrap:balance]"
      >
        Type a domain. Get a full SEM strategy in 30 seconds.
      </h1>
      <p className="mt-6 text-base text-fg-muted max-w-[34rem] [text-wrap:pretty]">
        Keywords, ad copy, landing-page fixes and a 90-day plan, built from what is actually on your homepage.
      </p>
      <p className="mt-4 text-sm text-fg-subtle">
        Built on the playbooks of $10M+ ad spend.
      </p>
    </div>

    <dl className="divide-y divide-line border-y border-line">
      {FEATURES.map((f) => (
        <div key={f.term} className="py-4 grid sm:grid-cols-[10.5rem_1fr] gap-x-6 gap-y-1">
          <dt className="text-sm font-medium text-fg">{f.term}</dt>
          <dd className="text-sm text-fg-muted">{f.detail}</dd>
        </div>
      ))}
    </dl>
  </section>
);
