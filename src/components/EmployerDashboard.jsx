import React, { useEffect, useMemo, useState } from 'react';
import {
  Briefcase, Inbox, CheckCircle2, Users, Plus, FolderKanban, MessageCircle, Sparkles, TrendingUp, ChevronRight,
} from 'lucide-react';
import { API_URL } from '../constants';
import { useT } from '../i18n.jsx';

// Дашборд для работодателя: приветствие, статистика, быстрые действия.
// Показывается на главной странице работодателя над каталогом соискателей.

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-5 overflow-hidden`}>
    <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 ${accent.bg}`} />
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 rounded-xl ${accent.iconBg} ${accent.iconText}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
    <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{value}</p>
  </div>
);

const QuickAction = ({ icon: Icon, title, subtitle, onClick, badge, accent }) => (
  <button
    onClick={onClick}
    className="group relative text-left bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
  >
    {badge != null && badge > 0 && (
      <span className="absolute top-3 right-3 inline-flex items-center justify-center min-w-6 h-6 px-2 text-xs font-bold text-white bg-red-500 rounded-full shadow">
        {badge > 99 ? '99+' : badge}
      </span>
    )}
    <div className={`inline-flex p-3 rounded-xl ${accent} mb-3 group-hover:scale-110 transition-transform`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex items-center gap-1">
      <p className="font-bold text-gray-900 dark:text-white">{title}</p>
      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
  </button>
);

const EmployerDashboard = ({ user, vacancies = [], seekers = [], onNavigate }) => {
  const { t } = useT();
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const r = await fetch(`${API_URL}/applications.php?employer_id=${user.id}`);
        if (r.ok) {
          const data = await r.json();
          if (!cancelled) setApplications(Array.isArray(data) ? data : []);
        }
      } catch (e) { /* тихо */ }
      finally { if (!cancelled) setLoadingApps(false); }
    };
    load();
    return () => { cancelled = true; };
  }, [user.id]);

  const myVacancies = useMemo(
    () => vacancies.filter(v => String(v.employer_id) === String(user.id)),
    [vacancies, user.id]
  );
  const pendingCount  = applications.filter(a => a.status === 'pending').length;
  const acceptedCount = applications.filter(a => a.status === 'accepted').length;

  // Приветствие по времени суток
  const hour = new Date().getHours();
  const greetingKey =
    hour < 6 ? 'emp_dash.greeting.night' :
    hour < 12 ? 'emp_dash.greeting.morning' :
    hour < 18 ? 'emp_dash.greeting.day' :
    'emp_dash.greeting.evening';
  const displayName = (user.name || '').split(' ')[0] || user.name || '';

  return (
    <div className="space-y-6 mb-10">
      {/* Hero-приветствие */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 text-white p-8 sm:p-10">
        {/* декоративные пузыри */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute -bottom-12 -left-12 w-52 h-52 bg-indigo-400/20 rounded-full" />
        <div className="absolute top-12 right-20 w-3 h-3 bg-yellow-300 rounded-full animate-pulse" />
        <div className="absolute bottom-16 right-40 w-2 h-2 bg-pink-300 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur rounded-full text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {t('emp_dash.role_badge')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t(greetingKey)}, {displayName}!
          </h1>
          <p className="mt-2 text-blue-100 max-w-xl">
            {t('emp_dash.subtitle')}
          </p>

          {/* мини-инлайн KPI с трендом */}
          <div className="mt-6 inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-xl px-4 py-2">
            <TrendingUp className="w-4 h-4 text-green-300" />
            <span className="text-sm font-medium">
              {t('emp_dash.tagline').replace('{n}', String(seekers.length))}
            </span>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Briefcase}
          label={t('emp_dash.stat.my_vacancies')}
          value={myVacancies.length}
          accent={{
            bg: 'bg-blue-500',
            iconBg: 'bg-blue-100 dark:bg-blue-900/40',
            iconText: 'text-blue-600 dark:text-blue-400',
          }}
        />
        <StatCard
          icon={Inbox}
          label={t('emp_dash.stat.new_apps')}
          value={loadingApps ? '…' : pendingCount}
          accent={{
            bg: 'bg-amber-500',
            iconBg: 'bg-amber-100 dark:bg-amber-900/40',
            iconText: 'text-amber-600 dark:text-amber-400',
          }}
        />
        <StatCard
          icon={CheckCircle2}
          label={t('emp_dash.stat.accepted')}
          value={loadingApps ? '…' : acceptedCount}
          accent={{
            bg: 'bg-emerald-500',
            iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
            iconText: 'text-emerald-600 dark:text-emerald-400',
          }}
        />
        <StatCard
          icon={Users}
          label={t('emp_dash.stat.seekers')}
          value={seekers.length}
          accent={{
            bg: 'bg-indigo-500',
            iconBg: 'bg-indigo-100 dark:bg-indigo-900/40',
            iconText: 'text-indigo-600 dark:text-indigo-400',
          }}
        />
      </div>

      {/* Быстрые действия */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 px-1">
          {t('emp_dash.quick_actions')}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction
            icon={Plus}
            title={t('emp_dash.action.create')}
            subtitle={t('emp_dash.action.create_sub')}
            onClick={() => onNavigate('create-vacancy')}
            accent="bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
          />
          <QuickAction
            icon={FolderKanban}
            title={t('emp_dash.action.my_vacancies')}
            subtitle={t('emp_dash.action.my_vacancies_sub').replace('{n}', String(myVacancies.length))}
            onClick={() => onNavigate('my-vacancies')}
            accent="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400"
          />
          <QuickAction
            icon={Inbox}
            title={t('emp_dash.action.applications')}
            subtitle={t('emp_dash.action.applications_sub')}
            onClick={() => onNavigate('applications')}
            badge={pendingCount}
            accent="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"
          />
          <QuickAction
            icon={MessageCircle}
            title={t('emp_dash.action.messages')}
            subtitle={t('emp_dash.action.messages_sub')}
            onClick={() => onNavigate('messages')}
            accent="bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400"
          />
        </div>
      </div>

      {/* Заголовок раздела соискателей */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {t('emp_dash.catalog_title')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {t('emp_dash.catalog_subtitle')}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
          <Users className="w-4 h-4" />
          {seekers.length}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
