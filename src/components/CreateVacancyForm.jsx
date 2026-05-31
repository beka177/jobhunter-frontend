import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { API_URL } from '../constants';
import { useToast } from '../toast.jsx';
import { useT } from '../i18n.jsx';
import FileUpload from './FileUpload.jsx';
import BackButton from './BackButton.jsx';

const CreateVacancyForm = ({ user, onSuccess, onCancel }) => {
  const toast = useToast();
  const { t } = useT();
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
        toast.success(t('vac_form.toast.created'));
        onSuccess();
      } else {
        const err = await response.json().catch(() => ({}));
        toast.error(`${t('vac_form.toast.create_error')}: ${err.message || ''}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(t('vac_form.toast.create_net'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <BackButton onClick={onCancel} className="mb-4" />
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 transition-colors">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('vac_form.create_title')}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('vac_form.field.title')}</label>
          <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors" placeholder={t('vac_form.field.title_placeholder')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('vac_form.field.city')}</label>
          <input type="text" value={city} onChange={e => setCity(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors" placeholder={t('vac_form.field.city_placeholder')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('vac_form.field.image')}</label>
          <FileUpload
            kind="vacancy"
            userId={user.id}
            currentUrl={image}
            onUploaded={(url) => setImage(url)}
          />
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mt-2 mb-1">{t('upload.or_paste_url')}</label>
          <input type="text" value={image} onChange={e => setImage(e.target.value)} className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors" placeholder={t('vac_form.field.image_placeholder')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('vac_form.field.salary')}</label>
          <input type="text" required value={salary} onChange={e => setSalary(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors" placeholder={t('vac_form.field.salary_placeholder')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('vac_form.field.description')}</label>
          <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors" placeholder={t('vac_form.field.description_placeholder')} />
        </div>
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">{t('common.cancel')}</button>
          <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? t('vac_form.creating') : t('vac_form.create_button')}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default CreateVacancyForm;