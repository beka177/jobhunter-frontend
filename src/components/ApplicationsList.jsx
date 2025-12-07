import React, { useEffect, useState } from 'react';
import { FileText, User, Mail, Calendar, CheckCircle, XCircle, Clock, ArrowLeft, Eye, X, GraduationCap, MapPin, Phone, Globe } from 'lucide-react';
import { API_URL, UserRole } from '../constants';

const ApplicationsList = ({ user, onNavigate }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
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
        if (selectedApp && selectedApp.id === appId) {
          setSelectedApp(prev => ({ ...prev, status: newStatus }));
        }
      } else {
        const err = await response.json();
        alert('Ошибка обновления статуса: ' + (err.message || 'Неизвестная ошибка'));
      }
    } catch (error) {
      alert('Ошибка сети. Проверьте консоль.');
    }
  };

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
                    <div className="flex items-center gap-3">
                      {/* АВАТАР В СПИСКЕ */}
                      {app.avatar ? (
                        <img src={app.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            <User className="w-6 h-6" />
                        </div>
                      )}
                      
                      <div>
                        <p className="text-lg font-bold text-blue-700 truncate">{app.vacancy_title}</p>
                        <p className="text-sm text-gray-500 mt-1">Кандидат: <span className="font-semibold text-gray-900">{app.seeker_name}</span></p>
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex items-center">
                      {app.status === 'pending' && <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"><Clock className="w-4 h-4 mr-1.5"/> Ожидает</span>}
                      {app.status === 'accepted' && <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800"><CheckCircle className="w-4 h-4 mr-1.5"/> Принят</span>}
                      {app.status === 'rejected' && <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800"><XCircle className="w-4 h-4 mr-1.5"/> Отклонен</span>}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <p>Дата отклика: {new Date(app.created_at).toLocaleDateString()}</p>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Посмотреть резюме
                      </button>

                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(app.id, 'accepted')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-md text-white bg-green-600 hover:bg-green-700 shadow-sm"
                          >
                            Принять
                          </button>
                          <button
                             onClick={() => handleStatusChange(app.id, 'rejected')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-md text-white bg-red-600 hover:bg-red-700 shadow-sm"
                          >
                            Отказать
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedApp(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-4 border-b pb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Резюме кандидата</h3>
                  <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-500">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    {/* АВАТАР В МОДАЛЬНОМ ОКНЕ */}
                    {selectedApp.avatar ? (
                        <img src={selectedApp.avatar} alt="Avatar" className="h-16 w-16 rounded-full object-cover border border-blue-100" />
                    ) : (
                        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                            {(selectedApp.seeker_name || 'U').charAt(0).toUpperCase()}
                        </div>
                    )}
                    
                    <div>
                      <p className="text-xl font-bold">{selectedApp.surname} {selectedApp.first_name}</p>
                      <p className="text-sm text-gray-500">{selectedApp.seeker_email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                     <div className="bg-gray-50 p-3 rounded">
                        <span className="text-xs text-gray-500 block">Желаемая должность</span>
                        <span className="font-semibold text-gray-900">{selectedApp.profession || 'Не указана'}</span>
                     </div>
                     <div className="bg-gray-50 p-3 rounded">
                        <span className="text-xs text-gray-500 block">Город</span>
                        <span className="font-semibold text-gray-900 flex items-center">
                           <MapPin className="w-3 h-3 mr-1" /> {selectedApp.city || 'Не указан'}
                        </span>
                     </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-bold text-gray-800 flex items-center mb-2"><User className="w-4 h-4 mr-2" /> Личные данные</h4>
                    <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                        <p>Пол: <span className="font-medium">{selectedApp.gender === 'male' ? 'Мужской' : 'Женский'}</span></p>
                        <p>Дата рождения: <span className="font-medium">{selectedApp.birthday || '-'}</span></p>
                        <p>Гражданство: <span className="font-medium">{selectedApp.citizenship || '-'}</span></p>
                        <p className="flex items-center"><Phone className="w-3 h-3 mr-1"/> {selectedApp.phone || '-'}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-bold text-gray-800 flex items-center mb-2"><GraduationCap className="w-4 h-4 mr-2" /> Образование</h4>
                    <p className="text-sm text-gray-700"><span className="font-semibold">{selectedApp.education_level}</span></p>
                    <p className="text-sm text-gray-600">{selectedApp.education_institution}</p>
                    <p className="text-sm text-gray-500">{selectedApp.education_faculty}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-bold text-gray-800 flex items-center mb-2"><Globe className="w-4 h-4 mr-2" /> Навыки</h4>
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 border border-gray-100">{selectedApp.skills || 'Навыки не указаны'}</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setSelectedApp(null)}>Закрыть</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;