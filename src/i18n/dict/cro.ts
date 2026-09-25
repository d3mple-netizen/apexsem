import { defineDict } from '../index';

export const croDict = defineDict(
  {
    title: 'Landing page and conversion',
    subtitle: 'Paid clicks only pay off if the page converts. Here is how well it matches the ads, how clear it is, and where people drop off.',

    headlineScore: 'Headline clarity',
    headlineHint: 'Checks for a single H1 and whether it is short enough to read at a glance.',
    matchScore: 'Ad-to-page match',
    matchHint: 'How well the page backs up what the ads promise. Feeds into Google Ads Quality Score, which affects your CPC.',
    frictionScore: 'Signup friction',
    frictionHint: 'Lower is better. Counts form fields and high-priority blockers on the way to signup.',

    heroTitle: 'Suggested hero',
    copyText: 'Copy text',
    copied: 'Copied',
    clipHeadline: 'HEADLINE',
    clipSubhead: 'SUBHEAD',
    clipCta: 'CTA',

    findingsTitle: 'Conversion blockers',
    priority: (level: string) => `${level} priority`,
    issue: 'Issue:',
    fix: 'Fix:',
    noFindings: 'No major blockers found on the homepage.',

    formTitle: 'One-field form preview',
    formBody: (domain: string) => `A sketch of a single-field signup for ${domain}. Nothing is sent anywhere.`,
    workEmail: 'Work email',
    formNote: 'One field, no password, no card. Ask for the rest after signup.',
    previewDone: 'That is the whole flow',
    previewDoneHint: 'Preview only, nothing was sent.'
  },
  {
    title: 'Лендинг и конверсия',
    subtitle: 'Платный клик окупается, только если страница конвертит. Смотрим, насколько она совпадает с объявлениями, понятна ли и где люди отваливаются.',

    headlineScore: 'Понятность заголовка',
    headlineHint: 'Проверяем, что H1 один и что его можно прочитать с одного взгляда.',
    matchScore: 'Совпадение с объявлением',
    matchHint: 'Насколько страница подтверждает то, что обещает реклама. Влияет на Quality Score в Google Ads, а значит и на CPC.',
    frictionScore: 'Трение при регистрации',
    frictionHint: 'Чем ниже, тем лучше. Считаем поля формы и серьезные барьеры на пути к регистрации.',

    heroTitle: 'Предлагаемый первый экран',
    copyText: 'Скопировать',
    copied: 'Скопировано',
    clipHeadline: 'ЗАГОЛОВОК',
    clipSubhead: 'ПОДЗАГОЛОВОК',
    clipCta: 'КНОПКА',

    findingsTitle: 'Что мешает конверсии',
    priority: (level: string) => `${level} приоритет`,
    issue: 'Проблема:',
    fix: 'Решение:',
    noFindings: 'Серьезных барьеров на главной не нашли.',

    formTitle: 'Превью формы в одно поле',
    formBody: (domain: string) => `Набросок регистрации в одно поле для ${domain}. Никуда ничего не отправляется.`,
    workEmail: 'Рабочий email',
    formNote: 'Одно поле, без пароля и карты. Остальное спроси после регистрации.',
    previewDone: 'Вот и весь сценарий',
    previewDoneHint: 'Это превью, ничего не отправлено.'
  }
);
