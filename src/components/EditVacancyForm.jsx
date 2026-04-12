import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { API_URL } from '../constants';

const EditVacancyForm = ({ vacancyId, onSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const response = await fetch(`${API_URL}/vacancies.php?id=${vacancyId}`);
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
          setSalary(data.salary);
          setDescription(data.description);
          setImage(data.image || '');
        }
      } catch (error) {
        alert('Ошибка загрузки данных вакансии');
      } finally {
        setLoading(false);
      }
    };
    fetchVacancy();
  }, [vacancyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/vacancies.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: vacancyId,
          title,
          salary,
          description,
          image
        })
      });

      if (response.ok) {
        alert('Вакансия успешно обновлена!');
        onSuccess();
      } else {
        const err = await response.json();
        alert(`Ошибка: ${err.message}`);
      }
    } catch (error) {
      alert('Ошибка сети: проверьте подключение к Backend');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
      <p className="text-lg font-medium">Загрузка данных вакансии...</p>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow-2xl sm:rounded-3xl max-w-2xl mx-auto mt-10 p-8 border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-colors">
      {saving && (
        <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      )}
      
      <div className="flex items-center mb-8">
        <button 
          onClick={onCancel} 
          className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          title="Вернуться назад"
        >
            <ArrowLeft className="h-6 w-6" />
        </button>
        <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Редактирование</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Должность</label>
          <input 
            type="text" 
            required 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            className="block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium transition-all" 
            placeholder="Напр: Ведущий дизайнер"
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Ссылка на логотип</label>
          <input 
            type="text" 
            value={image} 
            onChange={e => setImage(e.target.value)} 
            className="block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium transition-all" 
            placeholder="https://example.com/logo.png" 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Зарплата</label>
          <input 
            type="text" 
            required 
            value={salary} 
            onChange={e => setSalary(e.target.value)} 
            className="block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium transition-all" 
            placeholder="Напр: 150 000 — 200 000 руб."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Подробное описание</label>
          <textarea 
            required 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            rows={8} 
            className="block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium transition-all resize-none" 
            placeholder="Опишите задачи, требования и условия..."
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100 dark:border-gray-700">
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-8 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-95"
          >
            Отмена
          </button>
          <button 
            type="submit" 
            disabled={saving} 
            className="inline-flex items-center px-10 py-3 text-sm font-black text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 shadow-xl shadow-blue-200 dark:shadow-none transition-all transform hover:scale-105 active:scale-95"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Сохранение...' : 'Обновить вакансию'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditVacancyForm;