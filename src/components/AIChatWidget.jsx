import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, X, Send, Loader2, RotateCcw } from 'lucide-react';
import { API_URL } from '../constants';

const SUGGESTIONS = [
  'Как откликнуться на вакансию?',
  'Как создать резюме?',
  'Как работают фильтры поиска?',
  'Что делает работодатель в админке?',
];

const STORAGE_KEY = 'jobsearch_ai_chat';

const AIChatWidget = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return [];
  });
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch (e) { /* ignore */ }
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      scrollRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' });
    }
  }, [open, messages]);

  const send = async (textOverride) => {
    const text = (textOverride ?? draft).trim();
    if (!text || sending) return;

    const userMsg = { role: 'user', text };
    const next = [...messages, userMsg];
    setMessages(next);
    setDraft('');
    setSending(true);

    try {
      const r = await fetch(`${API_URL}/ai.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.slice(-20),
          user_role: user?.role || null,
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        const errText = data?.error?.message || data?.error || `HTTP ${r.status}`;
        setMessages(m => [...m, { role: 'model', text: `⚠️ Не удалось получить ответ: ${typeof errText === 'string' ? errText : 'неизвестная ошибка'}` }]);
      } else {
        setMessages(m => [...m, { role: 'model', text: data.reply || '...' }]);
      }
    } catch (e) {
      setMessages(m => [...m, { role: 'model', text: '⚠️ Ошибка сети. Проверьте, что бэкенд (OSPanel) запущен.' }]);
    } finally {
      setSending(false);
    }
  };

  const clearChat = () => {
    if (!messages.length) return;
    if (!window.confirm('Очистить историю чата с ИИ?')) return;
    setMessages([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  };

  return (
    <>
      {/* Плавающая кнопка-триггер */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 px-5 py-3.5 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all transform hover:scale-105 active:scale-95"
          title="Спросить ИИ-помощника"
        >
          <span className="relative flex">
            <Sparkles className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full ring-2 ring-blue-600 animate-pulse" />
          </span>
          <span className="text-sm font-bold hidden sm:inline">ИИ-помощник</span>
        </button>
      )}

      {/* Панель чата */}
      {open && (
        <div className="fixed bottom-6 right-6 z-40 w-[calc(100%-3rem)] sm:w-96 max-w-md h-[70vh] max-h-[600px] flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 bg-white/15 rounded-lg backdrop-blur">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm truncate">ИИ-помощник</div>
                <div className="text-[11px] text-blue-100 truncate">Подскажу по сайту JobSearch</div>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={clearChat}
                className="p-1.5 hover:bg-white/15 rounded-lg transition-colors"
                title="Очистить историю"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 hover:bg-white/15 rounded-lg transition-colors"
                title="Свернуть"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900/40">
            {messages.length === 0 && (
              <div className="text-center mt-6">
                <div className="inline-flex p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-3">
                  <Sparkles className="w-7 h-7" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-1">Здравствуйте! Чем помочь?</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Я знаю всё о функциях сайта.</p>
                <div className="space-y-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="block w-full text-left px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-600 rounded-bl-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex items-end gap-2 p-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder="Спросите что-нибудь о сайте..."
              className="flex-1 resize-none px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-300 dark:focus:border-blue-500 outline-none transition-all max-h-24"
            />
            <button
              type="submit"
              disabled={!draft.trim() || sending}
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex-shrink-0"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
          <div className="text-[10px] text-center text-gray-400 dark:text-gray-500 pb-2 px-3">
            Powered by Google Gemini
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatWidget;
