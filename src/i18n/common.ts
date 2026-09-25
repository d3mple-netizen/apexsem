import { defineDict } from './index';

/** Strings shared across components. Feature-specific text lives next to its component. */
export const common = defineDict(
  {
    estimate: 'Estimate',
    estimateHint: 'Modeled from the domain and niche, not measured. Treat it as an order of magnitude.',
    measured: 'Measured',
    measuredHint: 'Computed from the live homepage crawl.',
    sampleData: 'Sample data',
    sampleHint: 'Pre-built example report. Analyze your own domain for a live one.',
    perMonth: '/mo',
    searchesMo: 'searches/mo',
    visitsMo: 'visits/mo',
    copy: 'Copy',
    copied: 'Copied',
    close: 'Close'
  },
  {
    estimate: 'Оценка',
    estimateHint: 'Модель по домену и нише, а не замер. Смотри на порядок величины.',
    measured: 'Замер',
    measuredHint: 'Посчитано по живому скану главной страницы.',
    sampleData: 'Пример',
    sampleHint: 'Готовый демо-отчет. Проанализируй свой домен, чтобы получить живой.',
    perMonth: '/мес',
    searchesMo: 'запросов/мес',
    visitsMo: 'визитов/мес',
    copy: 'Скопировать',
    copied: 'Скопировано',
    close: 'Закрыть'
  }
);
