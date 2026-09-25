import { defineDict } from '../index';

export const trafficDict = defineDict(
  {
    title: 'Search share vs. competitors',
    subtitle:
      'A rough model of how high-intent searches split between you and your top competitors, the queries you are losing and what to do about each.',
    planAll: 'Mark all as planned',
    allPlanned: 'All in your plan',
    planWithPro: (price: number) => `Plan fixes with Pro ($${price}/mo)`,
    plannedTitle: (n: number) => `${n} fixes added to your plan`,
    plannedBody:
      'Nothing is changed on your site or ad accounts. Ship the fixes below, then re-run the analysis to see where you stand.',
    splitTitle: 'How high-intent searches split',
    splitBody: (domain: string) => `Modeled share of searchers landing on ${domain} vs. competitors.`,
    totalMarket: 'Market',
    yourShare: 'Your share',
    you: 'you',
    lostTraffic: 'Going to competitors',
    lostTrafficHint: 'Visits a month that land on rivals',
    lostValue: 'Value of those clicks',
    lostValueHint: 'Rough, based on niche CPC',
    fixPlan: 'Fix plan',
    fixPlanHint: 'Queries with a planned fix',
    queriesTitle: 'Queries you are losing',
    queriesBody: 'High-intent queries where a competitor gets the click, why, and the fix to plan.',
    takenBy: 'Taken by',
    lostVisits: 'Lost visits',
    lostValueShort: 'Value',
    planned: 'Planned',
    leaking: 'Competitor ahead',
    why: 'Why they get the click',
    fix: 'Suggested fix',
    ctaKicker: 'ApexSEM Pro',
    ctaTitle: 'Want a hand shipping these fixes?',
    ctaBody: (price: number) =>
      `Pro is $${price}/month: unlimited analyses, priority strategist chat and an onboarding call where we set up your first campaigns together. We do not touch your accounts without you.`,
    ctaButton: 'See Pro'
  },
  {
    title: 'Доля поиска против конкурентов',
    subtitle:
      'Примерная модель: как горячие запросы делятся между тобой и главными конкурентами, какие запросы ты теряешь и что с каждым делать.',
    planAll: 'Добавить все в план',
    allPlanned: 'Все в плане',
    planWithPro: (price: number) => `План правок в Pro ($${price}/мес)`,
    plannedTitle: (n: number) => `В план добавлено правок: ${n}`,
    plannedBody:
      'На сайте и в рекламных кабинетах ничего не меняется. Внедри правки ниже и перезапусти анализ, чтобы увидеть результат.',
    splitTitle: 'Как делятся горячие запросы',
    splitBody: (domain: string) => `Модельная доля посетителей ${domain} против конкурентов.`,
    totalMarket: 'Рынок',
    yourShare: 'Твоя доля',
    you: 'ты',
    lostTraffic: 'Уходит конкурентам',
    lostTrafficHint: 'Визитов в месяц достаются другим',
    lostValue: 'Стоимость этих кликов',
    lostValueHint: 'Грубо, по CPC ниши',
    fixPlan: 'План правок',
    fixPlanHint: 'Запросов с запланированной правкой',
    queriesTitle: 'Запросы, которые ты теряешь',
    queriesBody: 'Горячие запросы, где клик забирает конкурент, почему так и какую правку запланировать.',
    takenBy: 'Забирает',
    lostVisits: 'Потеря',
    lostValueShort: 'Стоимость',
    planned: 'В плане',
    leaking: 'Конкурент впереди',
    why: 'Почему клик у них',
    fix: 'Как исправить',
    ctaKicker: 'ApexSEM Pro',
    ctaTitle: 'Нужна помощь с внедрением?',
    ctaBody: (price: number) =>
      `Pro стоит $${price} в месяц: анализы без лимита, приоритетный чат со стратегом и созвон, на котором вместе настроим первые кампании. В твои кабинеты без тебя не лезем.`,
    ctaButton: 'Смотреть Pro'
  }
);
