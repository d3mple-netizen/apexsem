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
      title: 'Type a domain, get an SEM strategy',
      lead: 'Keywords, ad copy, landing-page fixes and a 90-day plan',
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
        sample: (d: string) => `Sample report for ${d} - check your own domain`,
        crawlAi: (d: string) => `Live crawl of ${d}, strategy written by Claude.`,
        live: (d: string, crawled: boolean) =>
          crawled ? `Live crawl of ${d} plus live web research by Perplexity: niche, competitors and volume ranges.` : `Couldn’t crawl ${d}. Niche, competitors and volume ranges come from live web research by Perplexity.`,
        crawl: (d: string) => `Live crawl of ${d}. Keywords and copy built from the page’s own wording.`,
        ai: (d: string, reason: string) => `Couldn’t crawl ${d}${reason}. Strategy inferred by Claude from the domain.`,
        estimate: (d: string, reason: string) => `Couldn’t crawl ${d}${reason}. Showing a model based on the domain name only.`
      },
      modeledNote: 'Traffic, volume and CPC figures are estimates.',
      left: (n: number, of: number) => `${n} of ${of}`,
      leftHint: (n: number, of: number) => `${n} of ${of} free analyses left today`,
      freeNote: (n: number) => `Free: ${n} analyses a day`,
      anonCta: 'Sign in with Google',
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
      home: 'ApexSEM - к обзору',
      openDomain: 'Открыть сайт в новой вкладке',
      authorityPlan: 'Рост авторитета',
      viewAuthority: 'Открыть план роста авторитета',
      export: 'Экспорт',
      exportTitle: 'Скачать всю стратегию в Markdown',
      exportPlaybook: 'Скачать стратегию',
      askStrategist: 'Спросить стратега',
      toLight: 'Включить светлую тему',
      toDark: 'Включить темную тему',
      lightTheme: 'Светлая тема',
      darkTheme: 'Темная тема',
      language: 'Язык',
      upgrade: 'Перейти на Pro',
      proPlan: 'Тариф Pro',
      moreActions: 'Другие действия',
      signIn: 'Войти через Google',
      signInShort: 'Войти',
      signInAria: 'Войти через Google',
      account: 'Аккаунт',
      signedInAs: 'Вы вошли как',
      signOut: 'Выйти'
    },
    hero: {
      title: 'Введите домен - получите SEM-стратегию',
      lead: 'Ключи, объявления, правки лендинга и план на 90 дней',
      features: [
        {
          term: 'Читает ваш реальный сайт',
          detail: 'Сканируем главную: title, meta, заголовки, schema-разметку, CTA и скорость. Каждое замечание привязано к конкретному месту на странице.'
        },
        {
          term: 'Собирает кампании',
          detail: 'Коммерческие ключи с типами соответствия, три набора объявлений в лимитах Google 30/90 символов и список минус-слов.'
        },
        {
          term: 'Говорит, с чего начать',
          detail: 'План на 90 дней, отсортированный по эффекту и трудозатратам. И стратег, которого можно расспросить про любой пункт.'
        }
      ]
    },
    search: {
      yourDomain: 'Ваш домен',
      anotherTitle: 'Проверить другой домен',
      anotherLead: 'Найдите ключи с высоким интентом, перекройте слив бюджета и уберите все, что мешает конверсии.',
      inputAria: 'Домен для анализа',
      analyze: 'Проверить домен',
      analyzing: 'Проверяем…',
      tryOne: 'Попробуйте',
      steps: [
        'Загружаем главную…',
        'Читаем title, meta, заголовки и разметку…',
        'Ищем CTA, ссылки на цены и соцдоказательства…',
        'Вытаскиваем фразы, на которых держится страница…',
        'Собираем ключи, объявления и план на 90 дней…',
        'Все еще работаем. Медленные сайты грузятся до 30 секунд…'
      ],
      tags: { Productivity: 'Продуктивность', DevTools: 'DevTools', FinTech: 'Финтех', Analytics: 'Аналитика', 'Corporate Spend': 'Расходы компании' },
      source: {
        sample: (d: string) => `Демо-отчет для ${d} - проверьте свой домен`,
        crawlAi: (d: string) => `Свежий скан ${d}, стратегию написал Claude.`,
        live: (d: string, crawled: boolean) =>
          crawled ? `Свежий скан ${d} и живой поиск Perplexity: ниша, конкуренты и вилки частотности.` : `Не получилось просканировать ${d}. Ниша, конкуренты и вилки частотности - из живого поиска Perplexity.`,
        crawl: (d: string) => `Свежий скан ${d}. Ключи и тексты собраны из формулировок самой страницы.`,
        ai: (d: string, reason: string) => `Не получилось просканировать ${d}${reason}. Стратегию Claude собрал по домену.`,
        estimate: (d: string, reason: string) => `Не получилось просканировать ${d}${reason}. Это модель только по имени домена.`
      },
      modeledNote: 'Трафик, частотность и CPC - это оценки.',
      left: (n: number, of: number) => `${n} из ${of}`,
      leftHint: (n: number, of: number) => `На сегодня осталось ${n} из ${of} бесплатных анализов`,
      freeNote: (n: number) => `Бесплатно: ${n} анализа в день`,
      anonCta: 'Войти через Google',
      failed: 'Анализ не прошел. Проверьте адрес и попробуйте еще раз.'
    },
    plans: {
      close: 'Закрыть',
      limitTitle: 'На сегодня бесплатные анализы закончились',
      title: 'Тарифы',
      limitLead: (n: number) => `Free дает ${n} анализа в день, лимит сбрасывается в полночь. На Pro лимита нет.`,
      lead: 'Начните бесплатно. На Pro переходите, когда упретесь в дневной лимит.',
      free: 'Free',
      pro: 'Pro',
      perMonth: '/мес',
      usedToday: 'Сегодня',
      usedOf: (u: number, n: number) => `${u} из ${n}`,
      usedAria: (u: number, n: number) => `Сегодня использовано ${u} из ${n} анализов`,
      freeFeatures: (n: number) => [
        `${n} анализа в день со входом через Google`,
        'Скан главной и SEO-проверки',
        'Ключи, объявления и план на 90 дней',
        'Чат со стратегом, экспорт в Markdown и CSV'
      ],
      proFeatures: [
        'Анализы без лимита',
        'Приоритетный чат со стратегом в каждом отчете',
        'Созвон: вместе запустим первые кампании',
        'Ранний доступ к синку с Google Ads и алертам о пересканах'
      ],
      comeBack: 'Вернусь завтра',
      keepFree: 'Остаться на Free',
      cancelAnytime: 'Оплата помесячно, отменить можно в любой момент.',
      emailPro: 'Написать нам про Pro',
      mailBody: (d: string) => `Здравствуйте. Хочу подключить ApexSEM Pro.\n\nМой домен: ${d}\n`,
      manual: 'Пока доделываем онлайн-оплату, Pro подключаем вручную. Отвечаем в течение рабочего дня.'
    },
    gate: {
      title: 'Войдите через Google и запустите бесплатный анализ',
      lead: (d: string | null) =>
        d ? `Проверим ${d} сразу после входа. Без установки и без карты.` : 'Отчет начнет собираться сразу после входа. Без установки и без карты.',
      cta: 'Войти через Google',
      fine: (n: number) => `Бесплатно: ${n} анализа в день`,
      browse: 'Пока посмотрю демо-отчет',
      close: 'Закрыть'
    },
    toast: {
      live: (d: string) => `${d}: анализ по свежему скану готов`,
      liveWeb: (d: string) => `${d}: анализ с веб-поиском готов`,
      estimate: (d: string) => `Не получилось просканировать ${d} - показываем оценку`,
      planned: 'Правки по всем утечкам добавлены в план',
      downloaded: (f: string) => `Файл ${f} скачан`,
      authUnavailable: 'Вход через Google работает только на apexsem.vercel.app, в этом превью - нет.',
      authFailed: (m: string) => `Не получилось войти через Google: ${m}`,
      signedOut: 'Вы вышли из аккаунта'
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
      about: 'ApexSEM. SEM- и SEO-стратегия по вашей главной.',
      plans: (p: number) => `Free или Pro $${p}/мес`,
      disclaimer: 'Трафик, частотность и CPC - модельные оценки, а не данные Google Ads.'
    }
  }
);
