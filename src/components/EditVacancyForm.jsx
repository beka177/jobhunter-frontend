import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
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
    setSaving(true);
    try {
      // Используем метод PUT для обновления
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
      alert('Ошибка сети');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20">Загрузка данных вакансии...</div>;

  return (
    <div className="bg-white shadow-xl sm:rounded-lg max-w-2xl mx-auto mt-10 p-8 border border-gray-100">
      <div className="flex items-center mb-6">
        <button onClick={onCancel} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h3 className="text-2xl font-bold text-gray-900">Редактирование вакансии</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Название должности</label>
          <input 
            type="text" 
            required 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3 bg-white text-gray-900" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Ссылка на логотип</label>
          <input 
            type="text" 
            value={image} 
            onChange={e => setImage(e.target.value)} 
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3 bg-white text-gray-900" 
            placeholder="https://..." 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Зарплата</label>
          <input 
            type="text" 
            required 
            value={salary} 
            onChange={e => setSalary(e.target.value)} 
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3 bg-white text-gray-900" 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Описание</label>
          <textarea 
            required 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            rows={6} 
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3 bg-white text-gray-900" 
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button 
            type="submit" 
            disabled={saving} 
            className="inline-flex items-center px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-md transition-transform transform hover:scale-105"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditVacancyForm;