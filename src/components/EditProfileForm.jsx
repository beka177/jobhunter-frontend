import React, { useState } from 'react';
import { User, Mail, Lock, Save, X, Camera, ArrowLeft, Loader2 } from 'lucide-react';
import { API_URL } from '../constants';
import { useToast } from '../toast.jsx';
import { useT } from '../i18n.jsx';
import FileUpload from './FileUpload.jsx';

const EditProfileForm = ({ user, onUpdate, onCancel }) => {
  const toast = useToast();
  const { t } = useT();
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password && password !== confirmPassword) {
      setError(t('profile.passwords_mismatch'));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/profile.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          name,
          email,
          avatar,
          password: password || undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        onUpdate(data.user);
        toast.success(t('profile.toast.updated'));
      } else {
        setError(data.error || t('profile.toast.update_error'));
      }
    } catch (err) {
      setError(t('common.network_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('profile.title')}</h2>
        <button
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium shadow-sm"
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> {t('common.back')}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Аватар */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 relative group">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <div className="w-full max-w-xs space-y-3">
            {/* Загрузка файлом */}
            <div className="flex justify-center">
              <FileUpload
                kind="avatar"
                userId={user.id}
                currentUrl={avatar}
                onUploaded={(url) => setAvatar(url)}
              />
            </div>
            {/* Альтернатива: вставка URL вручную */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 text-center">{t('upload.or_paste_url')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Camera className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="pl-10 block w-full border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  placeholder={t('profile.avatar_placeholder')}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.name')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 block w-full border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.email')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 block w-full border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-6 mt-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">{t('profile.password_section')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.new_password')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 block w-full border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder={t('profile.new_password_placeholder')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.confirm_password')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 block w-full border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder={t('profile.confirm_password_placeholder')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {loading ? t('profile.saving') : t('profile.save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
