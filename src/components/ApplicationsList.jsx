import React, { useEffect, useState } from 'react';
import { FileText, User, Mail, Calendar, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { API_URL, UserRole } from '../constants';

const ApplicationsList = ({ user, onNavigate }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Сначала объявляем хук эффекта, но внутри делаем проверку
  useEffect(() => {
    // Если пользователя нет или он не работодатель, не делаем запрос
    if (!user || user.role !== UserRole.EMPLOYER) {
      setLoading(false);
      return;
    }
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_URL}/applications.php?employer_id=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/applications.php`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId, status: newStatus })
      });
      
      if (response.ok) {
        setApplications(prev => prev.map(app => 
          app.id === appId ? { ...app, status: newStatus } : app
        ));
      } else {
        const err = await response.json();
        console.error('Error update:', err);
        alert('Ошибка обновления статуса: ' + (err.message || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Ошибка сети. Проверьте консоль (F12) и убедитесь, что в db.php разрешен метод PATCH.');
    }
  };

  // 2. ЗАЩИТА РЕНДЕРИНГА:
  // Если это не работодатель — возвращаем null (компонент вообще не рисуется в DOM)
  if (!user || user.role !== UserRole.EMPLOYER) {
    return null;
  }

  if (loading) return <div className="text-center py-10">Загрузка...</div>;

  return (
    <div className="space-y-6 mt-6 max-w-7xl mx-auto">
       <button 
        onClick={() => onNavigate('home')} 
        className="inline-flex items-center px-4 py-2 bg-white border border-blue-600 text-blue-700 rounded-md hover:bg-blue-50 transition-colors font-medium shadow-sm mb-4"
      >
        <ArrowLeft className="h-5 w-5 mr-2" /> Назад
      </button>

      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Отклики на ваши вакансии</h2>
      
      {applications.length === 0 ? (
         <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
          <FileText className="mx-auto h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Нет откликов</h3>
          <p className="mt-2 text-gray-500">Пока никто не откликнулся на ваши вакансии.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {applications.map((app) => (
              <li key={app.id} className="hover:bg-blue-50 transition-colors">
                <div className="px-6 py-6 sm:px-8">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-blue-700 truncate">{app.vacancy_title}</p>
                    <div className="flex-shrink-0 flex items-center">
                      {app.status === 'pending' && <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"><Clock className="w-4 h-4 mr-1.5"/> Ожидает</span>}
                      {app.status === 'accepted' && <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800"><CheckCircle className="w-4 h-4 mr-1.5"/> Принят</span>}
                      {app.status === 'rejected' && <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800"><XCircle className="w-4 h-4 mr-1.5"/> Отклонен</span>}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="sm:flex sm:justify-between">
                      <div className="sm:flex flex-col space-y-2">
                        <p className="flex items-center text-base text-gray-900 font-bold">
                          <User className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                          {app.seeker_name}
                        </p>
                        <p className="flex items-center text-sm text-gray-600">
                          <Mail className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                          {app.seeker_email}
                        </p>
                         {app.phone && (
                          <p className="flex items-center text-sm text-gray-600 ml-6">
                            Тел: <span className="text-gray-900 ml-1">{app.phone}</span>
                          </p>
                        )}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 self-start">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p>{new Date(app.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                      <p className="text-sm"><strong className="text-gray-900">Профессия:</strong> {app.profession || 'Не указана'}</p>
                      <p className="mt-2 text-sm"><strong className="text-gray-900">Навыки:</strong> {app.skills || 'Не указаны'}</p>
                    </div>

                    {app.status === 'pending' && (
                      <div className="mt-6 flex space-x-4">
                        <button
                          onClick={() => handleStatusChange(app.id, 'accepted')}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-md text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Принять
                        </button>
                        <button
                           onClick={() => handleStatusChange(app.id, 'rejected')}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-md text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Отказать
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;