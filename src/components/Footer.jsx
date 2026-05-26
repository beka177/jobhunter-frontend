import React from 'react';
import { Server } from 'lucide-react';
import { useT } from '../i18n.jsx';

const Footer = ({ isConnected }) => {
  const { t } = useT();
  return (
    <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        <p className="font-medium">{t('footer.title')}</p>
        <div className="mt-2 flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <Server className="h-4 w-4" />
          <span>{t('footer.connection')}</span>
          <span className={`flex items-center font-bold ${isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            <span className={`h-2 w-2 rounded-full mr-1.5 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {isConnected ? t('footer.connected') : t('footer.disconnected')}
          </span>
        </div>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">{t('footer.stack')}</p>
      </div>
    </footer>
  );
};

export default Footer;
