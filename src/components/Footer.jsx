import React from 'react';
import { Briefcase, Github, Mail, Phone, Server } from 'lucide-react';
import { useT } from '../i18n.jsx';

// Единый футер для лендинга и приложения.
// isConnected передаётся только из приложения — тогда показывается бейдж статуса бэкенда.
const Footer = ({ isConnected, onNavigate }) => {
  const { t } = useT();
  const go = (page) => { if (onNavigate) onNavigate(page); };
  const showStatus = typeof isConnected === 'boolean';

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Бренд + описание + соцсети + статус */}
          <div className="col-span-2">
            <div
              className="flex items-center text-white mb-4 cursor-pointer w-fit"
              onClick={() => go('home')}
            >
              <Briefcase className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-black">JobSearch</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              {t('landing.footer.about')}
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a href="#" onClick={(e) => e.preventDefault()} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors" title="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors" title="Email">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors" title="Phone">
                <Phone className="w-5 h-5" />
              </a>
            </div>

            {showStatus && (
              <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-sm">
                <Server className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">{t('footer.connection')}</span>
                <span className={`flex items-center font-bold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                  <span className={`h-2 w-2 rounded-full mr-1.5 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {isConnected ? t('footer.connected') : t('footer.disconnected')}
                </span>
              </div>
            )}
          </div>

          {/* Соискателям */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">{t('landing.footer.for_seekers')}</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => go('home')} className="hover:text-white transition-colors">{t('landing.footer.create_resume')}</button></li>
              <li><button onClick={() => go('home')} className="hover:text-white transition-colors">{t('landing.footer.search_vacancies')}</button></li>
              <li><button onClick={() => go('help')} className="hover:text-white transition-colors">{t('landing.footer.help')}</button></li>
            </ul>
          </div>

          {/* Работодателям */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">{t('landing.footer.for_employers')}</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => go('home')} className="hover:text-white transition-colors">{t('landing.footer.post_vacancy')}</button></li>
              <li><button onClick={() => go('home')} className="hover:text-white transition-colors">{t('landing.footer.search_resumes')}</button></li>
              <li><button onClick={() => go('help')} className="hover:text-white transition-colors">{t('landing.footer.support')}</button></li>
            </ul>
          </div>
        </div>

        {/* Нижняя полоса */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>{t('landing.footer.copyright')}</p>
          <p className="text-gray-600 dark:text-gray-500">{t('footer.stack')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
