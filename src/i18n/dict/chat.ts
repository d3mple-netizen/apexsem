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
      `Анализ **${domain}** загружен: ${score ? `индекс авторитета ${score}, ` : ''}ключей с потенциалом - ${keywords}, замечаний по лендингу - ${findings}.\n\nСпроси про объявления, ставки, минус-слова, разметку или как обойти конкретного конкурента.`,
    cleared: (domain: string) => `Чат очищен. Спрашивай про рекламу, органику или конверсию для **${domain}**.`,
    justNow: 'Только что',
    clear: 'Очистить чат',
    closeDrawer: 'Закрыть чат',
    engine: 'Движок:',
    ollama: 'Локальная Ollama',
    builtin: 'Встроенные сценарии',
    builtinNoLlm: 'Встроенные сценарии (LLM не подключена)',
    builtinNote: 'Шаблонные ответы на английском',
    engineAria: 'Движок ответов',
    thinking: 'Думаю...',
    writing: 'Пишу ответ...',
    snippet: { copy: 'Текст объявления', keyword: 'Ключи', code: 'Код', roadmap: 'План' },
    quickPrompts: 'Быстрые вопросы',
    prompts: [
      'Как снизить CPC на запросах конкурентов?',
      'Дай 3 идеи заголовков для enterprise-клиентов',
      'Как попасть в ответы ChatGPT и Perplexity?',
      'Покажи JSON-LD разметку для софта'
    ],
    placeholder: (_domain: string) => 'Спроси про ключи, объявления или план...',
    inputAria: 'Сообщение стратегу',
    send: 'Отправить',
    error: 'Стратег не смог ответить. Проверь соединение и отправь вопрос еще раз.',
    rateLimited: 'Слишком много сообщений. Подожди пару минут и попробуй снова.'
  }
);
