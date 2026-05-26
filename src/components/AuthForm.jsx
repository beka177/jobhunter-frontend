import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { API_URL, UserRole } from '../constants';
import { useToast } from '../toast.jsx';
import { useT } from '../i18n.jsx';

const AuthForm = ({ isRegister = false, onSuccess, onNavigate }) => {
  const toast = useToast();
  const { t } = useT();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(''); // Новое поле для аватара
  const [role, setRole] = useState(UserRole.SEEKER);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const action = isRegister ? 'register' : 'login';
    const body = { email, password };
    
    if (isRegister) {
      body.name = name;
      body.avatar = avatar; // Отправляем аватар
      body.role = role;
    }

    try {
      const response = await fetch(`${API_URL}/auth.php?action=${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegister) {
          toast.success(t('auth.success_register'));
          onNavigate('login');
        } else {
          onSuccess(data.user);
        }
      } else {
        setError(data.message || t('auth.error_default'));
      }
    } catch (err) {
      setError(t('auth.error_connection'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 relative pt-12 md:pt-0">
      <button
        onClick={() => onNavigate('landing')}
        className="absolute top-4 left-4 md:top-8 md:left-8 inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors font-medium shadow-sm"
      >
        <ArrowLeft className="h-5 w-5 mr-2" /> {t('common.back_home')}
      </button>

      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 mt-8 md:mt-0 transition-colors">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {isRegister ? t('auth.register.title') : t('auth.login.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {isRegister ? t('auth.has_account') + ' ' : t('auth.no_account') + ' '}
            <span
              onClick={() => onNavigate(isRegister ? 'login' : 'register')}
              className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 cursor-pointer transition-colors"
            >
              {isRegister ? t('auth.login_button') : t('auth.register_button')}
            </span>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 dark:border-red-500 p-4 rounded-r">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            {isRegister && (
              <>
                <div>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="appearance-none rounded-t-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors bg-white dark:bg-gray-700" placeholder={t('auth.your_name')} />
                </div>
                <div>
                  <input type="text" value={avatar} onChange={e => setAvatar(e.target.value)} className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors bg-white dark:bg-gray-700" placeholder={t('auth.avatar_url')} />
                </div>
              </>
            )}
            <div>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={`appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors bg-white dark:bg-gray-700 ${!isRegister && 'rounded-t-lg'}`} placeholder={t('auth.email')} />
            </div>
            <div>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className={`appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors bg-white dark:bg-gray-700 ${!isRegister && 'rounded-b-lg'}`} placeholder={t('auth.password')} />
            </div>
            {isRegister && (
              <div>
                <select value={role} onChange={e => setRole(e.target.value)} className="appearance-none rounded-b-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm cursor-pointer">
                  <option value={UserRole.SEEKER}>{t('auth.role_seeker')}</option>
                  <option value={UserRole.EMPLOYER}>{t('auth.role_employer')}</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex items-center justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] disabled:scale-100">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? t('auth.loading') : (isRegister ? t('auth.register_button') : t('auth.login_button'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;