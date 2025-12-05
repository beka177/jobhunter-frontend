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
        className="mb-6 inline-flex items-center px-4 py-2 bg-white border border-blue-600 text-blue-700 rounded-md hover:bg-blue-50 transition-colors font-medium shadow-sm"
      >
        <ArrowLeft className="h-5 w-5 mr-2" /> На главную
      </button>

      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">История моих откликов</h2>
      
      {applications.length === 0 ? (
        <div className="text-center text-gray-500 bg-white p-12 rounded-xl shadow border border-gray-100">
          <p className="text-lg">Вы еще не откликались на вакансии.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {applications.map((app) => (
              <li key={app.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-blue-700 mb-1">{app.vacancy_title}</h3>
                    <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1">
                      <div className="flex items-center mr-4 mb-1">
                        <Building className="h-4 w-4 mr-1.5 text-gray-400" />
                        {app.employer_name}
                      </div>
                      <div className="font-bold text-gray-800 mb-1">{app.salary}</div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Отправлено: {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {app.status === 'pending' && (
                      <span className="flex items-center px-4 py-2 rounded-full text-sm font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
                        <Clock className="w-4 h-4 mr-2" /> На рассмотрении
                      </span>
                    )}
                    {app.status === 'accepted' && (
                      <span className="flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle className="w-4 h-4 mr-2" /> Вас пригласили!
                      </span>
                    )}
                    {app.status === 'rejected' && (
                      <span className="flex items-center px-4 py-2 rounded-full text-sm font-bold bg-red-100 text-red-800 border border-red-200">
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