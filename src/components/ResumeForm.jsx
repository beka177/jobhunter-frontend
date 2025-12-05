import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
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

  // ПРИНУДИТЕЛЬНО БЕЛЫЙ ФОН для инпутов
  const inputStyle = { backgroundColor: '#ffffff', color: '#000000' };
  const inputClass = "mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900";

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4 pb-12">
      <button 
        onClick={() => onNavigate('home')} 
        className="mb-6 inline-flex items-center px-4 py-2 bg-white border border-blue-600 text-blue-700 rounded-md hover:bg-blue-50 transition-colors font-medium shadow-sm"
      >
        <ArrowLeft className="h-5 w-5 mr-2" /> Назад к вакансиям
      </button>

      <div className="bg-white shadow-lg sm:rounded-lg p-8 border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 pb-4 border-b">Мое резюме</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Секция 1: Основная информация */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Заполните основную информацию</h3>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Профессия (на кого ищем работу) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Желаемая должность</label>
                <input type="text" name="profession" value={formData.profession} onChange={handleChange} className={inputClass} style={inputStyle} placeholder="Например: Программист 1С" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Фамилия</label>
                  <input type="text" name="surname" value={formData.surname} onChange={handleChange} className={inputClass} style={inputStyle} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Имя</label>
                  <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className={inputClass} style={inputStyle} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Отчество</label>
                  <input type="text" name="patronymic" value={formData.patronymic} onChange={handleChange} className={inputClass} style={inputStyle} />
                </div>
              </div>

              <div>
                <span className="block text-sm font-semibold text-gray-700 mb-2">Пол</span>
                <div className="flex space-x-4">
                  <label className={`flex-1 border rounded-lg p-3 text-center cursor-pointer transition-colors bg-white ${formData.gender === 'male' ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium ring-1 ring-blue-500' : 'border-gray-300 hover:bg-gray-100'}`}>
                    <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} className="hidden" />
                    Мужской
                  </label>
                  <label className={`flex-1 border rounded-lg p-3 text-center cursor-pointer transition-colors bg-white ${formData.gender === 'female' ? 'bg-pink-50 border-pink-500 text-pink-700 font-medium ring-1 ring-pink-500' : 'border-gray-300 hover:bg-gray-100'}`}>
                    <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} className="hidden" />
                    Женский
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Город проживания</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Номер телефона</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} style={inputStyle} placeholder="+7 ..." />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Дата рождения</label>
                  <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Гражданство</label>
                  <select name="citizenship" value={formData.citizenship} onChange={handleChange} className={inputClass} style={inputStyle}>
                      <option value="">Выберите...</option>
                      <option value="Казахстан">Казахстан</option>
                      <option value="Россия">Россия</option>
                      <option value="Другое">Другое</option>
                  </select>
                </div>
              </div>
              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Разрешение на работу</label>
                  <select name="work_permit" value={formData.work_permit} onChange={handleChange} className={inputClass} style={inputStyle}>
                      <option value="">Выберите...</option>
                      <option value="Казахстан">Казахстан</option>
                      <option value="Россия">Россия</option>
                      <option value="Не требуется">Не требуется</option>
                  </select>
                </div>
            </div>
          </div>

          {/* Секция 2: Образование */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Где учились?</h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Уровень образования</label>
                <select name="education_level" value={formData.education_level} onChange={handleChange} className={inputClass} style={inputStyle}>
                    <option value="">Выберите...</option>
                    <option value="Среднее">Среднее</option>
                    <option value="Среднее специальное">Среднее специальное</option>
                    <option value="Высшее">Высшее</option>
                    <option value="Магистратура">Магистратура</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Учебное заведение</label>
                <input type="text" name="education_institution" value={formData.education_institution} onChange={handleChange} className={inputClass} style={inputStyle} placeholder="Название университета / колледжа" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Факультет</label>
                  <input type="text" name="education_faculty" value={formData.education_faculty} onChange={handleChange} className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Специализация</label>
                  <input type="text" name="education_specialization" value={formData.education_specialization} onChange={handleChange} className={inputClass} style={inputStyle} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Год окончания</label>
                <input type="text" name="education_year" value={formData.education_year} onChange={handleChange} className={`${inputClass} w-40`} style={inputStyle} placeholder="2025" />
              </div>
            </div>
          </div>

          {/* Секция 3: Навыки */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Какими навыками владеете?</h3>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Навыки (через запятую)</label>
                <textarea name="skills" value={formData.skills} onChange={handleChange} rows="4" className={inputClass} style={inputStyle} placeholder="1С: Предприятие, SQL, Аналитическое мышление..."></textarea>
                <p className="text-xs text-gray-500 mt-2">Перечислите ключевые навыки, разделяя их запятыми.</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading} className="inline-flex items-center px-8 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100">
              <Save className="h-5 w-5 mr-2" />
              {loading ? 'Сохранение...' : 'Сохранить резюме'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ResumeForm;