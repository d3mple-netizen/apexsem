import { defineDict } from '../index';

/** T1 organic tab: topical clusters, AI search readiness, backlinks, schema. */
export const organic = defineDict(
  {
    title: 'Organic authority',
    subtitle: 'Topic coverage, readiness for AI answers, links worth earning and entity markup.',
    tabs: { clusters: 'Topic clusters', geo: 'AI search', backlinks: 'Backlinks', schema: 'Schema' },
    tabsAria: 'Organic sections',

    clustersIntroTitle: 'Cover the whole topic, not single keywords',
    clustersIntro:
      'Google rewards sites that cover a topic end to end. A pillar page plus supporting pages, linked both ways, tells it your domain is the reference for the category.',
    pillarIntent: { 'Informational Pillar': 'Informational pillar', 'Commercial Pillar': 'Commercial pillar' } as Record<string, string>,
    targetKeyword: 'Target keyword',
    subtopics: 'Supporting pages',
    target: 'Target',
    difficulty: 'Difficulty',
    linking: 'Internal links',
    linkingValue: 'Pillar and pages link both ways',
    copyBrief: 'Copy brief',
    briefPillar: 'PILLAR',
    briefKeyword: 'Keyword',
    briefCluster: 'SUPPORTING PAGES',

    geoIntroTitle: 'Get quoted in AI answers',
    geoIntro: (niche: string) =>
      `Buyers now ask ChatGPT, Perplexity and Google AI Overviews for recommendations. Pages with direct answers, clear structure and schema are easier to quote when someone asks "What is the best ${niche}?"`,
    readinessTitle: 'AI citation readiness',
    readinessNote: 'Checked on your homepage. We did not query ChatGPT or Perplexity.',
    readinessUnavailable: 'Run a live analysis of your domain to check the homepage for these signals.',
    checks: {
      questionH2: 'Question-style H2 headings',
      questionH2Detail: (n: number, total: number) => (total ? `${n} of ${total} H2s end with "?"` : 'No H2 headings found'),
      schema: 'JSON-LD structured data',
      schemaDetail: (types: string) => (types ? types : 'None found'),
      org: 'Organization or brand entity schema',
      orgDetail: (ok: boolean) => (ok ? 'Present' : 'Missing'),
      depth: 'Enough text to quote',
      depthDetail: (words: string) => `${words} words on the homepage`,
      meta: 'Meta description as a ready-made summary',
      metaDetail: (ok: boolean) => (ok ? 'Present' : 'Missing')
    },
    pass: 'OK',
    fail: 'Fix',
    signalsTitle: 'Predicted visibility by platform',
    signalsNote: 'A model built from your site signals, not a live check of each assistant.',
    likelihood: 'Citation likelihood',
    action: 'What to do',

    backlinksIntroTitle: 'Links worth earning',
    backlinksIntro:
      'Generic guest posts rarely move rankings now. These plays earn links from high-authority publications, directories and partners. DR is a typical range for such sites, not a promise.',
    typicalDr: 'Typical DR',
    impact: 'Impact',
    effort: 'Effort',

    schemaTitle: 'JSON-LD for your brand entity',
    schemaIntro: (domain: string) => `Paste into the <head> of ${domain} so Google reads the brand as one entity.`,
    schemaFill: 'Replace every YOUR_... value before publishing. Add aggregateRating only if real reviews are visible on the page.',
    schemaFound: (types: string) => `Already on your homepage: ${types}`,
    download: 'Download .json',
    copySchema: 'Copy code'
  },
  {
    title: 'Органический авторитет',
    subtitle: 'Охват темы, готовность к ответам AI, ссылки, которые стоит добыть, и разметка сущности.',
    tabs: { clusters: 'Кластеры', geo: 'AI-поиск', backlinks: 'Ссылки', schema: 'Разметка' },
    tabsAria: 'Разделы органики',

    clustersIntroTitle: 'Закрывай тему целиком, а не отдельные ключи',
    clustersIntro:
      'Google выше ставит сайты, которые покрывают тему от и до. Опорная страница по теме и вспомогательные страницы со ссылками друг на друга показывают, что твой домен - эталон в категории.',
    pillarIntent: { 'Informational Pillar': 'Информационная опорная', 'Commercial Pillar': 'Коммерческая опорная' },
    targetKeyword: 'Главный ключ',
    subtopics: 'Вспомогательные страницы',
    target: 'Ключ',
    difficulty: 'Сложность',
    linking: 'Перелинковка',
    linkingValue: 'Опорная и вспомогательные ссылаются друг на друга',
    copyBrief: 'Скопировать бриф',
    briefPillar: 'ОПОРНАЯ',
    briefKeyword: 'Ключ',
    briefCluster: 'ВСПОМОГАТЕЛЬНЫЕ СТРАНИЦЫ',

    geoIntroTitle: 'Попади в ответы AI',
    geoIntro: (niche: string) =>
      `Покупатели все чаще спрашивают совета у ChatGPT, Perplexity и Google AI Overviews. Страницы с прямыми ответами, понятной структурой и разметкой проще процитировать, когда кто-то спрашивает "Что лучше выбрать: ${niche}?"`,
    readinessTitle: 'Готовность к цитированию AI',
    readinessNote: 'Проверено по главной странице. ChatGPT и Perplexity мы не опрашивали.',
    readinessUnavailable: 'Запусти живой анализ своего домена, чтобы проверить главную на эти сигналы.',
    checks: {
      questionH2: 'H2-заголовки в форме вопроса',
      questionH2Detail: (n: number, total: number) => (total ? `${n} из ${total} H2 заканчиваются на "?"` : 'H2-заголовков нет'),
      schema: 'Структурированные данные JSON-LD',
      schemaDetail: (types: string) => (types ? types : 'Не найдено'),
      org: 'Разметка Organization или бренда',
      orgDetail: (ok: boolean) => (ok ? 'Есть' : 'Нет'),
      depth: 'Достаточно текста для цитаты',
      depthDetail: (words: string) => `${words} слов на главной`,
      meta: 'Meta description как готовое резюме',
      metaDetail: (ok: boolean) => (ok ? 'Есть' : 'Нет')
    },
    pass: 'OK',
    fail: 'Исправить',
    signalsTitle: 'Прогноз видимости по платформам',
    signalsNote: 'Модель по сигналам сайта, а не живая проверка каждого ассистента.',
    likelihood: 'Шанс цитирования',
    action: 'Что сделать',

    backlinksIntroTitle: 'Ссылки, которые стоит добыть',
    backlinksIntro:
      'Обычные гостевые посты уже почти не двигают позиции. Эти ходы приносят ссылки с авторитетных изданий, каталогов и партнеров. DR - типичный уровень таких сайтов, а не обещание.',
    typicalDr: 'Типичный DR',
    impact: 'Отдача',
    effort: 'Сложность',

    schemaTitle: 'JSON-LD для сущности бренда',
    schemaIntro: (domain: string) => `Вставь в <head> на ${domain}, чтобы Google считывал бренд как одну сущность.`,
    schemaFill: 'Перед публикацией замени все значения YOUR_... Добавляй aggregateRating, только если на странице видны реальные отзывы.',
    schemaFound: (types: string) => `Уже есть на главной: ${types}`,
    download: 'Скачать .json',
    copySchema: 'Скопировать код'
  }
);
