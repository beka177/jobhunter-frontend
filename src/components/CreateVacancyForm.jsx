import React, { useState } from 'react';
import { API_URL } from '../constants';

const CreateVacancyForm = ({ user, onSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
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
          salary,
          description
        })
      });
      if (response.ok) {
        onSuccess();
      } else {
        const err = await response.json();
        alert(`Ошибка: ${err.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('Ошибка сети: не удалось подключиться к серверу.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg max-w-2xl mx-auto mt-10 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Создание новой вакансии</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Название должности</label>
          <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white" placeholder="Например: PHP Разработчик" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Зарплата</label>
          <input type="text" required value={salary} onChange={e => setSalary(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white" placeholder="Например: 100 000 руб." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Описание</label>
          <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white" placeholder="Обязанности, требования..." />
        </div>
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Отмена</button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Создание...' : 'Создать'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateVacancyForm;