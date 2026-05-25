import React, { useState, useEffect } from 'react';
import { Trash2, Users, Briefcase, ShieldAlert, Plus, X, BarChart3, Edit, Ban, CheckCircle2, Loader2 } from 'lucide-react';
import { API_URL } from '../constants';
import { useToast } from '../toast.jsx';

const AdminPanel = ({ user, onNavigate, onEditVacancy }) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('stats');
  const [users, setUsers] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [stats, setStats] = useState({ users: 0, vacancies: 0, applications: 0 });
  const [loading, setLoading] = useState(true);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' });
  const [banModal, setBanModal] = useState({ show: false, userId: null });
  const [busyUserId, setBusyUserId] = useState(null);
  const [busyVacancyId, setBusyVacancyId] = useState(null);
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
        toast.success(duration === 'unban' ? 'Пользователь разблокирован' : 'Пользователь заблокирован');
        fetchData('users');
      } else {
        toast.error('Ошибка блокировки');
      }
    } catch (error) {
      toast.error('Ошибка сети');
    } finally {
      setBusyUserId(null);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя? Все его вакансии и отклики также будут удалены.')) return;
    setBusyUserId(id);
    try {
      const response = await fetch(`${API_URL}/admin.php?action=user&id=${id}&admin_id=${user.id}`, { method: 'DELETE' });
      if (response.ok) {
        setUsers(users.filter(u => u.id !== id));
        toast.success('Пользователь удалён');
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || 'Ошибка удаления');
      }
    } catch (error) {
      toast.error('Ошибка сети');
    } finally {
      setBusyUserId(null);
    }
  };

  const handleDeleteVacancy = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту вакансию?')) return;
    setBusyVacancyId(id);
    try {
      const response = await fetch(`${API_URL}/admin.php?action=vacancy&id=${id}&admin_id=${user.id}`, { method: 'DELETE' });
      if (response.ok) {
        setVacancies(vacancies.filter(v => v.id !== id));
        toast.success('Вакансия удалена');
      } else {
        toast.error('Ошибка удаления');
      }
    } catch (error) {
      toast.error('Ошибка сети');
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
        toast.success('Администратор успешно добавлен!');
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || 'Ошибка создания');
      }
    } catch (error) {
      toast.error('Ошибка сети');
    } finally {
      setSubmittingAdmin(false);
    }
  };

  if (user?.role !== 'admin') return null;

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mt-8">
      <div className="bg-gray-900 dark:bg-gray-950 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center text-white">
          <ShieldAlert className="w-8 h-8 mr-3 text-red-500" />
          <h1 className="text-2xl font-bold">Панель администратора</h1>
        </div>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-4 px-6 text-center font-bold text-sm uppercase tracking-wider transition-colors ${
            activeTab === 'stats' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-500' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
        >
          <BarChart3 className="w-5 h-5 inline-block mr-2 mb-1" />
          Статистика
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-4 px-6 text-center font-bold text-sm uppercase tracking-wider transition-colors ${
            activeTab === 'users' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-500' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
        >
          <Users className="w-5 h-5 inline-block mr-2 mb-1" />
          Пользователи
        </button>
        <button
          onClick={() => setActiveTab('vacancies')}
          className={`flex-1 py-4 px-6 text-center font-bold text-sm uppercase tracking-wider transition-colors ${
            activeTab === 'vacancies' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-500' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
        >
          <Briefcase className="w-5 h-5 inline-block mr-2 mb-1" />
          Вакансии
        </button>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">Загрузка данных...</div>
        ) : activeTab === 'stats' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex items-center">
              <div className="p-4 bg-blue-500 rounded-full text-white mr-4">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase">Пользователей</p>
                <p className="text-4xl font-black text-gray-900 dark:text-white">{stats.users}</p>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-800/50 flex items-center">
              <div className="p-4 bg-green-500 rounded-full text-white mr-4">
                <Briefcase className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-green-600 dark:text-green-400 uppercase">Вакансий</p>
                <p className="text-4xl font-black text-gray-900 dark:text-white">{stats.vacancies}</p>
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-800/50 flex items-center">
              <div className="p-4 bg-purple-500 rounded-full text-white mr-4">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase">Откликов</p>
                <p className="text-4xl font-black text-gray-900 dark:text-white">{stats.applications}</p>
              </div>
            </div>
          </div>
        ) : activeTab === 'users' ? (
          <div className="overflow-x-auto">
            <div className="p-4 flex justify-end">
              <button 
                onClick={() => setShowAdminForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить администратора
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
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Новый администратор</h3>
                <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Имя"
                    value={adminForm.name}
                    onChange={e => setAdminForm({...adminForm, name: e.target.value})}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={adminForm.email}
                    onChange={e => setAdminForm({...adminForm, email: e.target.value})}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <input
                      type="password"
                      required
                      placeholder="Пароль"
                      value={adminForm.password}
                      onChange={e => setAdminForm({...adminForm, password: e.target.value})}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <button type="submit" disabled={submittingAdmin} className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-60 disabled:cursor-not-allowed">
                      {submittingAdmin && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {submittingAdmin ? 'Создание...' : 'Создать'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Имя</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Роль</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Дата регистрации</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Статус</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Действия</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {u.banned_until ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                          Бан {u.banned_until.startsWith('9999') ? 'навсегда' : `до ${new Date(u.banned_until).toLocaleDateString()}`}
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                          Активен
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {u.id !== user.id && (
                        <div className="flex justify-end space-x-2">
                          {u.banned_until ? (
                            <button onClick={() => handleBanUser('unban', u.id)} disabled={busyUserId === u.id} className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 p-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed" title="Разблокировать">
                              {busyUserId === u.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                            </button>
                          ) : (
                            <button onClick={() => setBanModal({ show: true, userId: u.id })} disabled={busyUserId === u.id} className="text-orange-500 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 p-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed" title="Заблокировать">
                              <Ban className="w-5 h-5" />
                            </button>
                          )}
                          <button onClick={() => handleDeleteUser(u.id)} disabled={busyUserId === u.id} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 p-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed" title="Удалить">
                            {busyUserId === u.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <div className="text-center py-10 text-gray-500 dark:text-gray-400">Нет пользователей</div>}

            {banModal.show && (
              <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-sm w-full border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-bold mb-4 dark:text-white">Блокировка пользователя</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Выберите срок блокировки:</p>
                  <div className="space-y-2">
                    <button onClick={() => handleBanUser('1_day')} className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium text-left dark:text-gray-200">На 1 день</button>
                    <button onClick={() => handleBanUser('1_week')} className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium text-left dark:text-gray-200">На 1 неделю</button>
                    <button onClick={() => handleBanUser('1_month')} className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium text-left dark:text-gray-200">На 1 месяц</button>
                    <button onClick={() => handleBanUser('permanent')} className="w-full py-2 px-4 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg font-medium text-left">Навсегда</button>
                  </div>
                  <button onClick={() => setBanModal({ show: false, userId: null })} className="mt-6 w-full py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium">Отмена</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Название</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Работодатель</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Дата публикации</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {vacancies.map(v => (
                  <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{v.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{v.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{v.employer_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(v.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => onEditVacancy(v.id)} className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 p-2 rounded-lg transition-colors" title="Редактировать">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteVacancy(v.id)} disabled={busyVacancyId === v.id} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 p-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed" title="Удалить">
                          {busyVacancyId === v.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {vacancies.length === 0 && <div className="text-center py-10 text-gray-500 dark:text-gray-400">Нет вакансий</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
