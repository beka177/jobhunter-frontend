
import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, LogOut, User, FileText, Bell, HelpCircle, List, Heart, ShieldAlert, Moon, Sun, MapPin } from 'lucide-react';
import { UserRole } from '../constants';

const CITIES = ['Астана', 'Алматы', 'Шымкент', 'Караганда', 'Актобе', 'Тараз', 'Павлодар', 'Оскемен', 'Семей', 'Все города'];

const Navbar = ({ user, onLogout, onNavigate, globalCity, onCityChange }) => {
  const [isDark, setIsDark] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

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
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title="Ваш город"
              >
                <MapPin className="h-5 w-5 mr-1" />
                <span className="max-w-[100px] truncate">{globalCity === 'Все города' || !globalCity ? 'Все города' : globalCity}</span>
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
                        {c}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Переключатель темы */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
              title={isDark ? "Светлая тема" : "Темная тема"}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Кнопка Помощь (Видна всем) */}
            <button
              onClick={() => onNavigate('help')}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Помощь"
            >
              <HelpCircle className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Помощь</span>
            </button>

            {user ? (
              <>
                <div className="flex items-center text-gray-600 dark:text-gray-300 hidden lg:flex text-sm font-medium border-r dark:border-gray-600 pr-4 mr-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-1 transition-colors" onClick={() => onNavigate('edit-profile')} title="Редактировать профиль">
                  {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover mr-2 border border-gray-200 dark:border-gray-600" />
                  ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-2">
                          <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </div>
                  )}
                  <span>
                      {user.name} <span className="text-gray-400 dark:text-gray-500 font-normal">({user.role === UserRole.ADMIN ? 'Администратор' : user.role === UserRole.EMPLOYER ? 'Работодатель' : 'Соискатель'})</span>
                  </span>
                </div>
                
                {user.role === UserRole.EMPLOYER && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onNavigate('my-vacancies')}
                      className="flex items-center px-4 py-2 rounded-md text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <List className="h-4 w-4 mr-2" />
                      <span className="hidden md:inline">Мои вакансии</span>
                    </button>
                    <button
                      onClick={() => onNavigate('applications')}
                      className="flex items-center px-4 py-2 rounded-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors shadow-sm"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="hidden md:inline">Отклики</span>
                    </button>
                    <button
                      onClick={() => onNavigate('create-vacancy')}
                      className="flex items-center px-4 py-2 rounded-md text-sm font-bold text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 shadow-sm transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="hidden md:inline">Вакансия</span>
                    </button>
                  </div>
                )}

                {user.role === UserRole.SEEKER && (
                  <>
                    <button
                      onClick={() => onNavigate('favorites')}
                      className="flex items-center px-4 py-2 rounded-md text-sm font-bold text-white bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 transition-colors shadow-sm"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      <span className="hidden md:inline">Избранное</span>
                    </button>
                    <button
                      onClick={() => onNavigate('resume')}
                      className="flex items-center px-4 py-2 rounded-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-colors shadow-sm"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="hidden md:inline">Резюме</span>
                    </button>
                    <button
                      onClick={() => onNavigate('seeker-applications')}
                      className="flex items-center px-4 py-2 rounded-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors shadow-sm"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      <span className="hidden md:inline">Отклики</span>
                    </button>
                  </>
                )}
                
                {user.role === UserRole.ADMIN && (
                  <button
                    onClick={() => onNavigate('admin-panel')}
                    className="flex items-center px-4 py-2 rounded-md text-sm font-bold text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors shadow-sm"
                  >
                    <ShieldAlert className="h-4 w-4 mr-2 text-red-400" />
                    <span className="hidden md:inline">Админ панель</span>
                  </button>
                )}
                
                {/* Кнопка ВЫЙТИ */}
                <button
                  onClick={onLogout}
                  className="flex items-center px-4 py-2 rounded-md text-sm font-bold text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 ml-2 shadow-md transition-all transform hover:scale-105"
                  title="Выйти из аккаунта"
                >
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">ВЫЙТИ</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center px-6 py-2 border border-transparent text-sm font-bold rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm transition-colors"
              >
                <User className="h-4 w-4 mr-2" /> Войти
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
