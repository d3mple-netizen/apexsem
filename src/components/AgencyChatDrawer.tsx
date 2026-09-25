import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, Copy, Check, Trash2, Cpu } from 'lucide-react';
import { DomainAnalysis } from '../types';
import { ChatMessage } from '../services/aiAgency';
import { checkLocalLlm, queryLocalLlmStream, LocalLlmStatus, LlmProvider } from '../services/localLlm';

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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-surface border-l border-line h-full flex flex-col shadow-overlay">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-surface-2 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-fg-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-fg">ApexSEM strategist</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              </div>
              <p className="text-xs text-fg-subtle font-mono">Domain: {analysis.domain}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearChat}
              className="btn btn-ghost btn-sm px-2"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm px-2"
              title="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Local LLM Engine Status Banner */}
        <div className="px-5 py-2 bg-surface-2 border-b border-line flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Cpu className="w-3.5 h-3.5 text-fg-subtle shrink-0" />
            <span className="text-fg-muted">Engine:</span>
            {llmStatus.isAvailable ? (
              <span className="flex items-center gap-1.5 font-mono text-fg truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                {llmStatus.provider === 'claude' ? `Claude (${llmStatus.activeModel})` : `Local Ollama (${llmStatus.activeModel})`}
              </span>
            ) : (
              <span className="text-fg-muted truncate">
                Built-in playbooks (no LLM connected)
              </span>
            )}
          </div>

          {llmStatus.isAvailable && (
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as LlmProvider)}
              aria-label="Answer engine"
              className="field w-auto text-xs font-mono h-7 px-2 cursor-pointer"
            >
              <option value={llmStatus.provider}>{llmStatus.provider === 'claude' ? 'Claude' : 'Ollama'} ({llmStatus.activeModel})</option>
              <option value="builtin">Built-in playbooks</option>
            </select>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
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
                  {msg.text ? (msg.sender === 'ai' ? renderInline(msg.text) : msg.text) : (
                    <span className="text-fg-subtle">Thinking…</span>
                  )}
                </div>

                {/* Optional Action Code Snippet */}
                {msg.actionSnippet && (
                  <div className="mt-4 pt-3 border-t border-line">
                    <div className="flex items-center justify-between mb-2">
                      <span className="label">{msg.actionSnippet.type} recommendation</span>
                      <button
                        onClick={() => handleCopySnippet(msg.actionSnippet!.content, msg.id)}
                        className="flex items-center gap-1 text-xs text-fg-muted hover:text-fg transition-colors cursor-pointer"
                      >
                        {copiedSnippetId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-fg-subtle" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedSnippetId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="inset p-3 font-mono text-xs text-fg border border-line overflow-x-auto whitespace-pre">
                      {msg.actionSnippet.content}
                    </div>
                  </div>
                )}

                <span className={`block text-2xs text-fg-subtle num mt-2 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 items-center text-xs text-fg-subtle">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Writing answer…</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-3 border-t border-line">
          <span className="text-xs text-fg-subtle block mb-2">Quick prompts</span>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="btn btn-secondary btn-sm max-w-full justify-start"
              >
                <span className="truncate">{prompt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="px-5 py-4 border-t border-line">
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
              className="field flex-1 h-9 px-3 text-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              className="btn btn-primary px-3"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
