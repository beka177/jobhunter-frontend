import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, LogOut, User, FileText, Bell, HelpCircle, List, Heart, ShieldAlert, Moon, Sun, MapPin, MessageCircle, Globe } from 'lucide-react';
import { UserRole, CITIES } from '../constants';
import { useT } from '../i18n.jsx';

const Navbar = ({ user, onLogout, onNavigate, globalCity, onCityChange, unreadMessages = 0 }) => {
  const { t, lang, setLang } = useT();
  const [isDark, setIsDark] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const roleLabel = user
    ? (user.role === UserRole.ADMIN ? t('role.admin')
      : user.role === UserRole.EMPLOYER ? t('role.employer')
      : t('role.seeker'))
    : '';

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 w-full transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Логотип */}
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">JobSearch</span>
          </div>

          {/* Меню */}
          <div className="flex items-center space-x-3">
            {/* Выбор города */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => { setIsCityDropdownOpen(!isCityDropdownOpen); setIsLangOpen(false); }}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title={t('nav.city_title')}
              >
                <MapPin className="h-5 w-5 mr-1" />
                <span className="max-w-[100px] truncate">{globalCity === 'Все города' || !globalCity ? t('common.all_cities') : globalCity}</span>
              </button>

              {isCityDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsCityDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-1">
                    {CITIES.map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          onCityChange(c === 'Все города' ? '' : c);
                          setIsCityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${globalCity === c || (c === 'Все города' && !globalCity) ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} transition-colors`}
                      >
                        {c === 'Все города' ? t('common.all_cities') : c}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Переключатель языка */}
            <div className="relative">
              <button
                onClick={() => { setIsLangOpen(!isLangOpen); setIsCityDropdownOpen(false); }}
                className="flex items-center px-2 py-2 rounded-md text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors uppercase"
                title="Language / Тіл"
              >
                <Globe className="h-4 w-4 mr-1" />
                {lang === 'kk' ? 'KZ' : 'RU'}
              </button>
              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-1">
                    <button onClick={() => { setLang('ru'); setIsLangOpen(false); }} className={`w-full text-left px-4 py-2 text-sm ${lang === 'ru' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{t('lang.ru')}</button>
                    <button onClick={() => { setLang('kk'); setIsLangOpen(false); }} className={`w-full text-left px-4 py-2 text-sm ${lang === 'kk' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{t('lang.kk')}</button>
                  </div>
                </>
              )}
            </div>

            {/* Переключатель темы */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
              title={isDark ? t('nav.light_mode') : t('nav.dark_mode')}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Помощь */}
            <button
              onClick={() => onNavigate('help')}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title={t('nav.help')}
            >
              <HelpCircle className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">{t('nav.help')}</span>
            </button>

            {user ? (
              <>
                {(user.role === UserRole.SEEKER || user.role === UserRole.EMPLOYER) && (
                  <button
                    onClick={() => onNavigate('messages')}
                    className="relative p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-gray-700 transition-colors"
                    title={t('nav.messages')}
                  >
                    <MessageCircle className="h-5 w-5" />
                    {unreadMessages > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800">
                        {unreadMessages > 99 ? '99+' : unreadMessages}
                      </span>
                    )}
                  </button>
                )}

                <div className="flex items-center text-gray-600 dark:text-gray-300 hidden lg:flex text-sm font-medium border-r dark:border-gray-600 pr-4 mr-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-1 transition-colors" onClick={() => onNavigate('edit-profile')} title={t('nav.profile_edit')}>
                  {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover mr-2 border border-gray-200 dark:border-gray-600" />
                  ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-2">
                          <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </div>
                  )}
                  <span>
                      {user.name} <span className="text-gray-400 dark:text-gray-500 font-normal">({roleLabel})</span>
                  </span>
                </div>

                {user.role === UserRole.EMPLOYER && (
                  <div className="flex items-center space-x-2">
                    <button onClick={() => onNavigate('my-vacancies')} className="flex items-center px-4 py-2 rounded-md text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors shadow-sm">
                      <List className="h-4 w-4 mr-2" />
                      <span className="hidden md:inline">{t('nav.my_vacancies')}</span>
                    </button>
                    <button onClick={() => onNavigate('applications')} className="flex items-center px-4 py-2 rounded-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors shadow-sm">
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="hidden md:inline">{t('nav.applications_employer')}</span>
                    </button>
                    <button onClick={() => onNavigate('create-vacancy')} className="flex items-center px-4 py-2 rounded-md text-sm font-bold text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 shadow-sm transition-colors">
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="hidden md:inline">{t('nav.create_vacancy')}</span>
                    </button>
                  </div>
                )}

                {user.role === UserRole.SEEKER && (
                  <>
                    <button onClick={() => onNavigate('favorites')} className="flex items-center px-4 py-2 rounded-md text-sm font-bold text-white bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 transition-colors shadow-sm">
                      <Heart className="h-4 w-4 mr-2" />
                      <span className="hidden md:inline">{t('nav.favorites')}</span>
                    </button>
                    <button onClick={() => onNavigate('resume')} className="flex items-center px-4 py-2 rounded-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-colors shadow-sm">
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="hidden md:inline">{t('nav.resume')}</span>
                    </button>
                    <button onClick={() => onNavigate('seeker-applications')} className="flex items-center px-4 py-2 rounded-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors shadow-sm">
                      <Bell className="h-4 w-4 mr-2" />
                      <span className="hidden md:inline">{t('nav.applications_seeker')}</span>
                    </button>
                  </>
                )}

                {user.role === UserRole.ADMIN && (
                  <button onClick={() => onNavigate('admin-panel')} className="flex items-center px-4 py-2 rounded-md text-sm font-bold text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors shadow-sm">
                    <ShieldAlert className="h-4 w-4 mr-2 text-red-400" />
                    <span className="hidden md:inline">{t('nav.admin_panel')}</span>
                  </button>
                )}

                <button
                  onClick={onLogout}
                  className="flex items-center px-4 py-2 rounded-md text-sm font-bold text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 ml-2 shadow-md transition-all transform hover:scale-105"
                  title={t('nav.logout_title')}
                >
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">{t('nav.logout')}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center px-6 py-2 border border-transparent text-sm font-bold rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm transition-colors"
              >
                <User className="h-4 w-4 mr-2" /> {t('nav.login')}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
