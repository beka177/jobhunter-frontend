import React from 'react';
// Футер — простая нижняя панель с информацией об авторе и стекe проекта.
import { LucideServer } from 'lucide-react';

const Footer = ({ isConnected }) => (
  <footer className="bg-white border-t mt-auto py-6">
    <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-sm text-gray-500">
      <p className="font-medium">Курсовая работа "Веб-сервис для поиска работы JobHunter"</p>
    <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-sm text-gray-500">
      <p className="font-medium">Сейткали Бекзат </p>

    </div>

      <p className="mt-2 text-xs text-gray-400">Frontend: React + JS</p>
      <p className="mt-0 text-xs text-gray-400">Backend: PHP + MySQL</p>
    </div>
  </footer>
);

export default Footer;