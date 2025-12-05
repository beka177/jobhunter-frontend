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
        className="mb-4 flex items-center text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-1" /> На главную
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">История моих откликов</h2>
      
      {applications.length === 0 ? (
        <div className="text-center text-gray-500 bg-white p-8 rounded shadow">
          Вы еще не откликались на вакансии.
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {applications.map((app) => (
              <li key={app.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-blue-600">{app.vacancy_title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Building className="h-4 w-4 mr-1" />
                      {app.employer_name}
                      <span className="mx-2">•</span>
                      <span className="font-bold text-gray-700">{app.salary}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Отправлено: {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    {app.status === 'pending' && (
                      <span className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-4 h-4 mr-2" /> На рассмотрении
                      </span>
                    )}
                    {app.status === 'accepted' && (
                      <span className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-2" /> Вас пригласили!
                      </span>
                    )}
                    {app.status === 'rejected' && (
                      <span className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
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