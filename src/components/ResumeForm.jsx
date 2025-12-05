import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { API_URL } from '../constants';

const ResumeForm = ({ user, onSuccess, onNavigate }) => {
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
          // Если данные пришли, заполняем форму. Если поле null, ставим пустую строку
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
        alert('Резюме успешно сохранено!');
        if (onSuccess) onSuccess();
      } else {
        alert('Ошибка сохранения');
      }
    } catch (error) {
      alert('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <button 
        onClick={() => onNavigate('home')} 
        className="mb-4 flex items-center text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-1" /> На главную
      </button>

      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Мое резюме</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Секция 1: Основная информация */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Заполните основную информацию</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Профессия (на кого ищем работу) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Желаемая должность</label>
                <input type="text" name="profession" value={formData.profession} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Например: Программист 1С" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Фамилия</label>
                  <input type="text" name="surname" value={formData.surname} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Имя</label>
                  <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Отчество</label>
                  <input type="text" name="patronymic" value={formData.patronymic} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
              </div>

              <div>
                <span className="block text-sm font-medium text-gray-700 mb-2">Пол</span>
                <div className="flex space-x-4">
                  <label className={`flex-1 border rounded-md p-2 text-center cursor-pointer ${formData.gender === 'male' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300'}`}>
                    <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} className="hidden" />
                    Мужской
                  </label>
                  <label className={`flex-1 border rounded-md p-2 text-center cursor-pointer ${formData.gender === 'female' ? 'bg-pink-50 border-pink-500 text-pink-700' : 'border-gray-300'}`}>
                    <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} className="hidden" />
                    Женский
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Город проживания</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Номер телефона</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="+7 ..." />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Дата рождения</label>
                  <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Гражданство</label>
                  <select name="citizenship" value={formData.citizenship} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                      <option value="">Выберите...</option>
                      <option value="Казахстан">Казахстан</option>
                      <option value="Россия">Россия</option>
                      <option value="Другое">Другое</option>
                  </select>
                </div>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">Разрешение на работу</label>
                  <select name="work_permit" value={formData.work_permit} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                      <option value="">Выберите...</option>
                      <option value="Казахстан">Казахстан</option>
                      <option value="Россия">Россия</option>
                      <option value="Не требуется">Не требуется</option>
                  </select>
                </div>
            </div>
          </div>

          {/* Секция 2: Образование */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Где учились?</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Уровень образования</label>
                <select name="education_level" value={formData.education_level} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                    <option value="">Выберите...</option>
                    <option value="Среднее">Среднее</option>
                    <option value="Среднее специальное">Среднее специальное</option>
                    <option value="Высшее">Высшее</option>
                    <option value="Магистратура">Магистратура</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Учебное заведение</label>
                <input type="text" name="education_institution" value={formData.education_institution} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Название" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Факультет</label>
                  <input type="text" name="education_faculty" value={formData.education_faculty} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Специализация</label>
                  <input type="text" name="education_specialization" value={formData.education_specialization} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Год окончания</label>
                <input type="text" name="education_year" value={formData.education_year} onChange={handleChange} className="mt-1 block w-32 border border-gray-300 rounded-md shadow-sm p-2" placeholder="2025" />
              </div>
            </div>
          </div>

          {/* Секция 3: Навыки */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Какими навыками владеете?</h3>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Навыки (через запятую)</label>
                <textarea name="skills" value={formData.skills} onChange={handleChange} rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="1С: Предприятие, SQL, Аналитическое мышление..."></textarea>
                <p className="text-xs text-gray-500 mt-1">Перечислите ключевые навыки, разделяя их запятыми.</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm disabled:opacity-50">
              {loading ? 'Сохранение...' : 'Сохранить резюме'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ResumeForm;