import React from 'react';
import { LucideTrash2 } from 'lucide-react';
import { UserRole, API_URL } from '../constants';

const VacancyList = ({ vacancies, user, onDelete }) => {
  
  const handleApply = async (vacancyId) => {
    if (!user) {
      alert('Пожалуйста, войдите в систему, чтобы откликнуться.');
      return;
    }
    if (user.role === UserRole.EMPLOYER) {
      alert('Работодатели не могут откликаться на вакансии.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/applications.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vacancy_id: vacancyId,
          seeker_id: user.id
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Вы успешно откликнулись на вакансию!');
      } else {
        alert(data.message || 'Ошибка при отклике');
      }
    } catch (error) {
      alert('Ошибка соединения с сервером');
    }
  };

  if (vacancies.length === 0) {
    return <div className="text-center py-10 text-gray-500">Вакансий пока нет. Станьте первым!</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
      {vacancies.map((job) => (
        <div key={job.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg leading-6 font-medium text-blue-600">{job.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Зарплата: <span className="font-bold text-gray-900">{job.salary}</span></p>
                <p className="mt-1 text-xs text-gray-400">Компания: {job.employer_name}</p>
              </div>
              {user?.role === UserRole.EMPLOYER && String(user.id) === String(job.employer_id) && (
                <button 
                  onClick={() => onDelete(job.id)}
                  className="text-red-400 hover:text-red-600"
                  title="Удалить вакансию"
                >
                  <LucideTrash2 className="h-5 w-5" />
                </button>
              )}
            </div>
            <div className="mt-4 text-sm text-gray-700 whitespace-pre-line">
              {job.description}
            </div>
            <div className="mt-4">
              {/* Показываем кнопку только соискателям или неавторизованным */}
              {(!user || user.role === UserRole.SEEKER) && (
                 <button 
                  onClick={() => handleApply(job.id)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                 >
                   Откликнуться
                 </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VacancyList;