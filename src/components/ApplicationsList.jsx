import React, { useEffect, useState } from 'react';
import { LucideFileText, LucideUser, LucideMail, LucideCalendar } from 'lucide-react';
import { API_URL } from '../constants';

const ApplicationsList = ({ user }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    if (user && user.id) {
      fetchApplications();
    }
  }, [user]);

  if (loading) {
    return <div className="text-center py-10">Загрузка откликов...</div>;
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow">
        <LucideFileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Нет откликов</h3>
        <p className="mt-1 text-sm text-gray-500">Пока никто не откликнулся на ваши вакансии.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Отклики на ваши вакансии</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {applications.map((app) => (
            <li key={app.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">
                    {app.vacancy_title}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Новый
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500 mr-6">
                      <LucideUser className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {app.seeker_name}
                    </p>
                    <p className="flex items-center text-sm text-gray-500">
                      <LucideMail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {app.seeker_email}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <LucideCalendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <p>
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
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