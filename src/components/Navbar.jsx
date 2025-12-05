import React from 'react';
import { Briefcase, Plus, LogOut, User, FileText, Bell } from 'lucide-react';
import { UserRole } from '../constants';

const Navbar = ({ user, onLogout, onNavigate }) => (
  <nav className="bg-white shadow-sm sticky top-0 z-50 w-full">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        {/* Логотип (слева) */}
        <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
          <Briefcase className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">JobHunter</span>
        </div>

        {/* Меню (справа) */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              {/* Имя пользователя (скрыто на мобильных) */}
              <span className="text-gray-600 hidden sm:block text-sm font-medium border-r pr-4 mr-2">
                {user.name} <span className="text-gray-400 font-normal">({user.role === UserRole.EMPLOYER ? 'Работодатель' : 'Соискатель'})</span>
              </span>
              
              {/* Кнопки Работодателя */}
              {user.role === UserRole.EMPLOYER && (
                <>
                  <button
                    onClick={() => onNavigate('applications')}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                    title="Отклики на вакансии"
                  >
                    <FileText className="h-4 w-4 mr-1.5" />
                    <span className="hidden md:inline">Отклики</span>
                  </button>
                  <button
                    onClick={() => onNavigate('create-vacancy')}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-bold text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    <span className="hidden md:inline">Вакансия</span>
                  </button>
                </>
              )}

              {/* Кнопки Соискателя */}
              {user.role === UserRole.SEEKER && (
                <>
                 <button
                    onClick={() => onNavigate('resume')}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <FileText className="h-4 w-4 mr-1.5" />
                    <span className="hidden md:inline">Резюме</span>
                  </button>
                  <button
                    onClick={() => onNavigate('seeker-applications')}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                    title="Мои отклики"
                  >
                    <Bell className="h-4 w-4 mr-1.5" />
                    <span className="hidden md:inline">Отклики</span>
                  </button>
                </>
              )}
              
              {/* Кнопка Выход (БОЛЬШАЯ И КРАСНАЯ) */}
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 rounded-md text-sm font-bold text-white bg-red-600 hover:bg-red-700 ml-2 shadow-sm transition-colors"
                title="Выйти из аккаунта"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Выйти
              </button>
            </>
          ) : (
            /* Кнопка Войти (для гостей) */
            <button
              onClick={() => onNavigate('login')}
              className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
            >
              <User className="h-4 w-4 mr-2" /> Войти
            </button>
          )}
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;