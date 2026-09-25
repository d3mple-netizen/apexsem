import { defineDict } from '../index';

/** Strategist chat drawer chrome. Message bodies from the model are not translated. */
export const chat = defineDict(
  {
    title: 'ApexSEM strategist',
    domain: (d: string) => `Domain: ${d}`,
    greeting: (domain: string, score: string | null, keywords: number, findings: number) =>
      `I have the analysis for **${domain}** loaded: ${score ? `authority score ${score}, ` : ''}${keywords} keyword opportunities, ${findings} landing-page findings.\n\nAsk me for ad copy, a bidding plan, negative keywords, schema markup, or how to beat a specific competitor.`,
    cleared: (domain: string) => `Conversation cleared. Ask about paid search, organic authority or conversion for **${domain}**.`,
    justNow: 'Just now',
    clear: 'Clear conversation',
    closeDrawer: 'Close chat',
    engine: 'Engine:',
    ollama: 'Local Ollama',
    builtin: 'Built-in playbooks',
    builtinNoLlm: 'Built-in playbooks (no LLM connected)',
    builtinNote: 'Template answers in English',
    engineAria: 'Answer engine',
    thinking: 'Thinking...',
    writing: 'Writing answer...',
    snippet: { copy: 'Ad copy', keyword: 'Keywords', code: 'Code', roadmap: 'Plan' } as Record<'copy' | 'keyword' | 'code' | 'roadmap', string>,
    quickPrompts: 'Quick prompts',
    prompts: [
      'How do I lower CPC on competitor terms?',
      'Write 3 headline angles for enterprise buyers',
      'How do I get cited in ChatGPT Search and Perplexity?',
      'Show me JSON-LD schema for a software product'
    ],
    placeholder: (domain: string) => `Ask about ${domain}...`,
    inputAria: 'Message the strategist',
    send: 'Send message',
    error: 'The strategist could not answer. Check your connection and send the question again.',
    rateLimited: 'Too many messages. Wait a few minutes and try again.'
  },
  {
    title: 'Стратег ApexSEM',
    domain: (d: string) => `Домен: ${d}`,
    greeting: (domain: string, score: string | null, keywords: number, findings: number) =>
      `Анализ **${domain}** у меня: ${score ? `индекс авторитета ${score}, ` : ''}ключей с потенциалом - ${keywords}, замечаний по лендингу - ${findings}.\n\nСпрашивайте про объявления, ставки, минус-слова, разметку или о том, как обойти конкретного конкурента.`,
    cleared: (domain: string) => `Чат очищен. Спрашивайте про рекламу, органику или конверсию для **${domain}**.`,
    justNow: 'Только что',
    clear: 'Очистить чат',
    closeDrawer: 'Закрыть чат',
    engine: 'Движок:',
    ollama: 'Локальная Ollama',
    builtin: 'Встроенные шаблоны',
    builtinNoLlm: 'Встроенные шаблоны (LLM не подключена)',
    builtinNote: 'Шаблоны отвечают на английском',
    engineAria: 'Движок ответов',
    thinking: 'Думаю...',
    writing: 'Пишу ответ...',
    snippet: { copy: 'Объявление', keyword: 'Ключи', code: 'Код', roadmap: 'План' },
    quickPrompts: 'Быстрые вопросы',
    prompts: [
      'Как снизить CPC по запросам конкурентов?',
      'Нужны 3 заголовка для enterprise-клиентов',
      'Как попасть в ответы ChatGPT и Perplexity?',
      'Нужна JSON-LD разметка для SaaS-продукта'
    ],
    placeholder: (_domain: string) => 'Спросите про ключи, объявления или план...',
    inputAria: 'Сообщение стратегу',
    send: 'Отправить',
    error: 'Стратег не смог ответить. Проверьте соединение и отправьте вопрос еще раз.',
    rateLimited: 'Слишком много сообщений. Подождите пару минут и попробуйте снова.'
  }
);
