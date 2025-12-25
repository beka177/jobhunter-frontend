import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building, Calendar, User, Pencil, Briefcase, DollarSign } from 'lucide-react';
import { API_URL, UserRole } from '../constants';

const VacancyDetails = ({ vacancyId, user, onNavigate, onEdit }) => {
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const response = await fetch(`${API_URL}/vacancies.php?id=${vacancyId}`);
        if (response.ok) {
          const data = await response.json();
          setVacancy(data);
        }
      } catch (error) {
        console.error('Ошибка загрузки деталей:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVacancy();
  }, [vacancyId]);

  const handleApply = async () => {
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
          vacancy_id: vacancy.id,
          seeker_id: user.id
        })
      });

      if (response.status === 409) {
        alert('Вы уже откликнулись на эту вакансию ранее.');
        return;
      }

      if (response.ok) {
        alert('Вы успешно откликнулись на вакансию!');
      } else {
        alert('Ошибка при отклике');
      }
    } catch (error) {
      alert('Ошибка сети');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500 text-lg">Загрузка деталей вакансии...</div>;
  if (!vacancy) return <div className="text-center py-20 text-red-500 text-lg">Вакансия не найдена</div>;

  // Проверка: является ли текущий пользователь создателем этой вакансии
  const isOwner = user && user.role === UserRole.EMPLOYER && String(user.id) === String(vacancy.employer_id);

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4 pb-12">
      {/* Шапка с кнопками управления */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <button 
          onClick={() => onNavigate('home')} 
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Назад к списку
        </button>

        {isOwner && (
          <button 
            onClick={() => onEdit(vacancy.id)}
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold shadow-md hover:scale-105 active:scale-95"
          >
            <Pencil className="h-4 w-4 mr-2" /> Редактировать вакансию
          </button>
        )}
      </div>

      <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
        <div className="p-8">
          {/* Изображение логотипа */}
          <div className="mb-10 flex justify-center">
             {vacancy.image ? (
                <img 
                  src={vacancy.image} 
                  alt="Company Logo" 
                  className="w-full max-w-md h-80 rounded-2xl object-contain bg-gray-50 border border-gray-100 shadow-inner" 
                />
             ) : (
                <div className="w-full max-w-md h-80 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
                    <Building className="w-24 h-24 opacity-20" />
                </div>
             )}
          </div>

          {/* Основная информация */}
          <div className="border-b border-gray-100 pb-8 mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-4 leading-tight">{vacancy.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center text-3xl font-bold text-blue-600">
                <DollarSign className="w-7 h-7 mr-1" />
                {vacancy.salary}
              </div>
              <div className="flex items-center text-gray-600 font-medium text-lg bg-gray-50 px-4 py-1 rounded-full border border-gray-100">
                <Building className="w-5 h-5 mr-2 text-gray-400" />
                {vacancy.employer_name}
              </div>
            </div>
          </div>

          {/* Детализация (Сетки и инфо-блоки) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">Дата публикации</h3>
              <div className="flex items-center text-blue-900 font-semibold">
                <Calendar className="w-5 h-5 mr-2 opacity-70" />
                {new Date(vacancy.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
              <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">Тип занятости</h3>
              <div className="flex items-center text-emerald-900 font-semibold">
                <Briefcase className="w-5 h-5 mr-2 opacity-70" />
                Полная занятость
              </div>
            </div>
          </div>

          {/* Описание вакансии */}
          <div className="prose prose-blue max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Описание вакансии</h2>
            <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line bg-gray-50 p-6 rounded-2xl border border-gray-100">
              {vacancy.description}
            </div>
          </div>

          {/* Кнопка отклика */}
          {(!user || user.role === UserRole.SEEKER) && (
            <div className="mt-12 flex justify-center">
              <button 
                onClick={handleApply} 
                className="w-full md:w-auto px-12 py-5 text-xl font-black text-white bg-blue-600 rounded-2xl hover:bg-blue-700 shadow-2xl transition-all transform hover:scale-105 active:scale-95 focus:ring-4 focus:ring-blue-200"
              >
                Откликнуться сейчас
              </button>
            </div>
          )}
          
          {user && user.role === UserRole.EMPLOYER && !isOwner && (
             <div className="mt-12 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-center font-medium">
               Вы вошли как работодатель. Отклики доступны только соискателям.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VacancyDetails;