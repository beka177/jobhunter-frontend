import React, { useState, useEffect } from 'react';
import { Trash2, Users, Briefcase, ShieldAlert, Plus, X, BarChart3, Edit, Ban, CheckCircle2, Loader2, MessageCircle, MapPin, TrendingUp, Heart, FileText, UserCheck, Clock, XCircle, Activity, Search, ChevronUp, ChevronDown, ChevronsUpDown, Info, Eye } from 'lucide-react';
import { API_URL } from '../constants';
import { useToast } from '../toast.jsx';
import { useT } from '../i18n.jsx';

const AdminPanel = ({ user, onNavigate, onEditVacancy }) => {
  const toast = useToast();
  const { t, lang } = useT();
  const locale = lang === 'kk' ? 'kk-KZ' : 'ru-RU';
  const [activeTab, setActiveTab] = useState('stats');
  const [users, setUsers] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [stats, setStats] = useState({
    users: 0, vacancies: 0, applications: 0,
    roles: { seeker: 0, employer: 0, admin: 0 },
    application_statuses: { pending: 0, accepted: 0, rejected: 0 },
    banned_users: 0, favorites: 0, conversations: 0, messages: 0,
    new_users_7d: 0, new_vacancies_7d: 0,
    top_cities: [], top_employers: [],
  });
  const [loading, setLoading] = useState(true);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' });
  const [banModal, setBanModal] = useState({ show: false, userId: null });
  const [busyUserId, setBusyUserId] = useState(null);
  const [busyVacancyId, setBusyVacancyId] = useState(null);
  const [submittingAdmin, setSubmittingAdmin] = useState(false);
  // Просмотрщик диалогов/сообщений пользователей
  const [msgModal, setMsgModal] = useState({ show: false, view: 'list', userName: '', convTitle: '', fromUser: false });
  const [userConvs, setUserConvs] = useState([]);
  const [convMessages, setConvMessages] = useState([]);
  const [msgLoading, setMsgLoading] = useState(false);
  // Поиск / сортировка / фильтры
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', dir: 'asc' });
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  // Модалки подробностей
  const [resumeModal, setResumeModal] = useState({ show: false, data: null });
  const [userModal, setUserModal] = useState({ show: false, loading: false, data: null });

  useEffect(() => {
    if (user?.role !== 'admin') {
      onNavigate('home');
      return;
    }
    // Сбрасываем инструменты при переключении вкладки
    setSearch('');
    setSortConfig({ key: '', dir: 'asc' });
    setRoleFilter('all');
    setStatusFilter('all');
    setCityFilter('all');
    fetchData(activeTab);
  }, [activeTab, user]);

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin.php?action=${tab}&admin_id=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        if (tab === 'users') setUsers(data);
        if (tab === 'vacancies') setVacancies(data);
        if (tab === 'stats') setStats(data);
        if (tab === 'resumes') setResumes(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (duration, userIdOverride = null) => {
    const targetId = userIdOverride ?? banModal.userId;
    if (!targetId) return;
    setBusyUserId(targetId);
    try {
      const response = await fetch(`${API_URL}/admin.php?action=ban_user&admin_id=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: targetId, duration })
      });
      if (response.ok) {
        setBanModal({ show: false, userId: null });
        toast.success(t(duration === 'unban' ? 'admin.users.toast.unbanned' : 'admin.users.toast.banned'));
        fetchData('users');
      } else {
        toast.error(t('admin.users.toast.ban_error'));
      }
    } catch (error) {
      toast.error(t('common.network_error'));
    } finally {
      setBusyUserId(null);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm(t('admin.users.confirm_delete'))) return;
    setBusyUserId(id);
    try {
      const response = await fetch(`${API_URL}/admin.php?action=user&id=${id}&admin_id=${user.id}`, { method: 'DELETE' });
      if (response.ok) {
        setUsers(users.filter(u => u.id !== id));
        toast.success(t('admin.users.toast.deleted'));
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || t('admin.users.toast.delete_error'));
      }
    } catch (error) {
      toast.error(t('common.network_error'));
    } finally {
      setBusyUserId(null);
    }
  };

  const handleDeleteVacancy = async (id) => {
    if (!window.confirm(t('admin.vac.confirm_delete'))) return;
    setBusyVacancyId(id);
    try {
      const response = await fetch(`${API_URL}/admin.php?action=vacancy&id=${id}&admin_id=${user.id}`, { method: 'DELETE' });
      if (response.ok) {
        setVacancies(vacancies.filter(v => v.id !== id));
        toast.success(t('admin.vac.toast.deleted'));
      } else {
        toast.error(t('admin.users.toast.delete_error'));
      }
    } catch (error) {
      toast.error(t('common.network_error'));
    } finally {
      setBusyVacancyId(null);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (submittingAdmin) return;
    setSubmittingAdmin(true);
    try {
      const response = await fetch(`${API_URL}/admin.php?action=create_admin&admin_id=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminForm)
      });
      if (response.ok) {
        setShowAdminForm(false);
        setAdminForm({ name: '', email: '', password: '' });
        fetchData('users');
        toast.success(t('admin.users.toast.admin_added'));
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || t('admin.users.toast.create_error'));
      }
    } catch (error) {
      toast.error(t('common.network_error'));
    } finally {
      setSubmittingAdmin(false);
    }
  };

  const convTitleOf = (c) => `${c.seeker_name} ↔ ${c.employer_name}` + (c.vacancy_title ? ` · ${c.vacancy_title}` : '');

  const closeMsgModal = () => setMsgModal({ show: false, view: 'list', userName: '', convTitle: '', fromUser: false });

  // Открыть список диалогов конкретного пользователя
  const openUserDialogs = async (u) => {
    setMsgModal({ show: true, view: 'list', userName: u.name, convTitle: '', fromUser: true });
    setUserConvs([]);
    setMsgLoading(true);
    try {
      const r = await fetch(`${API_URL}/admin.php?action=user_conversations&user_id=${u.id}&admin_id=${user.id}`);
      if (r.ok) setUserConvs(await r.json());
    } catch (e) {
      toast.error(t('common.network_error'));
    } finally {
      setMsgLoading(false);
    }
  };

  // Загрузить и показать сообщения одной переписки
  const loadConvMessages = async (convId, title, fromUser) => {
    setMsgModal(prev => ({ show: true, view: 'messages', userName: prev.userName, convTitle: title, fromUser: fromUser ?? prev.fromUser }));
    setConvMessages([]);
    setMsgLoading(true);
    try {
      const r = await fetch(`${API_URL}/admin.php?action=conversation_messages&id=${convId}&admin_id=${user.id}`);
      if (r.ok) setConvMessages(await r.json());
    } catch (e) {
      toast.error(t('common.network_error'));
    } finally {
      setMsgLoading(false);
    }
  };

  // Открыть подробную карточку пользователя
  const openUserDetails = async (u) => {
    setUserModal({ show: true, loading: true, data: { id: u.id, name: u.name } });
    try {
      const r = await fetch(`${API_URL}/admin.php?action=user_details&id=${u.id}&admin_id=${user.id}`);
      if (r.ok) setUserModal({ show: true, loading: false, data: await r.json() });
      else { toast.error(t('common.network_error')); setUserModal({ show: false, loading: false, data: null }); }
    } catch (e) {
      toast.error(t('common.network_error'));
      setUserModal({ show: false, loading: false, data: null });
    }
  };

  // Открыть полное резюме соискателя из карточки пользователя
  const openResumeFromUser = () => {
    const r = userModal.data?.resume;
    if (!r) return;
    const meta = { user_name: userModal.data.name, user_email: userModal.data.email };
    setUserModal({ show: false, loading: false, data: null });
    setResumeModal({ show: true, data: { ...r, ...meta } });
  };

  // Удаление вакансии прямо из карточки пользователя (модерация работодателя)
  const handleModalDeleteVacancy = async (id) => {
    if (!window.confirm(t('admin.vac.confirm_delete'))) return;
    setBusyVacancyId(id);
    try {
      const r = await fetch(`${API_URL}/admin.php?action=vacancy&id=${id}&admin_id=${user.id}`, { method: 'DELETE' });
      if (r.ok) {
        setVacancies(prev => prev.filter(v => v.id !== id));
        setUserModal(prev => prev.data ? { ...prev, data: { ...prev.data, vacancies: (prev.data.vacancies || []).filter(v => v.id !== id), vacancies_count: Math.max(0, (prev.data.vacancies_count || 1) - 1) } } : prev);
        toast.success(t('admin.vac.toast.deleted'));
      } else {
        toast.error(t('admin.users.toast.delete_error'));
      }
    } catch (e) {
      toast.error(t('common.network_error'));
    } finally {
      setBusyVacancyId(null);
    }
  };

  // --- Утилиты поиска/сортировки ---
  const fmtDate = (d) => { if (!d) return ''; const dt = new Date(d); return isNaN(dt) ? '' : dt.toLocaleDateString(locale); };

  const toggleSort = (key) => setSortConfig(prev => prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });

  const applyTools = (rows, searchFields) => {
    let out = rows;
    const q = search.trim().toLowerCase();
    if (q) out = out.filter(row => searchFields.some(f => String(row[f] ?? '').toLowerCase().includes(q)));
    if (sortConfig.key) {
      const { key, dir } = sortConfig;
      const isDate = key === 'created_at' || key === 'updated_at';
      out = [...out].sort((a, b) => {
        let va = a[key], vb = b[key];
        if (isDate) { va = va ? new Date(va).getTime() : 0; vb = vb ? new Date(vb).getTime() : 0; }
        else if (typeof va === 'number' && typeof vb === 'number') { /* числа сравниваем как есть */ }
        else { va = String(va ?? '').toLowerCase(); vb = String(vb ?? '').toLowerCase(); }
        if (va < vb) return dir === 'asc' ? -1 : 1;
        if (va > vb) return dir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return out;
  };

  const cityOptions = (rows) => Array.from(new Set(rows.map(r => r.city).filter(Boolean))).sort((a, b) => a.localeCompare(b));

  // Сортируемый заголовок столбца
  const sortHead = (label, key, className, align = 'left') => (
    <th className={`${className} cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200`} onClick={() => toggleSort(key)}>
      <span className={`inline-flex items-center gap-1 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
        {label}
        {sortConfig.key === key
          ? (sortConfig.dir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)
          : <ChevronsUpDown className="w-3.5 h-3.5 opacity-30" />}
      </span>
    </th>
  );

  const selectCls = "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer";

  // Отфильтрованные/отсортированные наборы
  const usersView = (() => {
    let rows = users;
    if (roleFilter !== 'all') rows = rows.filter(u => u.role === roleFilter);
    if (statusFilter === 'active') rows = rows.filter(u => !u.banned_until);
    if (statusFilter === 'banned') rows = rows.filter(u => u.banned_until);
    return applyTools(rows, ['name', 'email', 'role']);
  })();

  const vacanciesView = (() => {
    let rows = vacancies;
    if (cityFilter !== 'all') rows = rows.filter(v => v.city === cityFilter);
    return applyTools(rows, ['title', 'employer_name', 'city']);
  })();

  const resumesView = (() => {
    let rows = resumes;
    if (cityFilter !== 'all') rows = rows.filter(r => r.city === cityFilter);
    return applyTools(rows, ['surname', 'first_name', 'patronymic', 'user_name', 'user_email', 'profession', 'city', 'skills']);
  })();

  const resumeFields = (r) => [
    [t('admin.resume.col.profession'), r.profession],
    [t('admin.resume.col.city'), r.city],
    [t('admin.resume.col.phone'), r.phone],
    [t('admin.resume.field.gender'), r.gender],
    [t('admin.resume.field.birthday'), fmtDate(r.birthday)],
    [t('admin.resume.field.citizenship'), r.citizenship],
    [t('admin.resume.field.work_permit'), r.work_permit],
    [t('admin.resume.field.education_level'), r.education_level],
    [t('admin.resume.field.institution'), r.education_institution],
    [t('admin.resume.field.faculty'), r.education_faculty],
    [t('admin.resume.field.specialization'), r.education_specialization],
    [t('admin.resume.field.year'), r.education_year],
  ].filter(([, v]) => v != null && String(v).trim() !== '');

  const roleBadge = (role) => (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
      role === 'admin' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
      role === 'employer' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
    }`}>{role}</span>
  );

  if (user?.role !== 'admin') return null;

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mt-8">
      <div className="overflow-hidden rounded-t-2xl">
        <div className="bg-gray-900 dark:bg-gray-950 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center text-white">
            <ShieldAlert className="w-8 h-8 mr-3 text-red-500" />
            <h1 className="text-2xl font-bold">{t('admin.title')}</h1>
          </div>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {[
          { id: 'stats',         icon: BarChart3,    labelKey: 'admin.tab.stats' },
          { id: 'users',         icon: Users,        labelKey: 'admin.tab.users' },
          { id: 'vacancies',     icon: Briefcase,    labelKey: 'admin.tab.vacancies' },
          { id: 'resumes',       icon: FileText,     labelKey: 'admin.tab.resumes' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[140px] py-4 px-4 text-center font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-500' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-5 h-5 inline-block mr-2 mb-1" />
            {t(tab.labelKey)}
          </button>
        ))}
      </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
        ) : activeTab === 'stats' ? (
          <div className="space-y-6">
            {/* Главные карточки */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard color="blue"   icon={Users}        label={t('admin.stat.users')}     value={stats.users}    delta={stats.new_users_7d}     deltaLabel={t('admin.stat.last_7_days')} />
              <StatCard color="green"  icon={Briefcase}    label={t('admin.stat.vacancies')} value={stats.vacancies} delta={stats.new_vacancies_7d} deltaLabel={t('admin.stat.last_7_days')} />
              <StatCard color="purple" icon={FileText}     label={t('admin.stat.applications')} value={stats.applications} />
              <StatCard color="pink"   icon={MessageCircle} label={t('admin.stat.conversations')} value={stats.conversations} sub={t('admin.stat.messages_count', { n: stats.messages })} />
            </div>

            {/* Роли + статусы откликов */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center"><UserCheck className="w-5 h-5 mr-2 text-blue-500" /> {t('admin.dist.roles')}</h3>
                <DistributionBar items={[
                  { label: t('admin.dist.seekers'),   value: stats.roles.seeker,   color: 'bg-blue-500' },
                  { label: t('admin.dist.employers'), value: stats.roles.employer, color: 'bg-green-500' },
                  { label: t('admin.dist.admins'),    value: stats.roles.admin,    color: 'bg-red-500' },
                ]} />
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('admin.dist.banned')}</span>
                  <span className="font-bold text-red-600 dark:text-red-400">{stats.banned_users}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center"><Activity className="w-5 h-5 mr-2 text-purple-500" /> {t('admin.dist.statuses')}</h3>
                <DistributionBar items={[
                  { label: t('admin.dist.pending'),  value: stats.application_statuses.pending,  color: 'bg-yellow-500', icon: Clock },
                  { label: t('admin.dist.accepted'), value: stats.application_statuses.accepted, color: 'bg-green-500',  icon: CheckCircle2 },
                  { label: t('admin.dist.rejected'), value: stats.application_statuses.rejected, color: 'bg-red-500',    icon: XCircle },
                ]} />
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('admin.dist.favorites')}</span>
                  <span className="font-bold text-pink-600 dark:text-pink-400 flex items-center"><Heart className="w-4 h-4 mr-1" /> {stats.favorites}</span>
                </div>
              </div>
            </div>

            {/* Топы */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center"><MapPin className="w-5 h-5 mr-2 text-orange-500" /> {t('admin.top.cities')}</h3>
                {stats.top_cities.length === 0 ? (
                  <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">{t('common.no_data')}</p>
                ) : (
                  <ul className="space-y-2">
                    {stats.top_cities.map((c, i) => (
                      <li key={c.city} className="flex items-center justify-between py-1.5">
                        <span className="flex items-center gap-3 text-sm">
                          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold text-xs">{i + 1}</span>
                          <span className="font-medium text-gray-900 dark:text-white">{c.city}</span>
                        </span>
                        <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{c.cnt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-emerald-500" /> {t('admin.top.employers')}</h3>
                {stats.top_employers.length === 0 ? (
                  <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">{t('common.no_data')}</p>
                ) : (
                  <ul className="space-y-2">
                    {stats.top_employers.map((e, i) => (
                      <li key={e.id} className="flex items-center justify-between py-1.5">
                        <span className="flex items-center gap-3 text-sm min-w-0">
                          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex-shrink-0">{i + 1}</span>
                          <span className="font-medium text-gray-900 dark:text-white truncate">{e.name}</span>
                        </span>
                        <span className="text-sm font-bold text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">{e.vacancies_count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === 'resumes' ? (
          <div>
            {/* Панель инструментов */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('admin.search.resumes')}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className={selectCls}>
                <option value="all">{t('admin.filter.all_cities')}</option>
                {cityOptions(resumes).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="overflow-x-auto">
              {resumesView.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">{resumes.length === 0 ? t('admin.resume.empty') : t('admin.common.nothing_found')}</div>
              ) : (
                <table className="min-w-[950px] w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      {sortHead(t('admin.resume.col.name'), 'surname', 'px-3 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider')}
                      {sortHead(t('admin.resume.col.profession'), 'profession', 'px-3 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider')}
                      {sortHead(t('admin.resume.col.city'), 'city', 'px-3 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider')}
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{t('admin.resume.col.phone')}</th>
                      {sortHead(t('admin.resume.col.education'), 'education_level', 'px-3 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[140px]')}
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[160px]">{t('admin.resume.col.skills')}</th>
                      {sortHead(t('admin.resume.col.updated'), 'updated_at', 'px-3 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap')}
                      <th className="px-3 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {resumesView.map(r => {
                      const fio = [r.surname, r.first_name, r.patronymic].filter(Boolean).join(' ') || r.user_name;
                      const edu = [r.education_level, r.education_institution].filter(Boolean).join(', ');
                      return (
                        <tr key={r.id} onClick={() => setResumeModal({ show: true, data: r })} title={t('admin.resume.view')}
                            className="hover:bg-blue-50/60 dark:hover:bg-gray-700/50 transition-colors align-top cursor-pointer">
                          <td className="px-3 py-3 text-sm font-medium text-gray-900 dark:text-white">
                            {fio}
                            <div className="text-xs font-normal text-gray-400 dark:text-gray-500">{r.user_email}</div>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-700 dark:text-gray-300">{r.profession || <span className="text-gray-400 italic">—</span>}</td>
                          <td className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400">{r.city || '—'}</td>
                          <td className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{r.phone || '—'}</td>
                          <td className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400">{edu || <span className="text-gray-400 italic">—</span>}</td>
                          <td className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400">
                            <span className="block truncate max-w-[220px]" title={r.skills || ''}>{r.skills || <span className="text-gray-400 italic">—</span>}</span>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{fmtDate(r.updated_at) || '—'}</td>
                          <td className="px-3 py-3 text-right"><Eye className="w-4 h-4 text-blue-500 dark:text-blue-400 inline-block" /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ) : activeTab === 'users' ? (
          <div>
            {/* Панель инструментов */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('admin.search.users')}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className={selectCls}>
                <option value="all">{t('admin.filter.all_roles')}</option>
                <option value="seeker">{t('admin.dist.seekers')}</option>
                <option value="employer">{t('admin.dist.employers')}</option>
                <option value="admin">{t('admin.dist.admins')}</option>
              </select>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={selectCls}>
                <option value="all">{t('admin.filter.all_statuses')}</option>
                <option value="active">{t('admin.users.active')}</option>
                <option value="banned">{t('admin.filter.banned')}</option>
              </select>
              <button
                onClick={() => setShowAdminForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('admin.users.add_admin')}
              </button>
            </div>

            {showAdminForm && (
              <div className="mb-4 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 relative">
                <button
                  onClick={() => setShowAdminForm(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('admin.users.add_admin_form_title')}</h3>
                <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    placeholder={t('common.name')}
                    value={adminForm.name}
                    onChange={e => setAdminForm({...adminForm, name: e.target.value})}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <input
                    type="email"
                    required
                    placeholder={t('common.email')}
                    value={adminForm.email}
                    onChange={e => setAdminForm({...adminForm, email: e.target.value})}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <input
                      type="password"
                      required
                      placeholder={t('common.password')}
                      value={adminForm.password}
                      onChange={e => setAdminForm({...adminForm, password: e.target.value})}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <button type="submit" disabled={submittingAdmin} className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-60 disabled:cursor-not-allowed">
                      {submittingAdmin && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {submittingAdmin ? t('admin.users.creating') : t('admin.users.create_button')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    {sortHead(t('common.id'), 'id', 'px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider')}
                    {sortHead(t('admin.users.col.name'), 'name', 'px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider')}
                    {sortHead(t('admin.users.col.email'), 'email', 'px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider')}
                    {sortHead(t('admin.users.col.role'), 'role', 'px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider')}
                    {sortHead(t('admin.users.col.registered'), 'created_at', 'px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider')}
                    {sortHead(t('admin.users.col.status'), 'banned_until', 'px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider')}
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {usersView.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{u.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{u.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{roleBadge(u.role)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{fmtDate(u.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {u.banned_until ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                            {u.banned_until.startsWith('9999') ? t('admin.users.banned_forever') : t('admin.users.banned_until', { date: fmtDate(u.banned_until) })}
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                            {t('admin.users.active')}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => openUserDetails(u)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-lg transition-colors" title={t('admin.userinfo.details')}>
                            <Info className="w-5 h-5" />
                          </button>
                          {u.id !== user.id && (
                            <>
                              <button onClick={() => openUserDialogs(u)} className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 p-2 rounded-lg transition-colors" title={t('admin.msg.open_title')}>
                                <MessageCircle className="w-5 h-5" />
                              </button>
                              {u.banned_until ? (
                                <button onClick={() => handleBanUser('unban', u.id)} disabled={busyUserId === u.id} className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 p-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed" title={t('admin.users.unban_title')}>
                                  {busyUserId === u.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                </button>
                              ) : (
                                <button onClick={() => setBanModal({ show: true, userId: u.id })} disabled={busyUserId === u.id} className="text-orange-500 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 p-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed" title={t('admin.users.ban_title')}>
                                  <Ban className="w-5 h-5" />
                                </button>
                              )}
                              <button onClick={() => handleDeleteUser(u.id)} disabled={busyUserId === u.id} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 p-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed" title={t('common.delete')}>
                                {busyUserId === u.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {usersView.length === 0 && <div className="text-center py-10 text-gray-500 dark:text-gray-400">{users.length === 0 ? t('admin.users.empty') : t('admin.common.nothing_found')}</div>}
            </div>

            {banModal.show && (
              <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-sm w-full border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-bold mb-4 dark:text-white">{t('admin.users.ban_modal.title')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{t('admin.users.ban_modal.desc')}</p>
                  <div className="space-y-2">
                    <button onClick={() => handleBanUser('1_day')} className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium text-left dark:text-gray-200">{t('admin.users.ban.1_day')}</button>
                    <button onClick={() => handleBanUser('1_week')} className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium text-left dark:text-gray-200">{t('admin.users.ban.1_week')}</button>
                    <button onClick={() => handleBanUser('1_month')} className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium text-left dark:text-gray-200">{t('admin.users.ban.1_month')}</button>
                    <button onClick={() => handleBanUser('permanent')} className="w-full py-2 px-4 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg font-medium text-left">{t('admin.users.ban.permanent')}</button>
                  </div>
                  <button onClick={() => setBanModal({ show: false, userId: null })} className="mt-6 w-full py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium">{t('common.cancel')}</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Панель инструментов */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('admin.search.vacancies')}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className={selectCls}>
                <option value="all">{t('admin.filter.all_cities')}</option>
                {cityOptions(vacancies).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    {sortHead(t('common.id'), 'id', 'px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider')}
                    {sortHead(t('admin.vac.col.title'), 'title', 'px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider')}
                    {sortHead(t('admin.resume.col.city'), 'city', 'px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider')}
                    {sortHead(t('admin.vac.col.employer'), 'employer_name', 'px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider')}
                    {sortHead(t('admin.vac.col.published'), 'created_at', 'px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider')}
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {vacanciesView.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{v.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{v.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{v.city || '—'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{v.employer_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{fmtDate(v.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => onEditVacancy(v.id)} className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 p-2 rounded-lg transition-colors" title={t('common.edit')}>
                            <Edit className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDeleteVacancy(v.id)} disabled={busyVacancyId === v.id} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 p-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed" title={t('common.delete')}>
                            {busyVacancyId === v.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {vacanciesView.length === 0 && <div className="text-center py-10 text-gray-500 dark:text-gray-400">{vacancies.length === 0 ? t('admin.vac.empty') : t('admin.common.nothing_found')}</div>}
            </div>
          </div>
        )}
      </div>

      {/* Просмотрщик диалогов/сообщений */}
      {msgModal.show && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeMsgModal}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-gray-100 dark:border-gray-700" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 min-w-0">
                {msgModal.view === 'messages' && msgModal.fromUser && (
                  <button onClick={() => setMsgModal(prev => ({ ...prev, view: 'list' }))} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap">{t('admin.msg.back')}</button>
                )}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {msgModal.view === 'list' ? `${t('admin.msg.user_dialogs')}: ${msgModal.userName}` : msgModal.convTitle}
                </h3>
              </div>
              <button onClick={closeMsgModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 overflow-y-auto">
              {msgLoading ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
              ) : msgModal.view === 'list' ? (
                userConvs.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 dark:text-gray-400">{t('admin.msg.no_dialogs')}</div>
                ) : (
                  <ul className="space-y-2">
                    {userConvs.map(c => (
                      <li key={c.id}>
                        <button onClick={() => loadConvMessages(c.id, convTitleOf(c), true)} className="w-full text-left p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-gray-900 dark:text-white truncate">{c.seeker_name} ↔ {c.employer_name}</span>
                            <span className="text-xs text-gray-400 flex-shrink-0">{c.messages_count} · {fmtDate(c.updated_at)}</span>
                          </div>
                          {c.vacancy_title && <div className="text-xs text-blue-600 dark:text-blue-400 truncate mt-0.5">{c.vacancy_title}</div>}
                          {c.last_message && <div className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">{c.last_message}</div>}
                        </button>
                      </li>
                    ))}
                  </ul>
                )
              ) : (
                convMessages.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 dark:text-gray-400">{t('admin.msg.no_messages')}</div>
                ) : (
                  <div className="space-y-3">
                    {convMessages.map(m => (
                      m.type === 'system' ? (
                        <div key={m.id} className="text-center">
                          <span className="inline-block text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">{m.body}</span>
                        </div>
                      ) : (
                        <div key={m.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">{m.sender_name || '—'}</span>
                            <span className="text-xs text-gray-400 flex-shrink-0">{new Date(m.created_at).toLocaleString(locale)}</span>
                          </div>
                          <div className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">{m.body}</div>
                        </div>
                      )
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Полный просмотр резюме */}
      {resumeModal.show && resumeModal.data && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setResumeModal({ show: false, data: null })}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-gray-100 dark:border-gray-700" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{[resumeModal.data.surname, resumeModal.data.first_name, resumeModal.data.patronymic].filter(Boolean).join(' ') || resumeModal.data.user_name}</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{resumeModal.data.user_email}</p>
              </div>
              <button onClick={() => setResumeModal({ show: false, data: null })} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {resumeFields(resumeModal.data).map(([label, value]) => (
                  <div key={label}>
                    <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</div>
                    <div className="text-sm text-gray-900 dark:text-gray-100 break-words">{value}</div>
                  </div>
                ))}
              </div>
              {resumeModal.data.skills && (
                <div>
                  <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{t('admin.resume.col.skills')}</div>
                  <div className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">{resumeModal.data.skills}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Подробная карточка пользователя */}
      {userModal.show && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setUserModal({ show: false, loading: false, data: null })}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[85vh] flex flex-col border border-gray-100 dark:border-gray-700" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('admin.userinfo.title')}</h3>
              <button onClick={() => setUserModal({ show: false, loading: false, data: null })} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              {userModal.loading || !userModal.data ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    {userModal.data.avatar ? (
                      <img src={userModal.data.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover border border-gray-200 dark:border-gray-600" />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl font-bold">{(userModal.data.name || '?').charAt(0).toUpperCase()}</div>
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-gray-900 dark:text-white truncate">{userModal.data.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{userModal.data.email}</div>
                      <div className="mt-1">{roleBadge(userModal.data.role)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('admin.users.col.registered')}</div>
                      <div className="font-medium text-gray-900 dark:text-white">{fmtDate(userModal.data.created_at) || '—'}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('admin.users.col.status')}</div>
                      <div className={`font-medium ${userModal.data.banned_until ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {userModal.data.banned_until ? (String(userModal.data.banned_until).startsWith('9999') ? t('admin.users.banned_forever') : t('admin.users.banned_until', { date: fmtDate(userModal.data.banned_until) })) : t('admin.users.active')}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                      <div className="text-lg font-black text-blue-600 dark:text-blue-400">{userModal.data.vacancies_count ?? 0}</div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">{t('admin.userinfo.vacancies')}</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2">
                      <div className="text-lg font-black text-purple-600 dark:text-purple-400">{userModal.data.applications_count ?? 0}</div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">{t('admin.userinfo.applications')}</div>
                    </div>
                    <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-2">
                      <div className="text-lg font-black text-pink-600 dark:text-pink-400">{userModal.data.favorites_count ?? 0}</div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">{t('admin.userinfo.favorites')}</div>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-2">
                      <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{userModal.data.conversations_count ?? 0}</div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">{t('admin.userinfo.conversations')}</div>
                    </div>
                  </div>

                  {/* Резюме соискателя — с кнопкой полного просмотра */}
                  {userModal.data.resume ? (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-sm">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('admin.userinfo.resume')}</div>
                        <button onClick={openResumeFromUser} className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium flex-shrink-0">
                          <Eye className="w-4 h-4" /> {t('admin.resume.view')}
                        </button>
                      </div>
                      <div className="text-gray-900 dark:text-gray-100">{[userModal.data.resume.profession, userModal.data.resume.city, userModal.data.resume.phone].filter(Boolean).join(' · ') || '—'}</div>
                    </div>
                  ) : userModal.data.role === 'seeker' ? (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-sm">
                      <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{t('admin.userinfo.resume')}</div>
                      <div className="text-gray-400 dark:text-gray-500 italic">{t('admin.userinfo.no_resume')}</div>
                    </div>
                  ) : null}

                  {/* Вакансии работодателя — с модерацией (редактировать / удалить) */}
                  {userModal.data.role === 'employer' && (
                    <div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">{t('admin.userinfo.vacancies_list')}</div>
                      {(!userModal.data.vacancies || userModal.data.vacancies.length === 0) ? (
                        <div className="text-sm text-gray-400 dark:text-gray-500 italic">{t('admin.vac.empty')}</div>
                      ) : (
                        <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {userModal.data.vacancies.map(v => (
                            <li key={v.id} className="flex items-center justify-between gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{v.title}</div>
                                <div className="text-xs text-gray-400 dark:text-gray-500">{[v.city, fmtDate(v.created_at)].filter(Boolean).join(' · ')}</div>
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <button onClick={() => { setUserModal({ show: false, loading: false, data: null }); onEditVacancy(v.id); }} className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 p-1.5 rounded-lg transition-colors" title={t('common.edit')}>
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleModalDeleteVacancy(v.id)} disabled={busyVacancyId === v.id} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 p-1.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed" title={t('common.delete')}>
                                  {busyVacancyId === v.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const STAT_PALETTE = {
  blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',     iconBg: 'bg-blue-500',   text: 'text-blue-600 dark:text-blue-400',     border: 'border-blue-100 dark:border-blue-800/40' },
  green:  { bg: 'bg-green-50 dark:bg-green-900/20',   iconBg: 'bg-green-500',  text: 'text-green-600 dark:text-green-400',   border: 'border-green-100 dark:border-green-800/40' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', iconBg: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-800/40' },
  pink:   { bg: 'bg-pink-50 dark:bg-pink-900/20',     iconBg: 'bg-pink-500',   text: 'text-pink-600 dark:text-pink-400',     border: 'border-pink-100 dark:border-pink-800/40' },
};

function StatCard({ color, icon: Icon, label, value, delta, deltaLabel, sub }) {
  const p = STAT_PALETTE[color] || STAT_PALETTE.blue;
  return (
    <div className={`${p.bg} p-5 rounded-2xl border ${p.border}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2.5 ${p.iconBg} rounded-xl text-white shadow-md`}>
          <Icon className="w-5 h-5" />
        </div>
        {delta != null && delta > 0 && (
          <span className="inline-flex items-center text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
            +{delta} <span className="ml-1 font-medium text-green-500 dark:text-green-500/80">{deltaLabel}</span>
          </span>
        )}
      </div>
      <p className={`text-xs font-bold uppercase tracking-wider ${p.text}`}>{label}</p>
      <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function DistributionBar({ items }) {
  const total = items.reduce((s, i) => s + (i.value || 0), 0);
  return (
    <div className="space-y-3">
      <div className="flex h-3 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        {items.map((it, idx) => {
          const pct = total > 0 ? (it.value / total) * 100 : 0;
          if (pct === 0) return null;
          return <div key={idx} className={it.color} style={{ width: `${pct}%` }} title={`${it.label}: ${it.value}`} />;
        })}
      </div>
      <ul className="space-y-2">
        {items.map((it, idx) => {
          const pct = total > 0 ? Math.round((it.value / total) * 100) : 0;
          return (
            <li key={idx} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${it.color}`}></span>
                {it.icon && <it.icon className="w-4 h-4 text-gray-400 dark:text-gray-500" />}
                <span className="text-gray-700 dark:text-gray-300">{it.label}</span>
              </span>
              <span className="text-gray-900 dark:text-white font-bold">{it.value} <span className="text-gray-400 dark:text-gray-500 font-normal">({pct}%)</span></span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default AdminPanel;
