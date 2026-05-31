
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building, Calendar, User, Pencil, Briefcase, DollarSign, Heart, Loader2, MessageCircle } from 'lucide-react';
import { API_URL, UserRole } from '../constants';
import { useToast } from '../toast.jsx';
import { useT } from '../i18n.jsx';
import BackButton from './BackButton.jsx';

const VacancyDetails = ({ vacancyId, user, favorites = [], onToggleFavorite, onNavigate, onEdit, onOpenChat }) => {
  const toast = useToast();
  const { t, lang } = useT();
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

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
      toast.info(t('vdetails.login_to_apply'));
      return;
    }
    if (user.role === UserRole.EMPLOYER) {
      toast.info(t('vdetails.employer_cant_apply'));
      return;
    }
    if (applying) return;

    setApplying(true);
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
        toast.info(t('vlist.toast.already_applied'));
        return;
      }

      if (response.ok) {
        toast.success(t('vlist.toast.applied'));
      } else {
        toast.error(t('vlist.toast.apply_fail'));
      }
    } catch (error) {
      toast.error(t('common.network_error'));
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500 text-lg">{t('vdetails.loading')}</div>;
  if (!vacancy) return <div className="text-center py-20 text-red-500 text-lg">{t('vdetails.not_found')}</div>;

  // Проверка: является ли текущий пользователь создателем этой вакансии
  const isOwner = user && user.role === UserRole.EMPLOYER && String(user.id) === String(vacancy.employer_id);

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4 pb-12">
      {/* Шапка с кнопками управления */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <BackButton onClick={() => onNavigate('home')} label={t('vdetails.back')} />

        {isOwner && (
          <button
            onClick={() => onEdit(vacancy.id)}
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold shadow-md hover:scale-105 active:scale-95"
          >
            <Pencil className="h-4 w-4 mr-2" /> {t('vdetails.edit')}
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="p-8">
          {/* Изображение логотипа */}
          <div className="mb-10 flex justify-center">
             {vacancy.image ? (
                <img 
                  src={vacancy.image} 
                  alt="Company Logo" 
                  className="w-full max-w-md h-80 rounded-2xl object-cover bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 shadow-inner" 
                />
             ) : (
                <div className="w-full max-w-md h-80 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 border border-dashed border-gray-300 dark:border-gray-600">
                    <Building className="w-24 h-24 opacity-20" />
                </div>
             )}
          </div>

          {/* Основная информация */}
          <div className="border-b border-gray-100 dark:border-gray-700 pb-8 mb-8">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{vacancy.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center text-3xl font-bold text-blue-600 dark:text-blue-400">
                <DollarSign className="w-7 h-7 mr-1" />
                {vacancy.salary}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300 font-medium text-lg bg-gray-50 dark:bg-gray-700 px-4 py-1 rounded-full border border-gray-100 dark:border-gray-600">
                <Building className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500" />
                {vacancy.employer_name}
              </div>
            </div>
          </div>

          {/* Детализация (Сетки и инфо-блоки) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
              <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-2">{t('vdetails.published')}</h3>
              <div className="flex items-center text-blue-900 dark:text-blue-100 font-semibold">
                <Calendar className="w-5 h-5 mr-2 opacity-70" />
                {new Date(vacancy.created_at).toLocaleDateString(lang === 'kk' ? 'kk-KZ' : 'ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800">
              <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2">{t('vdetails.employment_type')}</h3>
              <div className="flex items-center text-emerald-900 dark:text-emerald-100 font-semibold">
                <Briefcase className="w-5 h-5 mr-2 opacity-70" />
                {t('vdetails.full_time')}
              </div>
            </div>
          </div>

          {/* Описание вакансии */}
          <div className="prose prose-blue max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('vdetails.description')}</h2>
            <div className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl border border-gray-100 dark:border-gray-600">
              {vacancy.description}
            </div>
          </div>

          {/* Кнопка отклика */}
          {(!user || user.role === UserRole.SEEKER) && (
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <button
                onClick={handleApply}
                disabled={applying}
                className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-5 text-xl font-black text-white bg-blue-600 rounded-2xl hover:bg-blue-700 shadow-2xl transition-all transform hover:scale-105 active:scale-95 focus:ring-4 focus:ring-blue-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              >
                {applying && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                {applying ? t('vdetails.applying') : t('vdetails.apply_now')}
              </button>

              {user && user.role === UserRole.SEEKER && onOpenChat && (
                <button
                  onClick={() => onOpenChat(vacancy.employer_id, 'employer', vacancy.id)}
                  className="inline-flex items-center justify-center px-6 py-5 text-base font-bold rounded-2xl border-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all transform hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 mr-2" /> {t('vdetails.write_employer')}
                </button>
              )}

              {user && (
                <button
                  onClick={() => onToggleFavorite(vacancy.id)}
                  className={`px-6 py-5 rounded-2xl border-2 transition-all transform hover:scale-105 active:scale-95 ${
                    favorites.includes(vacancy.id)
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-500'
                      : 'border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:border-red-300 dark:hover:border-red-400 hover:text-red-400'
                  }`}
                  title={favorites.includes(vacancy.id) ? t('vlist.fav_remove') : t('vlist.fav_add')}
                >
                  <Heart className={`w-8 h-8 ${favorites.includes(vacancy.id) ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>
          )}

          {user && user.role === UserRole.EMPLOYER && !isOwner && (
             <div className="mt-12 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl text-yellow-800 dark:text-yellow-200 text-center font-medium">
               {t('vdetails.employer_notice')}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VacancyDetails;
