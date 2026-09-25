import { defineDict } from '../index';

/** OverviewScorecard strings. */
export const overview = defineDict(
  {
    audience: 'Audience:',
    reportFor: 'Report for',
    launchSem: 'Launch SEM campaigns',
    viewT1Plan: 'View T1 authority plan',
    authorityIndex: 'T1 authority index',
    outOf100: 'out of 100',
    currentStatus: 'Current status',
    verdict: {
      high: 'High authority presence. Ready for aggressive competitor conquest and automated bidding at scale.',
      mid: 'Strong challenger domain. Needs negative keyword shielding and complete topic clusters to reach Tier 1.',
      low: 'Emerging domain. Prioritize high-intent search ads while adding schema markup and foundational backlinks.'
    },
    vectorsTitle: 'Core SEM and search authority vectors',
    fromCrawl: 'From homepage crawl',
    vectors: {
      technicalHealth: 'Technical crawlability and indexing',
      semReadiness: 'SEM architecture and conversion readiness',
      topicalAuthority: 'Topical authority',
      aiSearchVisibility: 'AI search visibility (ChatGPT, Perplexity, AI Overviews)',
      highIntentCoverage: 'High-intent and competitor keyword coverage'
    },
    nextTarget: 'Next target:',
    nextTargetValue: 'Tier 1 (score 80+)',
    viewRoadmap: 'View 30-60-90 day roadmap',
    paidValue: 'Monthly traffic value',
    paidValueHint: 'What this traffic would cost you in ads',
    pipeline: 'Potential monthly pipeline',
    pipelineHint: 'Rough value if you reach the target traffic',
    targetTraffic: 'Target traffic ceiling',
    current: 'Current:',
    wasted: 'Preventable wasted spend',
    wastedHint: 'Irrelevant clicks the negative list would block',
    competitorsTitle: 'Competitor search landscape',
    competitorsSub: 'Where competitors likely spend budget and where you can intercept demand.',
    share: 'share',
    paidSpend: 'Est. paid spend/mo',
    topKeywords: 'Top paid keywords',
    weakSpots: 'Weak spots'
  },
  {
    audience: 'Аудитория:',
    reportFor: 'Отчет по',
    launchSem: 'Запустить рекламу',
    viewT1Plan: 'План роста авторитета',
    authorityIndex: 'Индекс авторитета',
    outOf100: 'из 100',
    currentStatus: 'Текущий уровень',
    verdict: {
      high: 'Сильный домен. Можно агрессивно перехватывать трафик конкурентов и масштабировать автостратегии.',
      mid: 'Крепкий претендент. Чтобы выйти на уровень 1, нужны минус-слова и закрытые тематические кластеры.',
      low: 'Молодой домен. Начни с рекламы по горячим запросам, параллельно добавь schema-разметку и базовые ссылки.'
    },
    vectorsTitle: 'Ключевые показатели рекламы и поиска',
    fromCrawl: 'По скану главной',
    vectors: {
      technicalHealth: 'Техническое здоровье и индексация',
      semReadiness: 'Готовность к контекстной рекламе',
      topicalAuthority: 'Тематический авторитет',
      aiSearchVisibility: 'Видимость в AI-поиске (ChatGPT, Perplexity)',
      highIntentCoverage: 'Охват горячих и конкурентных запросов'
    },
    nextTarget: 'Цель:',
    nextTargetValue: 'уровень 1 (от 80 баллов)',
    viewRoadmap: 'План на 90 дней',
    paidValue: 'Стоимость трафика в месяц',
    paidValueHint: 'Сколько стоил бы этот трафик в рекламе',
    pipeline: 'Потенциал продаж в месяц',
    pipelineHint: 'Грубая оценка, если выйдешь на целевой трафик',
    targetTraffic: 'Потолок трафика',
    current: 'Сейчас:',
    wasted: 'Слив бюджета, который можно остановить',
    wastedHint: 'Нецелевые клики, которые отсечет список минус-слов',
    competitorsTitle: 'Конкуренты в поиске',
    competitorsSub: 'Куда конкуренты, скорее всего, вкладывают бюджет и где можно перехватить спрос.',
    share: 'доля',
    paidSpend: 'Реклама в месяц',
    topKeywords: 'Главные рекламные запросы',
    weakSpots: 'Слабые места'
  }
);
