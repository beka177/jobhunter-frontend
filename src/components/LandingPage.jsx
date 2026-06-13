import React, { useState, useEffect } from 'react';
import {
  MapPin, Briefcase, User, ChevronRight, GraduationCap, Plus, Search,
  Zap, Shield, TrendingUp, Heart, FileText, CheckCircle2, Star,
  Code2, Megaphone, ShoppingBag, Palette, Wrench, Stethoscope, Truck, BookOpen,
  Quote, ArrowRight, Sparkles, Globe, Mail, Phone, Github,
  Users, Inbox, BarChart3
} from 'lucide-react';
import { API_URL, CITIES } from '../constants';
import { useT } from '../i18n.jsx';
import Footer from './Footer.jsx';

// Преимущества и шаги различаются для соискателя и работодателя
const FEATURES = {
  seeker: [
    { icon: Zap,        titleKey: 'landing.feature1.title', descKey: 'landing.feature1.desc', iconBg: 'bg-blue-500',   cardBg: 'bg-blue-50 dark:bg-blue-900/20',     border: 'border-blue-100 dark:border-blue-800/40' },
    { icon: Shield,     titleKey: 'landing.feature2.title', descKey: 'landing.feature2.desc', iconBg: 'bg-green-500',  cardBg: 'bg-green-50 dark:bg-green-900/20',   border: 'border-green-100 dark:border-green-800/40' },
    { icon: TrendingUp, titleKey: 'landing.feature3.title', descKey: 'landing.feature3.desc', iconBg: 'bg-purple-500', cardBg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-100 dark:border-purple-800/40' },
    { icon: Heart,      titleKey: 'landing.feature4.title', descKey: 'landing.feature4.desc', iconBg: 'bg-pink-500',   cardBg: 'bg-pink-50 dark:bg-pink-900/20',     border: 'border-pink-100 dark:border-pink-800/40' },
  ],
  employer: [
    { icon: Users,     titleKey: 'landing.empfeature1.title', descKey: 'landing.empfeature1.desc', iconBg: 'bg-blue-500',   cardBg: 'bg-blue-50 dark:bg-blue-900/20',     border: 'border-blue-100 dark:border-blue-800/40' },
    { icon: Plus,      titleKey: 'landing.empfeature2.title', descKey: 'landing.empfeature2.desc', iconBg: 'bg-green-500',  cardBg: 'bg-green-50 dark:bg-green-900/20',   border: 'border-green-100 dark:border-green-800/40' },
    { icon: Inbox,     titleKey: 'landing.empfeature3.title', descKey: 'landing.empfeature3.desc', iconBg: 'bg-purple-500', cardBg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-100 dark:border-purple-800/40' },
    { icon: BarChart3, titleKey: 'landing.empfeature4.title', descKey: 'landing.empfeature4.desc', iconBg: 'bg-pink-500',   cardBg: 'bg-pink-50 dark:bg-pink-900/20',     border: 'border-pink-100 dark:border-pink-800/40' },
  ],
};

const STEPS = {
  seeker: [
    { num: '01', icon: User,         titleKey: 'landing.step1.title', descKey: 'landing.step1.desc' },
    { num: '02', icon: FileText,     titleKey: 'landing.step2.title', descKey: 'landing.step2.desc' },
    { num: '03', icon: CheckCircle2, titleKey: 'landing.step3.title', descKey: 'landing.step3.desc' },
  ],
  employer: [
    { num: '01', icon: Plus,         titleKey: 'landing.empstep1.title', descKey: 'landing.empstep1.desc' },
    { num: '02', icon: Inbox,        titleKey: 'landing.empstep2.title', descKey: 'landing.empstep2.desc' },
    { num: '03', icon: CheckCircle2, titleKey: 'landing.empstep3.title', descKey: 'landing.empstep3.desc' },
  ],
};

const CATEGORIES = [
  { icon: Code2,       nameKey: 'landing.cat.it',           count: 1250, accent: 'blue' },
  { icon: Megaphone,   nameKey: 'landing.cat.marketing',    count: 420,  accent: 'pink' },
  { icon: ShoppingBag, nameKey: 'landing.cat.sales',        count: 890,  accent: 'green' },
  { icon: Palette,     nameKey: 'landing.cat.design',       count: 180,  accent: 'purple' },
  { icon: Wrench,      nameKey: 'landing.cat.construction', count: 630,  accent: 'orange' },
  { icon: Stethoscope, nameKey: 'landing.cat.medicine',     count: 210,  accent: 'red' },
  { icon: Truck,       nameKey: 'landing.cat.logistics',    count: 340,  accent: 'indigo' },
  { icon: BookOpen,    nameKey: 'landing.cat.education',    count: 290,  accent: 'teal' },
];

const CATEGORY_COLORS = {
  blue:   'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/40 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40',
  pink:   'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-pink-100 dark:border-pink-800/40 group-hover:bg-pink-100 dark:group-hover:bg-pink-900/40',
  green:  'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800/40 group-hover:bg-green-100 dark:group-hover:bg-green-900/40',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800/40 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40',
  orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800/40 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40',
  red:    'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/40 group-hover:bg-red-100 dark:group-hover:bg-red-900/40',
  indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/40 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40',
  teal:   'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-800/40 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/40',
};

const TESTIMONIALS = [
  { name: 'Айгерим Нурланова', roleKey: 'landing.testimonials.1.role', avatar: 'https://i.pravatar.cc/120?img=47', textKey: 'landing.testimonials.1.text', rating: 5 },
  { name: 'Данияр Касымов',    roleKey: 'landing.testimonials.2.role', avatar: 'https://i.pravatar.cc/120?img=12', textKey: 'landing.testimonials.2.text', rating: 5 },
  { name: 'Алия Бекова',       roleKey: 'landing.testimonials.3.role', avatar: 'https://i.pravatar.cc/120?img=23', textKey: 'landing.testimonials.3.text', rating: 5 },
];

const LandingPage = ({ onNavigate, onCityChange, globalCity }) => {
  const { t, lang, setLang } = useT();
  const [activeTab, setActiveTab] = useState('seeker');
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const [recentVacancies, setRecentVacancies] = useState([]);
  const [recentSeekers, setRecentSeekers] = useState([]);

  useEffect(() => {
    const fetchPreviews = async () => {
      try {
        const fetchWithFallback = (url) => fetch(url).catch(() => null);

        const [vacRes, seekRes] = await Promise.all([
          fetchWithFallback(`${API_URL}/vacancies.php`),
          fetchWithFallback(`${API_URL}/seekers.php`)
        ]);

        if (vacRes && vacRes.ok) {
          const vacData = await vacRes.json();
          if (Array.isArray(vacData)) setRecentVacancies(vacData.slice(0, 3));
        }

        if (seekRes && seekRes.ok) {
          const seekData = await seekRes.json();
          if (Array.isArray(seekData)) setRecentSeekers(seekData.slice(0, 3));
        }
      } catch (e) {
        // ignore
      }
    };
    fetchPreviews();
  }, []);

  const selectCity = (city) => {
    onCityChange(city === 'Все города' ? '' : city);
    setIsCityModalOpen(false);
  };

  const handleExploreClick = () => onNavigate('register');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col font-sans text-gray-900 dark:text-gray-100">
      {/* ============================ HEADER ============================ */}
      <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm flex-shrink-0 z-30 w-full sticky top-0 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center cursor-pointer text-blue-600 dark:text-blue-400" onClick={() => onNavigate('landing')}>
              <Briefcase className="h-8 w-8" />
              <span className="ml-2 text-xl font-black text-gray-900 dark:text-white tracking-tight">JobSearch</span>
            </div>

            <div className="hidden md:flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('seeker')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'seeker' ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              >{t('landing.tab.seeker')}</button>
              <button
                onClick={() => setActiveTab('employer')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'employer' ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              >{t('landing.tab.employer')}</button>
            </div>

            <button className="hidden lg:flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" onClick={() => onNavigate('help')}>
              {t('nav.help')}
            </button>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Переключатель языка */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center px-2 py-2 rounded-md text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors uppercase"
                title="Language / Тіл"
              >
                <Globe className="h-4 w-4 mr-1" />
                {lang === 'kk' ? 'KZ' : 'RU'}
              </button>
              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-1">
                    <button onClick={() => { setLang('ru'); setIsLangOpen(false); }} className={`w-full text-left px-4 py-2 text-sm ${lang === 'ru' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{t('lang.ru')}</button>
                    <button onClick={() => { setLang('kk'); setIsLangOpen(false); }} className={`w-full text-left px-4 py-2 text-sm ${lang === 'kk' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{t('lang.kk')}</button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setIsCityModalOpen(true)}
              className="hidden sm:flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <MapPin className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
              {globalCity || t('common.all_cities')}
            </button>

            <button
              onClick={() => onNavigate('login')}
              className="px-4 sm:px-5 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >{t('nav.login')}</button>

            <button
              onClick={() => onNavigate('register')}
              className="hidden md:block px-5 py-2 text-sm font-bold text-white bg-gray-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 rounded-full transition-colors shadow-lg shadow-gray-200 dark:shadow-blue-900/30"
            >{t('nav.register')}</button>
          </div>
        </div>
      </header>

      {/* ============================ HERO ============================ */}
      <section className="relative w-full max-w-[1400px] mx-auto mt-4 px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[560px] sm:h-[600px]">
          <img
            src={activeTab === 'seeker'
              ? 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2670&auto=format&fit=crop'
              : 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2670&auto=format&fit=crop'}
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20"></div>

          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 max-w-3xl">
            <div className="inline-flex items-center self-start gap-2 px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-xs sm:text-sm text-white font-semibold mb-5 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              {t(activeTab === 'seeker' ? 'landing.badge.seeker' : 'landing.badge.employer')}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-5 tracking-tight">
              {t(activeTab === 'seeker' ? 'landing.hero.title.seeker' : 'landing.hero.title.employer')}
            </h1>
            <p className="text-base sm:text-lg text-gray-200 mb-8 max-w-xl">
              {t(activeTab === 'seeker' ? 'landing.hero.desc.seeker' : 'landing.hero.desc.employer')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
              <button
                onClick={() => onNavigate('register')}
                className="inline-flex items-center justify-center px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-base shadow-xl shadow-blue-900/30 transition-all transform hover:scale-105 active:scale-95"
              >
                {t(activeTab === 'seeker' ? 'landing.cta.start_seeker' : 'landing.cta.start_employer')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="inline-flex items-center justify-center px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-base border border-white/30 backdrop-blur-sm transition-all"
              >
                {t('landing.cta.have_account')}
              </button>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> {t('landing.cta.free')}</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> {t('landing.cta.no_forms')}</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> {t('landing.cta.quick_signup')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ STATS STRIP ============================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-4 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { labelKey: 'landing.stats.resumes',   value: '12 400', icon: User,      color: 'text-blue-600 dark:text-blue-400' },
            { labelKey: 'landing.stats.vacancies', value: '3 150',  icon: Briefcase, color: 'text-green-600 dark:text-green-400' },
            { labelKey: 'landing.stats.companies', value: '420',    icon: Globe,     color: 'text-purple-600 dark:text-purple-400' },
            { labelKey: 'landing.stats.cities',    value: '10',     icon: MapPin,    color: 'text-pink-600 dark:text-pink-400' },
          ].map((s) => (
            <div key={s.labelKey} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-700 ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">{s.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t(s.labelKey)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ FEATURES ============================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3">{t('landing.features.badge')}</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">{t('landing.features.title')}</h2>
          <p className="mt-4 text-base sm:text-lg text-gray-500 dark:text-gray-400">{t('landing.features.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(FEATURES[activeTab] || FEATURES.seeker).map((f) => (
            <div key={f.titleKey} className={`p-6 rounded-2xl border ${f.cardBg} ${f.border} hover:shadow-lg transition-all hover:-translate-y-1`}>
              <div className={`w-12 h-12 rounded-xl ${f.iconBg} flex items-center justify-center text-white mb-4 shadow-md`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t(f.titleKey)}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t(f.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ HOW IT WORKS ============================ */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-16 lg:py-20 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3">{t('landing.steps.badge')}</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">{t('landing.steps.title')}</h2>
            <p className="mt-4 text-base sm:text-lg text-gray-500 dark:text-gray-400">{t('landing.steps.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
            {(STEPS[activeTab] || STEPS.seeker).map((s, idx, arr) => (
              <div key={s.num} className="relative bg-white dark:bg-gray-800 p-7 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-5">
                  <div className="text-5xl font-black text-gray-100 dark:text-gray-700 select-none">{s.num}</div>
                  <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-md">
                    <s.icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t(s.titleKey)}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t(s.descKey)}</p>
                {idx < arr.length - 1 && (
                  <ChevronRight className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-200 dark:text-gray-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ CATEGORIES ============================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3">{t('landing.categories.badge')}</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">{t('landing.categories.title')}</h2>
          <p className="mt-4 text-base sm:text-lg text-gray-500 dark:text-gray-400">{t('landing.categories.subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.nameKey}
              onClick={handleExploreClick}
              className="group text-left bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all"
            >
              <div className={`inline-flex p-3 rounded-xl border transition-colors ${CATEGORY_COLORS[c.accent]}`}>
                <c.icon className="w-6 h-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-gray-900 dark:text-white">{t(c.nameKey)}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{c.count.toLocaleString('ru-RU')} {t('landing.cat.vacancies_count')}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ============================ RECENT (ВАКАНСИИ / КАНДИДАТЫ) ============================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <span className="inline-block px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3">{t('landing.recent.badge')}</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              {t(activeTab === 'seeker' ? 'landing.recent.title.seeker' : 'landing.recent.title.employer')}
            </h2>
          </div>
          <button onClick={handleExploreClick} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold flex items-center transition-colors">
            {t('landing.recent.see_all')} <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>

        {activeTab === 'seeker' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentVacancies.map(vacancy => (
              <div key={vacancy.id} onClick={handleExploreClick} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all cursor-pointer group flex flex-col">
                {vacancy.image && (
                  <img src={vacancy.image} alt={vacancy.title} className="w-full h-40 object-cover rounded-xl mb-4 group-hover:opacity-90 transition-opacity" />
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{vacancy.title}</h3>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">{vacancy.salary || t('landing.recent.salary_unspecified')}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-4 flex-grow">{vacancy.employer_name}</p>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                  <span>{vacancy.city || t('common.not_specified')}</span>
                </div>
              </div>
            ))}
            {recentVacancies.length === 0 && (
              <div className="col-span-3 text-center py-12 text-gray-500 dark:text-gray-400">{t('landing.recent.no_vacancies')}</div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentSeekers.map(seeker => (
              <div key={seeker.id} onClick={handleExploreClick} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all cursor-pointer group flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  {seeker.avatar ? (
                    <img src={seeker.avatar} alt="Avatar" className="w-14 h-14 rounded-full object-cover border border-gray-200 dark:border-gray-600" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {seeker.first_name || seeker.surname ? `${seeker.first_name} ${seeker.surname}` : seeker.name}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium text-sm line-clamp-1">{seeker.profession || t('landing.recent.profession_unspecified')}</p>
                  </div>
                </div>
                <div className="space-y-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                    <span className="truncate">{seeker.city || t('common.not_specified')}</span>
                  </div>
                  {seeker.education_level && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <GraduationCap className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                      <span className="truncate">{seeker.education_level}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {recentSeekers.length === 0 && (
              <div className="col-span-3 text-center py-12 text-gray-500 dark:text-gray-400">{t('landing.recent.no_seekers')}</div>
            )}
          </div>
        )}
      </section>

      {/* ============================ TESTIMONIALS ============================ */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-16 lg:py-20 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3">{t('landing.testimonials.badge')}</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">{t('landing.testimonials.title')}</h2>
            <p className="mt-4 text-base sm:text-lg text-gray-500 dark:text-gray-400">{t('landing.testimonials.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((tm) => (
              <div key={tm.name} className="bg-white dark:bg-gray-800 p-7 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow relative">
                <Quote className="absolute top-5 right-5 w-10 h-10 text-blue-50 dark:text-blue-900/30" />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: tm.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 relative">{t(tm.textKey)}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <img src={tm.avatar} alt={tm.name} className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-600" />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{tm.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t(tm.roleKey)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ CTA BANNER ============================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-10 sm:p-14 shadow-2xl">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4 tracking-tight">
                {t(activeTab === 'employer' ? 'landing.cta_banner.title.employer' : 'landing.cta_banner.title')}
              </h2>
              <p className="text-base sm:text-lg text-blue-100 mb-8 max-w-xl">
                {t(activeTab === 'employer' ? 'landing.cta_banner.desc.employer' : 'landing.cta_banner.desc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => onNavigate('register')} className="inline-flex items-center justify-center px-7 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                  {t('landing.cta_banner.signup')} <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button onClick={() => onNavigate('login')} className="inline-flex items-center justify-center px-7 py-3.5 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 backdrop-blur border border-white/20 transition-colors">
                  {t('landing.cta_banner.login')}
                </button>
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop"
                  alt="Team"
                  className="rounded-2xl shadow-2xl w-80 h-80 object-cover border-4 border-white/20"
                />
                <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg text-white"><CheckCircle2 className="w-5 h-5" /></div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{t('landing.cta_banner.hired')}</div>
                    <div className="text-xs text-gray-500">{t('landing.cta_banner.hired_time')}</div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg text-white"><Sparkles className="w-5 h-5" /></div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{t('landing.cta_banner.new_apps')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ FOOTER ============================ */}
      <Footer onNavigate={onNavigate} />

      {/* ============================ CITY MODAL ============================ */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('landing.city_modal.title')}</h3>
              <button onClick={() => setIsCityModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CITIES.map(city => (
                  <button
                    key={city}
                    onClick={() => selectCity(city)}
                    className={`py-2.5 px-3 text-sm font-medium rounded-xl text-center transition-all ${globalCity === city ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-100 dark:border-gray-600'}`}
                  >
                    {city === 'Все города' ? t('common.all_cities') : city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
