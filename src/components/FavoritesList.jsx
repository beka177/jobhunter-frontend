import React, { useEffect, useState } from 'react';
import { Trash2, Briefcase } from 'lucide-react';
import { API_URL } from '../constants';

const FavoritesList = ({ user, onNavigate, onOpenVacancy }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${API_URL}/favorites.php?user_id=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error('Failed to fetch favorites', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user.id]);

  const handleRemove = async (e, vacancyId) => {
    e.stopPropagation();
    if (!window.confirm('Удалить из избранного?')) return;

    try {
      await fetch(`${API_URL}/favorites.php?user_id=${user.id}&vacancy_id=${vacancyId}`, {
        method: 'DELETE'
      });
      setFavorites(prev => prev.filter(v => v.id !== vacancyId));
    } catch (error) {
      alert('Ошибка при удалении');
    }
  };

  if (loading) return <div className="text-center py-10">Загрузка избранного...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Избранные вакансии</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
          <div className="bg-red-50 dark:bg-red-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10 text-red-200 dark:text-red-800/50" />
          </div>
          <p className="text-gray-400 dark:text-gray-500 font-bold text-lg">Список избранного пуст</p>
          <button 
            onClick={() => onNavigate('home')} 
            className="mt-4 text-blue-500 dark:text-blue-400 font-bold hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
          >
            Найти вакансии
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((job) => (
            <div 
              key={job.id} 
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all cursor-pointer group relative"
              onClick={() => onOpenVacancy(job.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-5">
                   {job.image ? (
                      <img src={job.image} alt="Logo" className="w-20 h-20 rounded-xl object-cover bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600" />
                   ) : (
                      <div className="w-20 h-20 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-300 dark:text-gray-500 border border-gray-100 dark:border-gray-600">
                          <Briefcase className="w-8 h-8" />
                      </div>
                   )}
                   <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{job.title}</h3>
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">{job.salary}</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">{job.employer_name}</p>
                   </div>
                </div>
                
                <button 
                  onClick={(e) => handleRemove(e, job.id)}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                  title="Удалить из избранного"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
