import React from 'react';
import { useDict } from '../i18n';
import { shell } from '../i18n/dict/shell';

export const Hero: React.FC = () => {
  const t = useDict(shell).hero;
  return (
    <section aria-labelledby="hero-title" className="pt-8 pb-8 md:pt-24 md:pb-16 grid lg:grid-cols-[1.15fr_1fr] gap-8 md:gap-12 lg:gap-16 items-end">
      <div>
        <h1
          id="hero-title"
          className="text-2xl md:text-4xl font-semibold text-fg [text-wrap:balance]"
        >
          {t.title}
        </h1>
        <p className="mt-4 md:mt-5 text-base text-fg-muted max-w-[34rem] [text-wrap:pretty]">{t.lead}</p>
      </div>

      <dl className="divide-y divide-line border-y border-line">
        {t.features.map((f) => (
          <div key={f.term} className="py-4 grid sm:grid-cols-[10.5rem_1fr] gap-x-6 gap-y-1">
            <dt className="text-sm font-medium text-fg">{f.term}</dt>
            <dd className="text-sm text-fg-muted">{f.detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
