import React from 'react';
import { LucideServer } from 'lucide-react';

const Footer = ({ isConnected }) => (
  <footer className="bg-white border-t mt-auto py-6">
    <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-sm text-gray-500">
      <p className="font-medium">Курсовая работа "Разработка веб-приложения JobHunter"</p>
      <div className="mt-2 flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200">
        <LucideServer className="h-4 w-4" />
        <span>Статус соединения с Backend (OSPanel):</span>
        <span className={`flex items-center font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          <span className={`h-2 w-2 rounded-full mr-1.5 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          {isConnected ? 'Подключено' : 'Нет связи'}
        </span>
      </div>
      <p className="mt-2 text-xs text-gray-400">Frontend: React (JS) | Backend: PHP + MySQL</p>
    </div>
  </footer>
);

export default Footer;