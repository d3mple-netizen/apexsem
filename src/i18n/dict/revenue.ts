import { defineDict } from '../index';

/**
 * RevenueTrafficForecaster strings. `summary` returns alternating plain /
 * emphasized segments (odd indices render bold) so word order can differ per language.
 */
export const revenue = defineDict(
  {
    title: 'Traffic and revenue projection',
    subtitle: 'A what-if model: set your deal size and funnel rates. Search demand for',
    subtitleTail: 'is modeled, so read the outputs as rough projections, not a forecast.',
    exportCsv: 'Export model (CSV)',
    scenarioTitle: 'Growth scenario',
    scenarioTabs: { conservative: 'Conservative', expected: 'Expected', monopoly: 'Aggressive' },
    scenarios: {
      conservative: { name: 'Conservative (paid search only)', desc: 'Bottom-of-funnel Google Ads on terms with clear buying intent.' },
      expected: { name: 'Expected (paid + organic)', desc: 'Paid search, two organic topic clusters and competitor conquest.' },
      monopoly: { name: 'Aggressive (full search coverage)', desc: 'Top positions across Google Ads, organic results and AI answers.' }
    },
    captureAssumption: (pct: number, demand: string) =>
      `Assumes you capture ${pct}% of modeled niche demand (${demand} searches/mo).`,
    acv: 'Average contract value (ACV)',
    perYear: '/yr',
    acvTicks: ['$2k self-serve', '$24k mid-market', '$60k enterprise'],
    cvr: 'Visitor-to-lead rate',
    cvrTicks: ['1.5% low', '4.2% typical', '8% strong CRO'],
    close: 'SQL to closed-won rate',
    closeTicks: ['8% low', '18% typical', '35% high'],
    assumptions: (cpc: string) =>
      `Fixed assumptions: 52% of leads become SQLs, 28% of visits are paid clicks at ${cpc} CPC (estimate), 3-year customer lifetime, 85% gross margin.`,
    arr: 'New ARR per year',
    arrSub: 'new ARR per month',
    traffic: 'Target monthly traffic',
    trafficSub: 'new visits/mo',
    deals: 'Closed-won deals',
    customersMo: 'customers/mo',
    dealsFrom: 'From',
    dealsFromTail: 'sales-qualified leads/mo',
    ltvCac: 'LTV : CAC',
    payback: 'Payback',
    months: 'mo',
    ltv: 'LTV',
    channelsTitle: 'Projection by channel',
    channelsSub: 'An illustrative split of the projection above. Channel shares and conversion rates are assumptions, not measured data.',
    th: {
      channel: 'Channel',
      mechanism: 'Mechanism',
      share: 'Share',
      visits: 'Visits/mo',
      leads: 'Leads',
      deals: 'Deals/mo',
      arr: 'ARR/yr'
    },
    channels: {
      sem: { name: 'High-intent Google Ads', type: 'Paid search' },
      conquest: { name: 'Competitor conquest', type: 'Paid + comparison pages' },
      organic: { name: 'Organic topic clusters', type: 'Organic search (SEO)' },
      geo: { name: 'AI search visibility', type: 'ChatGPT, Perplexity citations' }
    },
    cvrShort: 'CVR',
    summaryTitle: 'Summary for',
    summary: (acv: string, demand: string, visits: string, arr: string, ratio: string) => [
      'At an average contract value of ',
      `${acv}/yr`,
      ' and modeled niche demand of ',
      `${demand} searches/mo`,
      ', this scenario projects about ',
      `+${visits} extra visits/mo`,
      ' and ',
      `${arr} in new annual revenue`,
      ' at roughly ',
      `${ratio} LTV:CAC`,
      '. It is a projection from your inputs, not a promise.'
    ],
    csv: {
      scenario: 'Scenario',
      acv: 'ACV ($)',
      demand: 'Modeled niche searches/mo (estimate)',
      visitors: 'Target visitors/mo',
      netNew: 'Net new visitors/mo',
      leads: 'Leads/mo',
      sqls: 'SQLs/mo',
      deals: 'Closed-won deals/mo',
      monthlyArr: 'New ARR per month ($)',
      annualArr: 'New ARR per year ($)',
      cac: 'Estimated CAC ($)',
      ltv: 'LTV ($)',
      ratio: 'LTV:CAC',
      payback: 'Payback (months)',
      file: 'Revenue-Traffic-Model'
    }
  },
  {
    title: 'Прогноз трафика и выручки',
    subtitle: 'Модель "что если": задайте средний чек и конверсии воронки. Спрос в поиске для',
    subtitleTail: 'смоделирован, поэтому результат - грубая прикидка, а не прогноз.',
    exportCsv: 'Скачать CSV',
    scenarioTitle: 'Сценарий роста',
    scenarioTabs: { conservative: 'Осторожный', expected: 'Базовый', monopoly: 'Агрессивный' },
    scenarios: {
      conservative: { name: 'Осторожный (только реклама)', desc: 'Google Ads по горячим запросам с явным намерением купить.' },
      expected: { name: 'Базовый (реклама + SEO)', desc: 'Контекстная реклама, два тематических кластера в органике и перехват конкурентов.' },
      monopoly: { name: 'Агрессивный (весь поиск)', desc: 'Топ в Google Ads, в органической выдаче и в ответах AI.' }
    },
    captureAssumption: (pct: number, demand: string) =>
      `Считаем, что вы забираете ${pct}% смоделированного спроса в нише (${demand} запросов/мес).`,
    acv: 'Средний чек в год (ACV)',
    perYear: '/год',
    acvTicks: ['$2k малый бизнес', '$24k средний', '$60k enterprise'],
    cvr: 'Конверсия в лид',
    cvrTicks: ['1.5% низкая', '4.2% средняя', '8% после CRO'],
    close: 'Конверсия SQL в сделку',
    closeTicks: ['8% низкая', '18% средняя', '35% высокая'],
    assumptions: (cpc: string) =>
      `Зашитые допущения: 52% лидов становятся SQL, 28% визитов - платные клики по ${cpc} (оценка), клиент живет 3 года, валовая маржа 85%.`,
    arr: 'Новый ARR за год',
    arrSub: 'нового ARR в месяц',
    traffic: 'Целевой трафик',
    trafficSub: 'новых визитов/мес',
    deals: 'Закрытые сделки',
    customersMo: 'клиентов/мес',
    dealsFrom: 'Из',
    dealsFromTail: 'квалифицированных лидов/мес',
    ltvCac: 'LTV : CAC',
    payback: 'Окупаемость',
    months: 'мес',
    ltv: 'LTV',
    channelsTitle: 'Прогноз по каналам',
    channelsSub: 'Условная разбивка прогноза выше. Доли каналов и конверсии - допущения, а не замеры.',
    th: {
      channel: 'Канал',
      mechanism: 'Механика',
      share: 'Доля',
      visits: 'Визиты/мес',
      leads: 'Лиды',
      deals: 'Сделки/мес',
      arr: 'ARR/год'
    },
    channels: {
      sem: { name: 'Реклама по горячим запросам', type: 'Контекстная реклама' },
      conquest: { name: 'Перехват у конкурентов', type: 'Реклама + страницы сравнения' },
      organic: { name: 'Тематические кластеры', type: 'Органика (SEO)' },
      geo: { name: 'Видимость в AI-поиске', type: 'Цитаты в ChatGPT, Perplexity' }
    },
    cvrShort: 'CR',
    summaryTitle: 'Итог по',
    summary: (acv: string, demand: string, visits: string, arr: string, ratio: string) => [
      'При среднем чеке ',
      `${acv}/год`,
      ' и смоделированном спросе в нише ',
      `${demand} запросов/мес`,
      ' этот сценарий дает ',
      `+${visits} визитов/мес`,
      ' и ',
      `${arr} новой выручки в год`,
      ' при LTV:CAC около ',
      ratio,
      '. Это прикидка по вашим вводным, а не обещание.'
    ],
    csv: {
      scenario: 'Сценарий',
      acv: 'ACV ($)',
      demand: 'Спрос в нише, запросов/мес (оценка)',
      visitors: 'Целевой трафик/мес',
      netNew: 'Новые визиты/мес',
      leads: 'Лиды/мес',
      sqls: 'SQL/мес',
      deals: 'Сделки/мес',
      monthlyArr: 'Новый ARR в месяц ($)',
      annualArr: 'Новый ARR в год ($)',
      cac: 'CAC, оценка ($)',
      ltv: 'LTV ($)',
      ratio: 'LTV:CAC',
      payback: 'Окупаемость (мес)',
      file: 'Model-trafika-i-vyruchki'
    }
  }
);
