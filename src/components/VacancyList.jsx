import React, { useState } from 'react';
import { Trash2, Search, Briefcase, Filter, X } from 'lucide-react';
import { UserRole, API_URL } from '../constants';

const VacancyList = ({ vacancies, user, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [keywords, setKeywords] = useState('');

  const parseSalary = (salaryStr) => {
    if (!salaryStr) return 0;
    return parseInt(salaryStr.replace(/\D/g, '')) || 0;
  };

  const filteredVacancies = vacancies.filter((job) => {
    const matchesTitle = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKeywords = keywords 
      ? job.description.toLowerCase().includes(keywords.toLowerCase()) 
      : true;

    let matchesSalary = true;
    if (minSalary) {
      const jobSalary = parseSalary(job.salary);
      const targetSalary = parseInt(minSalary) || 0;
      matchesSalary = jobSalary >= targetSalary;
    }

    return matchesTitle && matchesKeywords && matchesSalary;
  });

  const handleResetFilters = () => {
    setSearchTerm('');
    setMinSalary('');
    setKeywords('');
  };

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

      if (response.status === 409) {
        alert('Вы уже откликнулись на эту вакансию ранее.');
        return;
      }

      const data = await response.json();
      
      if (response.ok) {
        alert('Вы успешно откликнулись на вакансию!');
      } else {
        alert(data.message || 'Ошибка при отклике');
      }
    } catch (error) {
      alert('Ошибка сети: Сервер недоступен');
    }
  };

  const inputStyle = { backgroundColor: '#ffffff', color: '#000000' };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* ФИЛЬТРЫ */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center">
              <Filter className="w-4 h-4 mr-2" /> Фильтры
            </h3>
            {(searchTerm || minSalary || keywords) && (
              <button onClick={handleResetFilters} className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center">
                <X className="w-3 h-3 mr-1" /> Сбросить
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Поиск</label>
              <input
                type="text"
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Должность..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Зарплата от</label>
              <input
                type="number"
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                style={inputStyle}
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ключевые слова</label>
              <input
                type="text"
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Например: React, SQL"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* СПИСОК ВАКАНСИЙ */}
      <div className="lg:col-span-3 space-y-4">
        {filteredVacancies.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
            <Briefcase className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500 text-lg">
              Вакансий не найдено. Попробуйте изменить фильтры.
            </p>
          </div>
        ) : (
          filteredVacancies.map((job) => (
            <div key={job.id} className="bg-white overflow-hidden shadow-sm hover:shadow-md rounded-lg border border-gray-200 transition-all duration-200">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  
                  {/* Левая часть: Картинка (если есть) и Текст */}
                  <div className="flex gap-6 flex-grow">
                     {job.image ? (
                        <img src={job.image} alt="Logo" className="w-32 h-32 rounded-md object-contain bg-gray-50 border border-gray-100 flex-shrink-0" />
                     ) : (
                        <div className="w-32 h-32 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                            <Briefcase className="w-12 h-12" />
                        </div>
                     )}
                     
                     <div className="flex-grow">
                        <h3 className="text-xl font-bold text-blue-600 hover:underline cursor-pointer">{job.title}</h3>
                        <div className="mt-1 flex items-center text-gray-900 font-bold text-lg">
                        {job.salary}
                        </div>
                        <p className="mt-1 text-sm text-gray-500 font-medium">{job.employer_name}</p>
                        <div className="mt-3 text-sm text-gray-600 line-clamp-3">
                        {job.description}
                        </div>
                     </div>
                  </div>
                  
                  {user?.role === UserRole.EMPLOYER && String(user.id) === String(job.employer_id) && (
                    <button 
                      onClick={() => onDelete(job.id)}
                      className="ml-4 text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Удалить вакансию"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between border-t pt-4">
                  <span className="text-xs text-gray-400">
                    Опубликовано: {new Date(job.created_at).toLocaleDateString()}
                  </span>
                  
                  {(!user || user.role === UserRole.SEEKER) && (
                     <button 
                      onClick={() => handleApply(job.id)}
                      className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-bold rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                     >
                       Откликнуться
                     </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VacancyList;