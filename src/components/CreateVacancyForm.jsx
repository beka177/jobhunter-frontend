import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { API_URL } from '../constants';
import { useToast } from '../toast.jsx';

const CreateVacancyForm = ({ user, onSuccess, onCancel }) => {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [salary, setSalary] = useState('');
  const [city, setCity] = useState(''); 
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(''); // Новое поле для картинки
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/vacancies.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employer_id: user.id,
          title,
          city,
          salary,
          description,
          image // Отправляем картинку
        })
      });
      if (response.ok) {
        toast.success('Вакансия создана');
        onSuccess();
      } else {
        const err = await response.json().catch(() => ({}));
        toast.error(`Ошибка: ${err.message || 'не удалось создать'}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Ошибка сети: не удалось подключиться к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg max-w-2xl mx-auto mt-10 p-6 transition-colors">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Создание новой вакансии</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Название должности</label>
          <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors" placeholder="Например: PHP Разработчик" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Город</label>
          <input type="text" value={city} onChange={e => setCity(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors" placeholder="Например: Астана" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ссылка на логотип/картинку (необязательно)</label>
          <input type="text" value={image} onChange={e => setImage(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Зарплата</label>
          <input type="text" required value={salary} onChange={e => setSalary(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors" placeholder="Например: 100 000 руб." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Описание</label>
          <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors" placeholder="Обязанности, требования..." />
        </div>
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Отмена</button>
          <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? 'Создание...' : 'Создать'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateVacancyForm;