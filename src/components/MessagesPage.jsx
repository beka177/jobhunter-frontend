import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, Send, User, MessageCircle, Briefcase, Loader2, CheckCircle2, XCircle, Clock, Info } from 'lucide-react';
import { API_URL, UserRole } from '../constants';
import { useToast } from '../toast.jsx';
import { useT } from '../i18n.jsx';

const APPLICATION_STATUS_META = {
  pending:  { cls: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', Icon: Clock, key: 'msg.app_status.pending' },
  accepted: { cls: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',     Icon: CheckCircle2, key: 'msg.app_status.accepted' },
  rejected: { cls: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',             Icon: XCircle, key: 'msg.app_status.rejected' },
};

const POLL_INTERVAL_MS = 5000;

// Корневая страница чатов: слева — список диалогов, справа — выбранный диалог.
const MessagesPage = ({ user, onNavigate, chatTarget, onChatTargetConsumed, onUnreadRefresh }) => {
  const toast = useToast();
  const { t, lang } = useT();
  const [conversations, setConversations] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // ============== ЗАГРУЗКА СПИСКА ==============
  const fetchConversations = useCallback(async () => {
    try {
      const r = await fetch(`${API_URL}/messages.php?action=list&user_id=${user.id}`);
      if (r.ok) {
        const data = await r.json();
        if (Array.isArray(data)) setConversations(data);
      }
    } catch (e) {
      // ignore
    } finally {
      setLoadingList(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // ============== СТАРТ ИЛИ ОТКРЫТИЕ ИЗ chatTarget ==============
  useEffect(() => {
    if (!chatTarget) return;
    const { otherUserId, otherUserRole, vacancyId } = chatTarget;

    const seekerId   = user.role === UserRole.SEEKER ? user.id : otherUserId;
    const employerId = user.role === UserRole.EMPLOYER ? user.id : otherUserId;

    (async () => {
      try {
        const r = await fetch(`${API_URL}/messages.php?action=start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            seeker_id: seekerId,
            employer_id: employerId,
            vacancy_id: vacancyId || null,
            sender_id: user.id,
          }),
        });
        if (!r.ok) throw new Error('start failed');
        const data = await r.json();
        onChatTargetConsumed?.();
        await fetchConversations();
        setSelectedId(data.conversation_id);
      } catch (e) {
        toast.error(t('msg.toast.open_error'));
        onChatTargetConsumed?.();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatTarget, user.id]);

  // ============== ЗАГРУЗКА СООБЩЕНИЙ ВЫБРАННОГО ДИАЛОГА ==============
  const fetchMessages = useCallback(async (convId, silent = false) => {
    if (!silent) setLoadingMessages(true);
    try {
      const r = await fetch(`${API_URL}/messages.php?action=messages&conversation_id=${convId}&user_id=${user.id}`);
      if (r.ok) {
        const data = await r.json();
        if (Array.isArray(data)) setMessages(data);
      }
    } catch (e) {
      // ignore
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  }, [user.id]);

  useEffect(() => {
    if (!selectedId) return;
    fetchMessages(selectedId);
    onUnreadRefresh?.();
    const id = setInterval(() => {
      fetchMessages(selectedId, true);
      fetchConversations();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [selectedId, fetchMessages, fetchConversations, onUnreadRefresh]);

  // Автоскролл вниз при новом сообщении
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ============== ОТПРАВКА СООБЩЕНИЯ ==============
  const handleSend = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !selectedId || sending) return;

    setSending(true);
    try {
      const r = await fetch(`${API_URL}/messages.php?action=send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: selectedId,
          sender_id: user.id,
          body: text,
        }),
      });
      if (!r.ok) throw new Error('send failed');
      const newMsg = await r.json();
      setMessages(prev => [...prev, newMsg]);
      setDraft('');
      fetchConversations();
    } catch (err) {
      toast.error(t('msg.toast.send_error'));
    } finally {
      setSending(false);
    }
  };

  // ============== ХЕЛПЕРЫ ==============
  const otherSideOf = (conv) => {
    if (!conv) return null;
    const meIsSeeker = (conv.seeker_id === user.id);
    return {
      name: meIsSeeker ? conv.employer_name : conv.seeker_name,
      avatar: meIsSeeker ? conv.employer_avatar : conv.seeker_avatar,
      role: meIsSeeker ? 'employer' : 'seeker',
    };
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    const today = new Date();
    const sameDay = d.toDateString() === today.toDateString();
    const loc = lang === 'kk' ? 'kk-KZ' : 'ru-RU';
    return sameDay
      ? d.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString(loc, { day: '2-digit', month: '2-digit' });
  };

  const selectedConv = conversations.find(c => c.id === selectedId);
  const other = otherSideOf(selectedConv);

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4 pb-10">
      <button
        onClick={() => onNavigate('home')}
        className="mb-4 inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors font-medium shadow-sm"
      >
        <ArrowLeft className="h-5 w-5 mr-2" /> {t('msg.back_home')}
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row h-[70vh] min-h-[500px]">
        {/* ============ СПИСОК СЛЕВА ============ */}
        <aside className={`md:w-80 lg:w-96 border-r border-gray-100 dark:border-gray-700 flex flex-col ${selectedId ? 'hidden md:flex' : 'flex'}`}>
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-blue-500" /> {t('msg.title')}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingList ? (
              <div className="p-6 text-center text-gray-400 dark:text-gray-500">{t('msg.list.loading')}</div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-400 dark:text-gray-500 text-sm whitespace-pre-line">
                {t(user.role === UserRole.SEEKER ? 'msg.list.empty_seeker' : 'msg.list.empty_employer')}
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {conversations.map(c => {
                  const oth = otherSideOf(c);
                  const active = c.id === selectedId;
                  const unread = Number(c.unread_count) || 0;
                  return (
                    <li key={c.id}>
                      <button
                        onClick={() => setSelectedId(c.id)}
                        className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${active ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                      >
                        {oth?.avatar ? (
                          <img src={oth.avatar} alt="" className="w-11 h-11 rounded-full object-cover border border-gray-200 dark:border-gray-600 flex-shrink-0" />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 flex-shrink-0">
                            <User className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`truncate text-sm ${unread ? 'font-bold' : 'font-semibold'} text-gray-900 dark:text-white`}>{oth?.name || t('msg.user_default')}</p>
                            <span className="text-[11px] text-gray-400 dark:text-gray-500 flex-shrink-0">{formatTime(c.last_message_at || c.updated_at)}</span>
                          </div>
                          {c.vacancy_title && (
                            <div className="flex items-center justify-between gap-2 mt-0.5">
                              <p className="text-[11px] text-blue-600 dark:text-blue-400 truncate flex items-center min-w-0">
                                <Briefcase className="w-3 h-3 mr-1 flex-shrink-0" /><span className="truncate">{c.vacancy_title}</span>
                              </p>
                              {c.application_status && APPLICATION_STATUS_META[c.application_status] && (() => {
                                const s = APPLICATION_STATUS_META[c.application_status];
                                return (
                                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide flex-shrink-0 ${s.cls}`}>
                                    <s.Icon className="w-3 h-3" /> {t(s.key)}
                                  </span>
                                );
                              })()}
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-1 gap-2">
                            <p className={`truncate text-xs ${unread ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                              {c.last_message || <span className="italic">{t('msg.no_messages')}</span>}
                            </p>
                            {unread > 0 && (
                              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold text-white bg-red-500 rounded-full flex-shrink-0">{unread}</span>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* ============ СПРАВА — ВЫБРАННЫЙ ДИАЛОГ ============ */}
        <section className={`flex-1 flex flex-col ${selectedId ? 'flex' : 'hidden md:flex'}`}>
          {!selectedConv ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-8 text-center">
              <MessageCircle className="w-16 h-16 mb-4 opacity-30" />
              <p className="font-medium">{t('msg.empty_select')}</p>
            </div>
          ) : (
            <>
              {/* Шапка диалога */}
              <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                <button
                  onClick={() => setSelectedId(null)}
                  className="md:hidden p-1 -ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  title={t('msg.back_to_list')}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                {other?.avatar ? (
                  <img src={other.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-gray-900 dark:text-white truncate">{other?.name}</div>
                  {selectedConv.vacancy_title && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 truncate flex items-center">
                      <Briefcase className="w-3 h-3 mr-1" />{selectedConv.vacancy_title}
                    </div>
                  )}
                </div>
                {selectedConv.application_status && APPLICATION_STATUS_META[selectedConv.application_status] && (() => {
                  const s = APPLICATION_STATUS_META[selectedConv.application_status];
                  return (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${s.cls}`}>
                      <s.Icon className="w-3.5 h-3.5" /> {t(s.key)}
                    </span>
                  );
                })()}
              </div>

              {/* Лента сообщений */}
              <div className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50 dark:bg-gray-900/40 space-y-3">
                {loadingMessages ? (
                  <div className="text-center text-gray-400 dark:text-gray-500 py-10">{t('msg.loading_messages')}</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-400 dark:text-gray-500 py-10 text-sm">{t('msg.first_message')}</div>
                ) : (
                  messages.map(m => {
                    if (m.type === 'system') {
                      return (
                        <div key={m.id} className="flex justify-center">
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 text-xs font-semibold max-w-[85%] text-center">
                            <Info className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="whitespace-pre-wrap">{m.body}</span>
                            <span className="text-blue-400 dark:text-blue-500 font-normal flex-shrink-0">· {formatTime(m.created_at)}</span>
                          </div>
                        </div>
                      );
                    }
                    const mine = m.sender_id === user.id;
                    return (
                      <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${mine
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm border border-gray-100 dark:border-gray-600'}`}>
                          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">{m.body}</div>
                          <div className={`text-[10px] mt-1 ${mine ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'} text-right`}>
                            {formatTime(m.created_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Поле ввода */}
              <form onSubmit={handleSend} className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-end gap-2">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  rows={1}
                  placeholder={t('msg.input_placeholder')}
                  className="flex-1 resize-none px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-300 dark:focus:border-blue-500 outline-none transition-all max-h-32"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || sending}
                  className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  title={t('msg.send_title')}
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default MessagesPage;
