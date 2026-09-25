import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, Copy, Check, Trash2, Cpu } from 'lucide-react';
import { DomainAnalysis } from '../types';
import { ChatMessage } from '../services/aiAgency';
import { checkLocalLlm, queryLocalLlmStream, LocalLlmStatus, LlmProvider } from '../services/localLlm';
import { useDict, useI18n } from '../i18n';
import { chat } from '../i18n/dict/chat';
import { common } from '../i18n/common';
import { isMeasured } from '../lib/honest';

/** Renders **bold** and `code` spans; everything else stays plain text. */
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`\n]+`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={i} className="font-semibold text-fg">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={i} className="font-mono text-xs px-1 rounded-sm bg-surface-2">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

interface AgencyChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: DomainAnalysis;
}

export const AgencyChatDrawer: React.FC<AgencyChatDrawerProps> = ({
  isOpen,
  onClose,
  analysis
}) => {
  const t = useDict(chat);
  const c = useDict(common);
  const { lang } = useI18n();
  const locale = lang === 'ru' ? 'ru-RU' : 'en-US';
  const now = () => new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

  // Greeting and "cleared" notes are chrome, rendered from the dictionary at
  // display time (ids init-hello / init-cleared-*) so they follow the language.
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init-hello', sender: 'ai', text: ' ', timestamp: '' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  // Local LLM State
  const [llmStatus, setLlmStatus] = useState<LocalLlmStatus>({
    isAvailable: false,
    models: ['Built-in SEM playbooks'],
    activeModel: 'Built-in SEM playbooks',
    provider: 'builtin'
  });
  const [selectedProvider, setSelectedProvider] = useState<LlmProvider>('builtin');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check Ollama status on mount
  useEffect(() => {
    checkLocalLlm().then((status) => {
      setLlmStatus(status);
      setSelectedProvider(status.provider);
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: now()
    };

    // Conversation so far (minus the canned greeting) plus the new question.
    const history = [...messages, userMsg]
      .filter((m) => m.text.trim() && !m.id.startsWith('init-'))
      .map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.actionSnippet ? `${m.text}\n\n\`\`\`\n${m.actionSnippet.content}\n\`\`\`` : m.text
      }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const aiMsgId = `ai-${Date.now()}`;
    // Temporary empty streaming AI message
    setMessages((prev) => [
      ...prev,
      {
        id: aiMsgId,
        sender: 'ai',
        text: '',
        timestamp: now()
      }
    ]);

    try {
      let accumulatedText = '';
      const result = await queryLocalLlmStream(
        history,
        analysis,
        selectedProvider,
        llmStatus.activeModel,
        (token) => {
          accumulatedText += token;
          setMessages((prev) =>
            prev.map((msg) => (msg.id === aiMsgId ? { ...msg, text: accumulatedText } : msg))
          );
        }
      );

      // Final update with action snippet
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? {
                ...msg,
                text: result.rateLimited ? t.rateLimited : result.fullText || accumulatedText,
                actionSnippet: result.actionSnippet
              }
            : msg
        )
      );
    } catch (err) {
      console.error('Error generating AI answer:', err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? { ...msg, text: t.error }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopySnippet = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([{ id: `init-cleared-${Date.now()}`, sender: 'ai', text: ' ', timestamp: now() }]);
  };

  const measured = isMeasured(analysis);
  const chromeText = (msg: ChatMessage): string => {
    if (msg.id === 'init-hello') {
      return t.greeting(
        analysis.domain,
        measured ? `${analysis.score.overall}/100` : null,
        analysis.keywords.length,
        analysis.croAudit.findings.length
      );
    }
    if (msg.id.startsWith('init-cleared')) return t.cleared(analysis.domain);
    return msg.text;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end bg-black/50 anim-fade"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.title}
        className="w-full sm:max-w-lg bg-surface border-t sm:border-t-0 sm:border-l border-line h-[calc(100dvh-8px)] sm:h-full rounded-t-[14px] sm:rounded-none flex flex-col shadow-overlay anim-sheet overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="pl-4 pr-2 sm:px-5 py-2 sm:py-4 border-b border-line flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded bg-surface-2 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-fg-subtle" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-fg truncate">{t.title}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              </div>
              <p className="text-xs text-fg-subtle font-mono truncate">{t.domain(analysis.domain)}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleClearChat}
              className="btn btn-ghost btn-sm w-11 h-11 sm:w-auto sm:h-8 px-0 sm:px-2"
              title={t.clear}
              aria-label={t.clear}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm w-11 h-11 sm:w-auto sm:h-8 px-0 sm:px-2"
              title={t.closeDrawer}
              aria-label={t.closeDrawer}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Local LLM Engine Status Banner */}
        <div className="px-4 sm:px-5 py-2 bg-surface-2 border-b border-line flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Cpu className="w-3.5 h-3.5 text-fg-subtle shrink-0" />
            <span className="text-fg-muted shrink-0">{t.engine}</span>
            {llmStatus.isAvailable ? (
              <span className="flex items-center gap-1.5 font-mono text-fg truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                {llmStatus.provider === 'claude' ? `Claude (${llmStatus.activeModel})` : `${t.ollama} (${llmStatus.activeModel})`}
              </span>
            ) : (
              <span className="text-fg-muted truncate" title={t.builtinNote}>
                {t.builtinNoLlm}
              </span>
            )}
          </div>

          {llmStatus.isAvailable && (
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as LlmProvider)}
              aria-label={t.engineAria}
              className="field w-auto text-xs font-mono h-7 px-2 cursor-pointer"
            >
              <option value={llmStatus.provider}>{llmStatus.provider === 'claude' ? 'Claude' : 'Ollama'} ({llmStatus.activeModel})</option>
              <option value="builtin">{t.builtin}</option>
            </select>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 py-5 sm:py-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-sm leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-6 h-6 rounded-sm bg-surface-2 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-fg-subtle" />
                </div>
              )}

              <div
                className={
                  msg.sender === 'user'
                    ? 'max-w-[85%] rounded bg-surface-2 text-fg px-4 py-3'
                    : 'flex-1 min-w-0 text-fg'
                }
              >
                <div className="whitespace-pre-line">
                  {msg.text ? (msg.sender === 'ai' ? renderInline(chromeText(msg)) : msg.text) : (
                    <span className="text-fg-subtle">{t.thinking}</span>
                  )}
                </div>

                {/* Optional Action Code Snippet */}
                {msg.actionSnippet && (
                  <div className="mt-4 pt-3 border-t border-line">
                    <div className="flex items-center justify-between mb-2">
                      <span className="label">{t.snippet[msg.actionSnippet.type]}</span>
                      <button
                        onClick={() => handleCopySnippet(msg.actionSnippet!.content, msg.id)}
                        className="flex items-center gap-1 text-xs text-fg-muted hover:text-fg transition-colors cursor-pointer"
                      >
                        {copiedSnippetId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-fg-subtle" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedSnippetId === msg.id ? c.copied : c.copy}</span>
                      </button>
                    </div>
                    <div className="inset p-3 font-mono text-xs text-fg border border-line overflow-x-auto whitespace-pre">
                      {msg.actionSnippet.content}
                    </div>
                  </div>
                )}

                <span className={`block text-2xs text-fg-subtle num mt-2 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                  {msg.id === 'init-hello' ? t.justNow : msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 items-center text-xs text-fg-subtle">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.writing}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 sm:px-5 py-3 border-t border-line">
          <span className="text-xs text-fg-subtle block mb-2">{t.quickPrompts}</span>
          <div className="flex sm:flex-wrap gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {t.prompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="btn btn-secondary btn-sm h-10 sm:h-8 shrink-0 sm:shrink max-w-[80vw] sm:max-w-full justify-start"
              >
                <span className="truncate">{prompt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="px-4 sm:px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:py-4 border-t border-line">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder(analysis.domain)}
              aria-label={t.inputAria}
              maxLength={2000}
              className="field flex-1 min-w-0 h-11 sm:h-9 px-3 text-base sm:text-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              aria-label={t.send}
              className="btn btn-primary h-11 w-11 sm:h-9 sm:w-auto px-0 sm:px-3"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
