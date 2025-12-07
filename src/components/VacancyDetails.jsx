import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building, MapPin, Calendar, DollarSign, User } from 'lucide-react';
import { API_URL, UserRole } from '../constants';

const VacancyDetails = ({ vacancyId, user, onNavigate }) => {
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
        console.error(error);
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

  if (loading) return <div className="text-center py-10">Загрузка...</div>;
  if (!vacancy) return <div className="text-center py-10">Вакансия не найдена</div>;

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4 pb-10">
      <button 
        onClick={() => onNavigate('home')} 
        className="mb-6 inline-flex items-center px-4 py-2 bg-white border border-blue-600 text-blue-700 rounded-md hover:bg-blue-50 transition-colors font-medium shadow-sm"
      >
        <ArrowLeft className="h-5 w-5 mr-2" /> Назад к списку
      </button>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="p-8">
          {/* Картинка вакансии: ПО ЦЕНТРУ и ЕЩЕ БОЛЬШЕ (w-96) */}
          <div className="mb-8 flex justify-center">
             {vacancy.image ? (
                <img src={vacancy.image} alt="Logo" className="w-96 h-96 rounded-lg object-contain bg-gray-50 border border-gray-100" />
             ) : (
                <div className="w-96 h-96 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                    <Building className="w-32 h-32" />
                </div>
             )}
          </div>

          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{vacancy.title}</h1>
            <p className="text-2xl font-bold text-blue-600 mb-4">{vacancy.salary}</p>
            
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-600 mb-8">
              <div className="flex items-center">
                  {vacancy.employer_avatar ? (
                      <img src={vacancy.employer_avatar} className="w-8 h-8 rounded-full mr-2 object-cover border" alt="Emp" />
                  ) : (
                      <User className="w-5 h-5 mr-1" />
                  )}
                  <span className="font-medium text-lg">{vacancy.employer_name}</span>
              </div>
              <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-1" />
                  <span>Опубликовано: {new Date(vacancy.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {(!user || user.role === UserRole.SEEKER) && (
               <button 
                onClick={handleApply}
                className="w-full md:w-auto px-10 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md"
               >
                 Откликнуться
               </button>
            )}
          </div>

          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Описание вакансии</h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-line leading-relaxed text-lg">
              {vacancy.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacancyDetails;