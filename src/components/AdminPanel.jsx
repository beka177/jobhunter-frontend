import React, { useState, useEffect } from 'react';
import { Trash2, Users, Briefcase, ShieldAlert, Plus, X, BarChart3, Edit, Ban, CheckCircle2, Loader2, MessageCircle, MapPin, TrendingUp, Heart, FileText, UserCheck, Clock, XCircle, Activity } from 'lucide-react';
import { API_URL } from '../constants';
import { useToast } from '../toast.jsx';
import { useT } from '../i18n.jsx';

const AdminPanel = ({ user, onNavigate, onEditVacancy }) => {
  const toast = useToast();
  const { t, lang } = useT();
  const [activeTab, setActiveTab] = useState('stats');
  const [users, setUsers] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [conversations, setConversations] = useState([]);
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
  const [busyConvId, setBusyConvId] = useState(null);
  const [submittingAdmin, setSubmittingAdmin] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      onNavigate('home');
      return;
    }
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
        if (tab === 'conversations') setConversations(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (id) => {
    if (!window.confirm(t('admin.conv.confirm_delete'))) return;
    setBusyConvId(id);
    try {
      const response = await fetch(`${API_URL}/admin.php?action=conversation&id=${id}&admin_id=${user.id}`, { method: 'DELETE' });
      if (response.ok) {
        setConversations(prev => prev.filter(c => c.id !== id));
        toast.success(t('admin.conv.toast.deleted'));
      } else {
        toast.error(t('admin.users.toast.delete_error'));
      }
    } catch (e) {
      toast.error(t('common.network_error'));
    } finally {
      setBusyConvId(null);
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
          { id: 'conversations', icon: MessageCircle, labelKey: 'admin.tab.conversations' },
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
        ) : activeTab === 'conversations' ? (
          <div className="overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('admin.conv.title')}</h3>
            {conversations.length === 0 ? (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">{t('admin.conv.empty')}</div>
            ) : (
              <table className="min-w-[950px] w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">{t('common.id')}</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.conv.col.seeker')}</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.conv.col.employer')}</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[100px]">{t('admin.conv.col.vacancy')}</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">{t('admin.conv.col.msgs')}</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.conv.col.last_msg')}</th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{t('admin.conv.col.updated')}</th>
                    <th className="px-2 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {conversations.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-2 py-3 text-sm text-gray-500 dark:text-gray-400">{c.id}</td>
                      <td className="px-2 py-3 text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">{c.seeker_name}</td>
                      <td className="px-2 py-3 text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">{c.employer_name}</td>
                      <td className="px-2 py-3 text-sm text-blue-600 dark:text-blue-400 truncate max-w-[130px]">{c.vacancy_title || <span className="text-gray-400 dark:text-gray-500 italic">—</span>}</td>
                      <td className="px-2 py-3 text-sm text-gray-500 dark:text-gray-400">{c.messages_count}</td>
                      <td className="px-2 py-3 text-sm text-gray-500 dark:text-gray-400 truncate max-w-[160px]">{c.last_message || <span className="italic">{t('common.empty')}</span>}</td>
                      <td className="px-2 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{new Date(c.updated_at).toLocaleString(lang === 'kk' ? 'kk-KZ' : 'ru-RU')}</td>
                      <td className="px-2 py-3 text-right w-20">
                        <button
                          onClick={() => handleDeleteConversation(c.id)}
                          disabled={busyConvId === c.id}
                          className="inline-flex items-center justify-center text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 p-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          title={t('admin.conv.delete_title')}
                        >
                          {busyConvId === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : activeTab === 'users' ? (
          <div className="overflow-x-auto">
            <div className="p-4 flex justify-end">
              <button
                onClick={() => setShowAdminForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('admin.users.add_admin')}
              </button>
            </div>
            
            {showAdminForm && (
              <div className="m-4 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 relative">
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

            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('common.id')}</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.users.col.name')}</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.users.col.email')}</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.users.col.role')}</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.users.col.registered')}</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.users.col.status')}</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{u.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{u.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        u.role === 'admin' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                        u.role === 'employer' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(u.created_at).toLocaleDateString(lang === 'kk' ? 'kk-KZ' : 'ru-RU')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {u.banned_until ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                          {u.banned_until.startsWith('9999') ? t('admin.users.banned_forever') : t('admin.users.banned_until', { date: new Date(u.banned_until).toLocaleDateString(lang === 'kk' ? 'kk-KZ' : 'ru-RU') })}
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                          {t('admin.users.active')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {u.id !== user.id && (
                        <div className="flex justify-end space-x-2">
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
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <div className="text-center py-10 text-gray-500 dark:text-gray-400">{t('admin.users.empty')}</div>}

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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('common.id')}</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.vac.col.title')}</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.vac.col.employer')}</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.vac.col.published')}</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {vacancies.map(v => (
                  <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{v.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{v.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{v.employer_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(v.created_at).toLocaleDateString(lang === 'kk' ? 'kk-KZ' : 'ru-RU')}</td>
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
            {vacancies.length === 0 && <div className="text-center py-10 text-gray-500 dark:text-gray-400">{t('admin.vac.empty')}</div>}
          </div>
        )}
      </div>
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
