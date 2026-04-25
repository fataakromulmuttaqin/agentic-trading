'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  'What is BTC price?',
  'Show portfolio',
  'Analyze ETH trend',
  'Place SOL limit order',
];

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m Hermes, your AI trading assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSuggestion = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })) }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      const assistantId = `assistant-${Date.now()}`;

      setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '', timestamp: new Date() }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantMessage += decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.id === assistantId) return [...prev.slice(0, -1), { ...last, content: assistantMessage }];
            return [...prev, { id: assistantId, role: 'assistant', content: assistantMessage, timestamp: new Date() }];
          });
        }
      }
    } catch {
      setMessages((prev) => [...prev, { id: `error-${Date.now()}`, role: 'assistant', content: 'Error. Please try again.', timestamp: new Date() }]);
    }

    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg-surface)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--border)] shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-blue-500/20 border border-[var(--border-active)] flex items-center justify-center">
          <Bot className="w-6 h-6 text-[var(--accent)]" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)]">Hermes</h2>
          <p className="text-xs text-[var(--positive)] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--positive)] animate-pulse-dot" />
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              msg.role === 'user'
                ? 'bg-blue-500/20 border border-blue-500/30'
                : 'bg-[var(--accent-glow)] border border-[var(--border-active)]'
            }`}>
              {msg.role === 'user'
                ? <User className="w-5 h-5 text-blue-400" />
                : <Bot className="w-5 h-5 text-[var(--accent)]" />
              }
            </div>
            <div className={`max-w-[80%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxing ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-md'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] rounded-tl-md'
              }`}>
                {msg.content || (loading && msg.role === 'assistant' ? (
                  <span className="flex items-center gap-2 text-[var(--text-muted)]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Thinking...
                  </span>
                ) : null)}
              </div>
              <span className="text-[10px] text-[var(--text-muted)] px-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && !loading && (
        <div className="px-4 pb-2 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Quick</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="px-3 py-2 text-xs text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl hover:border-[var(--border-active)] hover:text-[var(--accent)] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-4 border-t border-[var(--border)] shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Hermes..."
            className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-4 py-3.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-active)] transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-12 h-12 rounded-2xl bg-[var(--accent)] hover:bg-[var(--accent-dim)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0 active:scale-95"
          >
            <Send className="w-5 h-5 text-[var(--bg-base)]" />
          </button>
        </form>
      </div>
    </div>
  );
}
