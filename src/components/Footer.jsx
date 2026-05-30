import React from 'react';
import { Briefcase, Github, Mail } from 'lucide-react';
import { useT } from '../i18n.jsx';

const GITHUB_URL = 'https://github.com/beka177';
const EMAIL = 'bekaseitkali@gmail.com';

// Единый футер для лендинга и приложения.
const Footer = ({ onNavigate }) => {
  const { t } = useT();
  const go = (page) => { if (onNavigate) onNavigate(page); };

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
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors" title="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href={`mailto:${EMAIL}`} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors" title={EMAIL}>
                <Mail className="w-5 h-5" />
              </a>
            </div>
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
        <div className="mt-10 pt-6 border-t border-gray-800 flex justify-center items-center text-sm text-gray-500">
          <p>{t('landing.footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
