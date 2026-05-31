import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useT } from '../i18n.jsx';

// Единая кнопка «Назад» для всех страниц. По умолчанию ведёт назад через onClick,
// текст — «Назад» (можно переопределить через label).
const BackButton = ({ onClick, label, className = '' }) => {
  const { t } = useT();
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium shadow-sm ${className}`}
    >
      <ArrowLeft className="h-5 w-5 mr-2" /> {label || t('common.back')}
    </button>
  );
};

export default BackButton;
