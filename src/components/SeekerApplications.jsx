import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle, Building, ArrowLeft } from 'lucide-react';
import { API_URL } from '../constants';

const SeekerApplications = ({ user, onNavigate }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch(`${API_URL}/applications.php?seeker_id=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [user]);

  if (loading) return <div className="text-center py-10">Загрузка...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4">
      <button 
        onClick={() => onNavigate('home')} 
        className="mb-6 inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors font-medium shadow-sm"
      >
        <ArrowLeft className="h-5 w-5 mr-2" /> На главную
      </button>

      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">История моих откликов</h2>
      
      {applications.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-12 rounded-xl shadow border border-gray-100 dark:border-gray-700">
          <p className="text-lg">Вы еще не откликались на вакансии.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-gray-700">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {applications.map((app) => (
              <li key={app.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-1">{app.vacancy_title}</h3>
                    <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                      <div className="flex items-center mr-4 mb-1">
                        <Building className="h-4 w-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                        {app.employer_name}
                      </div>
                      <div className="font-bold text-gray-800 dark:text-gray-200 mb-1">{app.salary}</div>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      Отправлено: {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {app.status === 'pending' && (
                      <span className="flex items-center px-4 py-2 rounded-full text-sm font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50">
                        <Clock className="w-4 h-4 mr-2" /> На рассмотрении
                      </span>
                    )}
                    {app.status === 'accepted' && (
                      <span className="flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800/50">
                        <CheckCircle className="w-4 h-4 mr-2" /> Вас пригласили!
                      </span>
                    )}
                    {app.status === 'rejected' && (
                      <span className="flex items-center px-4 py-2 rounded-full text-sm font-bold bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800/50">
                        <XCircle className="w-4 h-4 mr-2" /> Отказ
                      </span>
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

export default SeekerApplications;