import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { API_URL } from '../constants';
import { useToast } from '../toast.jsx';
import { useT } from '../i18n.jsx';
import BackButton from './BackButton.jsx';

const ResumeForm = ({ user, onSuccess, onNavigate }) => {
  const toast = useToast();
  const { t } = useT();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    surname: '', first_name: '', patronymic: '',
    gender: 'male', city: '', phone: '',
    birthday: '', citizenship: '', work_permit: '',
    profession: '',
    education_level: '', education_institution: '',
    education_faculty: '', education_specialization: '', education_year: '',
    skills: ''
  });

  // Загружаем существующее резюме, если есть
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await fetch(`${API_URL}/resumes.php?user_id=${user.id}`);
        const data = await response.json();
        if (data) {
          const cleanData = {};
          Object.keys(formData).forEach(key => {
            cleanData[key] = data[key] || '';
          });
          setFormData(cleanData);
        }
      } catch (error) {
        console.error("Ошибка загрузки резюме", error);
      }
    };
    fetchResume();
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/resumes.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          ...formData
        })
      });

      if (response.ok) {
        toast.success(t('resume.toast.save_success'));
        if (onSuccess) onSuccess();
      } else {
        toast.error(t('resume.toast.save_error'));
      }
    } catch (error) {
      toast.error(t('common.network_error'));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white";

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4 pb-12">
      <BackButton onClick={() => onNavigate('home')} label={t('resume.back')} className="mb-6" />

      <div className="bg-white dark:bg-gray-800 shadow-lg sm:rounded-lg p-8 border border-gray-100 dark:border-gray-700 transition-colors">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 pb-4 border-b dark:border-gray-700">{t('resume.title')}</h2>
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Секция 1: Основная информация */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">{t('resume.section.main')}</h3>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('resume.field.profession')}</label>
                <input type="text" name="profession" value={formData.profession} onChange={handleChange} className={inputClass} placeholder={t('resume.field.profession_placeholder')} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('resume.field.surname')}</label>
                  <input type="text" name="surname" value={formData.surname} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('resume.field.first_name')}</label>
                  <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('resume.field.patronymic')}</label>
                  <input type="text" name="patronymic" value={formData.patronymic} onChange={handleChange} className={inputClass} />
                </div>
              </div>

              <div>
                <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('resume.field.gender')}</span>
                <div className="flex space-x-4">
                  <label className={`flex-1 border rounded-lg p-3 text-center cursor-pointer transition-colors bg-white dark:bg-gray-700 ${formData.gender === 'male' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300 font-medium ring-1 ring-blue-500' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'}`}>
                    <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} className="hidden" />
                    {t('resume.field.gender_male')}
                  </label>
                  <label className={`flex-1 border rounded-lg p-3 text-center cursor-pointer transition-colors bg-white dark:bg-gray-700 ${formData.gender === 'female' ? 'bg-pink-50 dark:bg-pink-900/30 border-pink-500 text-pink-700 dark:text-pink-300 font-medium ring-1 ring-pink-500' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'}`}>
                    <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} className="hidden" />
                    {t('resume.field.gender_female')}
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('resume.field.city')}</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('resume.field.phone')}</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+7 ..." />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('resume.field.birthday')}</label>
                  <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('resume.field.citizenship')}</label>
                  <select name="citizenship" value={formData.citizenship} onChange={handleChange} className={inputClass}>
                      <option value="">{t('resume.field.select')}</option>
                      <option value="Казахстан">{t('slist.cit.kz')}</option>
                      <option value="Россия">{t('slist.cit.ru')}</option>
                      <option value="Другое">{t('slist.cit.other')}</option>
                  </select>
                </div>
              </div>
              <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('resume.field.work_permit')}</label>
                  <select name="work_permit" value={formData.work_permit} onChange={handleChange} className={inputClass}>
                      <option value="">{t('resume.field.select')}</option>
                      <option value="Казахстан">{t('slist.permit.kz')}</option>
                      <option value="Россия">{t('slist.permit.ru')}</option>
                      <option value="Не требуется">{t('slist.permit.none')}</option>
                  </select>
                </div>
            </div>
          </div>

          {/* Секция 2: Образование */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">{t('resume.section.education')}</h3>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('resume.field.education_level')}</label>
                <select name="education_level" value={formData.education_level} onChange={handleChange} className={inputClass}>
                    <option value="">{t('resume.field.select')}</option>
                    <option value="Среднее">{t('slist.edu.secondary')}</option>
                    <option value="Среднее специальное">{t('slist.edu.secondary_special')}</option>
                    <option value="Высшее">{t('slist.edu.higher')}</option>
                    <option value="Магистратура">{t('slist.edu.master')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('resume.field.education_institution')}</label>
                <input type="text" name="education_institution" value={formData.education_institution} onChange={handleChange} className={inputClass} placeholder={t('resume.field.education_institution_placeholder')} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('resume.field.education_faculty')}</label>
                  <input type="text" name="education_faculty" value={formData.education_faculty} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('resume.field.education_specialization')}</label>
                  <input type="text" name="education_specialization" value={formData.education_specialization} onChange={handleChange} className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('resume.field.education_year')}</label>
                <input type="text" name="education_year" value={formData.education_year} onChange={handleChange} className={`${inputClass} w-40`} placeholder="2025" />
              </div>
            </div>
          </div>

          {/* Секция 3: Навыки */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">{t('resume.section.skills')}</h3>
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('resume.field.skills_label')}</label>
                <textarea name="skills" value={formData.skills} onChange={handleChange} rows="4" className={inputClass} placeholder={t('resume.field.skills_placeholder')}></textarea>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t('resume.field.skills_hint')}</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading} className="inline-flex items-center px-8 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed">
              {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
              {loading ? t('resume.submitting') : t('resume.submit')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ResumeForm;