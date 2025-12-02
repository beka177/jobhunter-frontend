import React from 'react';
import { Briefcase, Plus, LogOut, User, FileText } from 'lucide-react';
import { UserRole } from '../constants';

const Navbar = ({ user, onLogout, onNavigate }) => (
  <nav className="bg-white shadow-sm sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
          <Briefcase className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">JobHunter</span>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-600 hidden sm:block text-sm">
                {user.name} ({user.role === UserRole.EMPLOYER ? 'Работодатель' : 'Соискатель'})
              </span>
              
              {user.role === UserRole.EMPLOYER && (
                <>
                  <button
                    onClick={() => onNavigate('applications')}
                    className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                  >
                    <FileText className="h-4 w-4 mr-1" /> Отклики
                  </button>
                  <button
                    onClick={() => onNavigate('create-vacancy')}
                    className="flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Вакансия
                  </button>
                </>
              )}

              {user.role === UserRole.SEEKER && (
                 <button
                    onClick={() => onNavigate('resume')}
                    className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                  >
                    <FileText className="h-4 w-4 mr-1" /> Мое резюме
                  </button>
              )}
              
              <button
                onClick={onLogout}
                className="flex items-center text-gray-500 hover:text-gray-700"
                title="Выход"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
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