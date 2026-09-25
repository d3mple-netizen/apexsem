import { defineDict } from '../index';

// App chrome: header, hero, domain bar, plans modal, toasts, footer.
export const shell = defineDict(
  {
    header: {
      home: 'ApexSEM, go to overview',
      openDomain: 'Open domain in new tab',
      authorityPlan: 'Authority plan',
      viewAuthority: 'View authority plan',
      export: 'Export',
      exportTitle: 'Download the full playbook as Markdown',
      exportPlaybook: 'Export playbook',
      askStrategist: 'Ask the strategist',
      toLight: 'Switch to light theme',
      toDark: 'Switch to dark theme',
      lightTheme: 'Light theme',
      darkTheme: 'Dark theme',
      language: 'Language',
      upgrade: 'Upgrade',
      proPlan: 'Pro plan',
      moreActions: 'More actions',
      signIn: 'Continue with Google',
      signInShort: 'Sign in',
      signInAria: 'Continue with Google',
      account: 'Account',
      signedInAs: 'Signed in as',
      signOut: 'Sign out'
    },
    hero: {
      title: 'Type a domain. Get a full SEM strategy in 30 seconds.',
      lead: 'Keywords, ad copy, landing-page fixes and a 90-day plan, built from what is actually on your homepage.',
      proof: 'Free with Google sign-in: 3 analyses a day, no card. The sample report below is open to everyone.',
      honesty: 'Every figure is either measured on your page or labeled as an estimate.',
      features: [
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
      ]
    },
    search: {
      yourDomain: 'Your domain',
      anotherTitle: 'Analyze another domain',
      anotherLead: 'Find high-intent keywords, cut wasted ad spend and fix what blocks conversions.',
      inputAria: 'Domain to analyze',
      analyze: 'Analyze domain',
      analyzing: 'Analyzing…',
      tryOne: 'Try one',
      steps: [
        'Fetching the homepage…',
        'Reading title, meta tags, headings and schema…',
        'Checking CTAs, pricing links and social proof…',
        'Extracting the phrases your page is built around…',
        'Drafting keywords, ad copy and the 90-day plan…',
        'Still working. Slow sites can take up to 30 seconds…'
      ],
      tags: { Productivity: 'Productivity', DevTools: 'DevTools', FinTech: 'FinTech', Analytics: 'Analytics', 'Corporate Spend': 'Corporate spend' } as Record<string, string>,
      source: {
        sample: (d: string) => `Sample report for ${d}. Run your own domain to get a live one.`,
        crawlAi: (d: string) => `Live crawl of ${d}, strategy written by Claude.`,
        live: (d: string, crawled: boolean) =>
          crawled ? `Live crawl of ${d} plus live web research by Perplexity: niche, competitors and volume ranges.` : `Couldn’t crawl ${d}. Niche, competitors and volume ranges come from live web research by Perplexity.`,
        crawl: (d: string) => `Live crawl of ${d}. Keywords and copy built from the page’s own wording.`,
        ai: (d: string, reason: string) => `Couldn’t crawl ${d}${reason}. Strategy inferred by Claude from the domain.`,
        estimate: (d: string, reason: string) => `Couldn’t crawl ${d}${reason}. Showing a model based on the domain name only.`
      },
      modeledNote: 'Traffic, volume and CPC figures are estimates.',
      left: (n: number, of: number) => `${n} of ${of} free analyses left today`,
      anonLeft: 'Analyses need an account. The sample is free to browse.',
      anonCta: 'Sign in with Google: 3 free a day',
      failed: 'Analysis failed. Check the domain and try again.'
    },
    plans: {
      close: 'Close',
      limitTitle: 'You’ve used today’s free analyses',
      title: 'Plans',
      limitLead: (n: number) => `Free covers ${n} analyses a day and resets at midnight. Pro removes the limit.`,
      lead: 'Start free. Upgrade when you run more domains than the daily limit allows.',
      free: 'Free',
      pro: 'Pro',
      perMonth: '/month',
      usedToday: 'Used today',
      usedOf: (u: number, n: number) => `${u} of ${n}`,
      usedAria: (u: number, n: number) => `${u} of ${n} analyses used today`,
      freeFeatures: (n: number) => [
        `${n} domain analyses per day with Google sign-in`,
        'Live homepage crawl and SEO checks',
        'Keywords, ad copy and 90-day roadmap',
        'Strategist chat and Markdown/CSV export'
      ],
      proFeatures: [
        'Unlimited domain analyses',
        'Priority strategist chat on every report',
        'Onboarding call to set up your first campaigns',
        'Early access to Google Ads sync and re-crawl alerts'
      ],
      comeBack: 'Come back tomorrow',
      keepFree: 'Keep using Free',
      cancelAnytime: 'Cancel anytime. Billed monthly.',
      emailPro: 'Email us to start Pro',
      mailBody: (d: string) => `Hi, I'd like ApexSEM Pro.\n\nMy domain: ${d}\n`,
      manual: 'Pro is activated by hand while we finish self-serve checkout. We reply within one business day.'
    },
    gate: {
      title: 'Sign in with Google to run your free analysis',
      lead: (d: string | null) =>
        d ? `We’ll analyze ${d} as soon as you’re back. Nothing to install, no card.` : 'Your report starts as soon as you’re back. Nothing to install, no card.',
      cta: 'Continue with Google',
      fine: (n: number) => `Free plan: ${n} analyses per day`,
      browse: 'Keep browsing the sample report',
      close: 'Close'
    },
    toast: {
      live: (d: string) => `Analyzed ${d} from a live crawl`,
      liveWeb: (d: string) => `Analyzed ${d} with live web research`,
      estimate: (d: string) => `Couldn’t crawl ${d}; showing an estimate`,
      planned: 'Fixes for all leaks added to your plan',
      downloaded: (f: string) => `Downloaded ${f}`,
      authUnavailable: 'Google sign-in works on apexsem.vercel.app. This preview can’t use it.',
      authFailed: (m: string) => `Google sign-in failed: ${m}`,
      signedOut: 'Signed out'
    },
    tabs: {
      aria: 'Report sections',
      overview: 'Overview',
      revenue: 'Revenue potential',
      traffic: 'Traffic radar',
      sem: 'Paid search',
      organic: 'Organic & AI search',
      cro: 'Landing page',
      roadmap: '90-day roadmap'
    },
    footer: {
      about: 'ApexSEM. SEM and SEO strategy from your homepage.',
      plans: (p: number) => `Free or Pro $${p}/mo`,
      disclaimer: 'Traffic, volume and CPC figures are modeled estimates, not Google Ads data.'
    }
  },
  {
    header: {
      home: 'ApexSEM, к обзору',
      openDomain: 'Открыть сайт в новой вкладке',
      authorityPlan: 'План авторитета',
      viewAuthority: 'Открыть план авторитета',
      export: 'Экспорт',
      exportTitle: 'Скачать весь план в Markdown',
      exportPlaybook: 'Скачать план',
      askStrategist: 'Спросить стратега',
      toLight: 'Включить светлую тему',
      toDark: 'Включить темную тему',
      lightTheme: 'Светлая тема',
      darkTheme: 'Темная тема',
      language: 'Язык',
      upgrade: 'Перейти на Pro',
      proPlan: 'Тариф Pro',
      moreActions: 'Еще',
      signIn: 'Войти через Google',
      signInShort: 'Войти',
      signInAria: 'Войти через Google',
      account: 'Аккаунт',
      signedInAs: 'Аккаунт',
      signOut: 'Выйти'
    },
    hero: {
      title: 'Введи домен - получи полную SEM-стратегию за 30 секунд.',
      lead: 'Ключевые слова, тексты объявлений, правки лендинга и план на 90 дней. Все собрано из того, что реально написано на твоей главной.',
      proof: 'Бесплатно со входом через Google: 3 анализа в день, без карты. Пример отчета ниже открыт всем.',
      honesty: 'Каждая цифра либо измерена на твоей странице, либо честно помечена как оценка.',
      features: [
        {
          term: 'Читает живой сайт',
          detail: 'Сканируем главную: title, мета-теги, заголовки, разметку, CTA и скорость. Каждая находка указывает на конкретное место на странице.'
        },
        {
          term: 'Пишет кампании',
          detail: 'Ключи с покупательским интентом и типами соответствия, три набора объявлений в лимитах Google 30/90 символов и список минус-слов.'
        },
        {
          term: 'Говорит, с чего начать',
          detail: 'План на 90 дней по влиянию и трудозатратам, плюс стратег, которого можно расспросить про любой пункт.'
        }
      ]
    },
    search: {
      yourDomain: 'Твой домен',
      anotherTitle: 'Проверить другой домен',
      anotherLead: 'Найди ключи с высоким интентом, срежь лишний рекламный бюджет и убери то, что мешает конверсии.',
      inputAria: 'Домен для анализа',
      analyze: 'Анализировать',
      analyzing: 'Анализируем…',
      tryOne: 'Попробуй',
      steps: [
        'Загружаем главную…',
        'Читаем title, мета-теги, заголовки и разметку…',
        'Проверяем CTA, ссылки на цены и соцдоказательства…',
        'Выделяем фразы, на которых построена страница…',
        'Собираем ключи, объявления и план на 90 дней…',
        'Еще работаем. Медленные сайты грузятся до 30 секунд…'
      ],
      tags: { Productivity: 'Продуктивность', DevTools: 'Инструменты разработчика', FinTech: 'Финтех', Analytics: 'Аналитика', 'Corporate Spend': 'Корпоративные расходы' },
      source: {
        sample: (d: string) => `Пример отчета для ${d}. Введи свой домен, чтобы получить живой.`,
        crawlAi: (d: string) => `Живой скан ${d}, стратегию написал Claude.`,
        live: (d: string, crawled: boolean) =>
          crawled ? `Живой скан ${d} и живой веб-поиск Perplexity: ниша, конкуренты и диапазоны частотности.` : `Не удалось просканировать ${d}. Ниша, конкуренты и частотности - из живого веб-поиска Perplexity.`,
        crawl: (d: string) => `Живой скан ${d}. Ключи и тексты собраны из формулировок самой страницы.`,
        ai: (d: string, reason: string) => `Не удалось просканировать ${d}${reason}. Стратегию Claude вывел по домену.`,
        estimate: (d: string, reason: string) => `Не удалось просканировать ${d}${reason}. Показываем модель только по имени домена.`
      },
      modeledNote: 'Трафик, частотность и CPC - это оценки.',
      left: (n: number, of: number) => `Осталось ${n} из ${of} бесплатных анализов на сегодня`,
      anonLeft: 'Для анализа нужен аккаунт. Пример отчета открыт всем.',
      anonCta: 'Войти через Google: 3 бесплатно в день',
      failed: 'Анализ не удался. Проверь домен и попробуй еще раз.'
    },
    plans: {
      close: 'Закрыть',
      limitTitle: 'Бесплатные анализы на сегодня закончились',
      title: 'Тарифы',
      limitLead: (n: number) => `На Free доступно ${n} анализа в день, счетчик обнуляется в полночь. На Pro лимита нет.`,
      lead: 'Начни бесплатно. Переходи на Pro, когда доменов станет больше дневного лимита.',
      free: 'Free',
      pro: 'Pro',
      perMonth: '/мес',
      usedToday: 'Сегодня',
      usedOf: (u: number, n: number) => `${u} из ${n}`,
      usedAria: (u: number, n: number) => `Сегодня использовано ${u} из ${n} анализов`,
      freeFeatures: (n: number) => [
        `${n} анализа доменов в день со входом через Google`,
        'Живой скан главной и SEO-проверки',
        'Ключи, объявления и план на 90 дней',
        'Чат со стратегом и экспорт в Markdown/CSV'
      ],
      proFeatures: [
        'Анализ доменов без лимита',
        'Приоритетный чат со стратегом в каждом отчете',
        'Созвон, на котором запустим первые кампании',
        'Ранний доступ к синку с Google Ads и алертам о пересканах'
      ],
      comeBack: 'Вернусь завтра',
      keepFree: 'Остаться на Free',
      cancelAnytime: 'Отмена в любой момент. Оплата помесячно.',
      emailPro: 'Написать нам про Pro',
      mailBody: (d: string) => `Привет! Хочу ApexSEM Pro.\n\nМой домен: ${d}\n`,
      manual: 'Пока мы доделываем самостоятельную оплату, Pro включаем вручную. Отвечаем в течение рабочего дня.'
    },
    gate: {
      title: 'Войди через Google, чтобы запустить бесплатный анализ',
      lead: (d: string | null) =>
        d ? `Проанализируем ${d} сразу после входа. Ничего устанавливать не нужно, карта не нужна.` : 'Отчет начнет собираться сразу после входа. Ничего устанавливать не нужно, карта не нужна.',
      cta: 'Войти через Google',
      fine: (n: number) => `Бесплатный план: ${n} анализа в день`,
      browse: 'Пока посмотреть пример отчета',
      close: 'Закрыть'
    },
    toast: {
      live: (d: string) => `${d} проанализирован по живому скану`,
      liveWeb: (d: string) => `${d} проанализирован с живым веб-поиском`,
      estimate: (d: string) => `Не удалось просканировать ${d}, показываем оценку`,
      planned: 'Исправления для всех утечек добавлены в план',
      downloaded: (f: string) => `Скачан ${f}`,
      authUnavailable: 'Вход через Google работает на apexsem.vercel.app. В этом превью он недоступен.',
      authFailed: (m: string) => `Не получилось войти через Google: ${m}`,
      signedOut: 'Выход выполнен'
    },
    tabs: {
      aria: 'Разделы отчета',
      overview: 'Обзор',
      revenue: 'Выручка',
      traffic: 'Радар трафика',
      sem: 'Реклама',
      organic: 'Органика и AI',
      cro: 'Лендинг',
      roadmap: 'План на 90 дней'
    },
    footer: {
      about: 'ApexSEM. SEM- и SEO-стратегия по твоей главной странице.',
      plans: (p: number) => `Free или Pro $${p}/мес`,
      disclaimer: 'Трафик, частотность и CPC - модельные оценки, а не данные Google Ads.'
    }
  }
);
