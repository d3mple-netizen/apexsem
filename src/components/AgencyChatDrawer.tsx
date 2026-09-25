import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, Copy, Check, Trash2, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import { DomainAnalysis } from '../types';
import { ChatMessage } from '../services/aiAgency';
import { checkLocalLlm, queryLocalLlmStream, LocalLlmStatus, LlmProvider } from '../services/localLlm';

/** Renders **bold** and `code` spans; everything else stays plain text. */
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`\n]+`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={i} className="font-semibold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={i} className="font-mono text-[11px] px-1 rounded bg-slate-200/70 dark:bg-slate-800">{part.slice(1, -1)}</code>;
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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `I have the analysis for **${analysis.domain}** loaded: authority score ${analysis.score.overall}/100, ${analysis.keywords.length} keyword opportunities, ${analysis.croAudit.findings.length} landing-page findings.\n\nAsk me for ad copy, a bidding plan, negative keywords, schema markup, or how to beat a specific competitor.`,
      timestamp: 'Just now'
    }
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
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
            ? { ...msg, text: result.fullText || accumulatedText, actionSnippet: result.actionSnippet }
            : msg
        )
      );
    } catch (err) {
      console.error('Error generating AI answer:', err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? { ...msg, text: 'The strategist could not answer. Check your connection and send the question again.' }
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
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'ai',
        text: `Conversation cleared. I'm ready to help with SEM campaigns, T1 authority, or CRO for **${analysis.domain}**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const QUICK_PROMPTS = [
    'How do I lower CPC on competitor terms?',
    'Generate 3 ad headline angles for enterprise buyers',
    'How do I rank #1 in ChatGPT Search & Perplexity?',
    'Show me the JSON-LD schema for software entity'
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl transition-colors duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-accent-600 flex items-center justify-center shadow-glow">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 dark:text-white">ApexSEM strategist</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Domain: {analysis.domain}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearChat}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Local LLM Engine Status Banner */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-brand-500" />
            <span className="text-slate-600 dark:text-slate-400 font-medium">Engine:</span>
            {llmStatus.isAvailable ? (
              <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {llmStatus.provider === 'claude' ? `Claude (${llmStatus.activeModel})` : `Local Ollama (${llmStatus.activeModel})`}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-500/20">
                Built-in playbooks (no LLM connected)
              </span>
            )}
          </div>

          {llmStatus.isAvailable && (
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as LlmProvider)}
              aria-label="Answer engine"
              className="text-[11px] font-mono bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-1.5 py-0.5 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value={llmStatus.provider}>{llmStatus.provider === 'claude' ? 'Claude' : 'Ollama'} ({llmStatus.activeModel})</option>
              <option value="builtin">Built-in playbooks</option>
            </select>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-6 h-6 rounded-md bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/20 dark:border-brand-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line">
                  {msg.text ? (msg.sender === 'ai' ? renderInline(msg.text) : msg.text) : (
                    <span className="italic text-slate-400">Thinking…</span>
                  )}
                </div>

                {/* Optional Action Code Snippet */}
                {msg.actionSnippet && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono mb-1.5">
                      <span>{msg.actionSnippet.type.toUpperCase()} RECOMMENDATION:</span>
                      <button
                        onClick={() => handleCopySnippet(msg.actionSnippet!.content, msg.id)}
                        className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSnippetId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedSnippetId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 text-brand-300 font-mono text-[11px] border border-slate-800 overflow-x-auto whitespace-pre">
                      {msg.actionSnippet.content}
                    </div>
                  </div>
                )}

                <span className="block text-[9px] text-slate-400 mt-2 text-right">
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-slate-600 dark:text-slate-300">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 items-center text-xs text-brand-600 dark:text-brand-400 font-mono animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Writing answer…</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 border-t border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/40">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1.5 font-medium">Quick Prompts:</span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-[10px] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 transition-all text-left truncate max-w-full cursor-pointer shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80">
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
              placeholder={`Ask about ${analysis.domain}…`}
              aria-label="Message the strategist"
              maxLength={2000}
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 font-sans"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-xl transition-all shadow-glow cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
