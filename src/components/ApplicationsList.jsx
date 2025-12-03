import React, { useEffect, useState } from 'react';
import { FileText, User, Mail, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { API_URL, UserRole } from '../constants';

const ApplicationsList = ({ user }) => {
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

  if (applications.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow mt-6">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Нет откликов</h3>
        <p className="mt-1 text-sm text-gray-500">Пока никто не откликнулся на ваши вакансии.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-900">Отклики на ваши вакансии</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {applications.map((app) => (
            <li key={app.id} className="hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">{app.vacancy_title}</p>
                  <div className="flex-shrink-0 flex items-center">
                    {app.status === 'pending' && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1"/> Ожидает</span>}
                    {app.status === 'accepted' && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1"/> Принят</span>}
                    {app.status === 'rejected' && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1"/> Отклонен</span>}
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="sm:flex sm:justify-between">
                    <div className="sm:flex flex-col space-y-1">
                      <p className="flex items-center text-sm text-gray-900 font-bold">
                        <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {app.seeker_name}
                      </p>
                      <p className="flex items-center text-sm text-gray-500">
                        <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {app.seeker_email}
                      </p>
                       {app.phone && (
                        <p className="flex items-center text-sm text-gray-500 ml-6">
                          Тел: {app.phone}
                        </p>
                      )}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <p>{new Date(app.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 bg-gray-50 p-3 rounded text-sm text-gray-600">
                    <p><strong>Профессия:</strong> {app.profession || 'Не указана'}</p>
                    <p className="mt-1"><strong>Навыки:</strong> {app.skills || 'Не указаны'}</p>
                  </div>

                  {app.status === 'pending' && (
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => handleStatusChange(app.id, 'accepted')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                      >
                        Принять
                      </button>
                      <button
                         onClick={() => handleStatusChange(app.id, 'rejected')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                      >
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
    </div>
  );
};

export default ApplicationsList;