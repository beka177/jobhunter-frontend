import React, { useRef, useState } from 'react';
import { Upload, Loader2, ImageIcon } from 'lucide-react';
import { API_URL } from '../constants';
import { useT } from '../i18n.jsx';
import { useToast } from '../toast.jsx';

// Кнопка-загрузчик. Принимает файл, отправляет на /api/upload.php,
// возвращает URL через onUploaded. Текстовое поле URL остаётся в формах рядом
// как альтернативный способ задать ссылку.
const ACCEPT = 'image/jpeg,image/png,image/webp';

const FileUpload = ({ kind, userId, currentUrl, onUploaded }) => {
  const { t } = useT();
  const toast = useToast();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);

  const previewUrl = localPreview || currentUrl;

  const handlePick = () => inputRef.current?.click();

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // сбрасываем, чтобы повторный выбор того же файла триггерил onChange
    if (!file) return;

    // Локальная валидация только по формату — ограничения по размеру нет
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error(t('upload.error_format'));
      return;
    }

    // Превью сразу, до отправки
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    const fd = new FormData();
    fd.append('file', file);
    fd.append('kind', kind);
    if (userId) fd.append('user_id', String(userId));

    setUploading(true);
    try {
      const r = await fetch(`${API_URL}/upload.php`, { method: 'POST', body: fd });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.url) {
        const err = data.error || '';
        if (err === 'unsupported format') {
          toast.error(t('upload.error_format'));
        } else {
          toast.error(t('upload.error_generic'));
        }
        setLocalPreview(null);
        return;
      }
      onUploaded(data.url);
      toast.success(t('upload.success'));
    } catch (err) {
      toast.error(t('upload.error_generic'));
      setLocalPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={t('upload.preview_alt')}
            className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-700">
            <ImageIcon className="w-6 h-6 text-gray-400" />
          </div>
        )}
        <button
          type="button"
          onClick={handlePick}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading
            ? t('upload.uploading')
            : (previewUrl ? t('upload.replace') : t('upload.choose_file'))}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;
