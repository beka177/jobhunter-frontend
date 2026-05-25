import React, { useState, useEffect } from 'react';
import {
  MapPin, Briefcase, User, ChevronRight, GraduationCap, Plus, Search,
  Zap, Shield, TrendingUp, Heart, FileText, CheckCircle2, Star,
  Code2, Megaphone, ShoppingBag, Palette, Wrench, Stethoscope, Truck, BookOpen,
  Quote, ArrowRight, Sparkles, Globe, Mail, Phone, Github
} from 'lucide-react';
import { API_URL, CITIES } from '../constants';

const FEATURES = [
  {
    icon: Zap,
    title: 'Быстрый отклик',
    desc: 'Откликайтесь на вакансии в один клик — без долгих форм и переписок.',
    iconBg: 'bg-blue-500',
    cardBg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-100 dark:border-blue-800/40',
  },
  {
    icon: Shield,
    title: 'Проверенные компании',
    desc: 'Работодатели проходят модерацию — мы убираем подозрительные объявления.',
    iconBg: 'bg-green-500',
    cardBg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-100 dark:border-green-800/40',
  },
  {
    icon: TrendingUp,
    title: 'Удобные фильтры',
    desc: 'Ищите по зарплате, городу, дате публикации и ключевым навыкам.',
    iconBg: 'bg-purple-500',
    cardBg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-100 dark:border-purple-800/40',
  },
  {
    icon: Heart,
    title: 'Избранное',
    desc: 'Сохраняйте интересные вакансии, чтобы вернуться и откликнуться позже.',
    iconBg: 'bg-pink-500',
    cardBg: 'bg-pink-50 dark:bg-pink-900/20',
    border: 'border-pink-100 dark:border-pink-800/40',
  },
];

const STEPS = [
  {
    num: '01',
    icon: User,
    title: 'Регистрация',
    desc: 'Создайте аккаунт за 30 секунд — выберите роль соискателя или работодателя.',
  },
  {
    num: '02',
    icon: FileText,
    title: 'Заполните профиль',
    desc: 'Составьте резюме или опубликуйте вакансию — добавьте опыт, навыки и контакты.',
  },
  {
    num: '03',
    icon: CheckCircle2,
    title: 'Получайте отклики',
    desc: 'Откликайтесь на интересные предложения и отслеживайте статус ваших заявок.',
  },
];

const CATEGORIES = [
  { icon: Code2, name: 'IT и разработка', count: 1250, accent: 'blue' },
  { icon: Megaphone, name: 'Маркетинг и PR', count: 420, accent: 'pink' },
  { icon: ShoppingBag, name: 'Продажи', count: 890, accent: 'green' },
  { icon: Palette, name: 'Дизайн', count: 180, accent: 'purple' },
  { icon: Wrench, name: 'Строительство', count: 630, accent: 'orange' },
  { icon: Stethoscope, name: 'Медицина', count: 210, accent: 'red' },
  { icon: Truck, name: 'Логистика и склад', count: 340, accent: 'indigo' },
  { icon: BookOpen, name: 'Образование', count: 290, accent: 'teal' },
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
  {
    name: 'Айгерим Нурланова',
    role: 'Frontend-разработчик',
    avatar: 'https://i.pravatar.cc/120?img=47',
    text: 'Нашла работу мечты за две недели. Очень удобный интерфейс — откликаешься в один клик и сразу видишь статус.',
    rating: 5,
  },
  {
    name: 'Данияр Касымов',
    role: 'Менеджер по продажам',
    avatar: 'https://i.pravatar.cc/120?img=12',
    text: 'Пользуюсь JobSearch уже полгода. Получаю достойные предложения почти каждую неделю — фильтры реально работают.',
    rating: 5,
  },
  {
    name: 'Алия Бекова',
    role: 'HR-менеджер',
    avatar: 'https://i.pravatar.cc/120?img=23',
    text: 'Со стороны работодателя — отличный инструмент. База кандидатов с детальными резюме и удобной фильтрацией.',
    rating: 5,
  },
];

const LandingPage = ({ onNavigate, onCityChange, globalCity }) => {
  const [activeTab, setActiveTab] = useState('seeker');
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

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
              >Ищу работу</button>
              <button
                onClick={() => setActiveTab('employer')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'employer' ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              >Ищу сотрудника</button>
            </div>

            <button className="hidden lg:flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" onClick={() => onNavigate('help')}>
              Помощь
            </button>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => setIsCityModalOpen(true)}
              className="hidden sm:flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <MapPin className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
              {globalCity || 'Все города'}
            </button>

            <button
              onClick={() => onNavigate('login')}
              className="px-4 sm:px-5 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >Войти</button>

            <button
              onClick={() => onNavigate('register')}
              className="hidden md:block px-5 py-2 text-sm font-bold text-white bg-gray-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 rounded-full transition-colors shadow-lg shadow-gray-200 dark:shadow-blue-900/30"
            >Зарегистрироваться</button>
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
              {activeTab === 'seeker' ? 'Свыше 3 000 актуальных вакансий' : 'Более 12 000 готовых резюме'}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-5 tracking-tight">
              {activeTab === 'seeker'
                ? 'Найдите работу мечты в Казахстане'
                : 'Найдите лучших сотрудников быстро и просто'}
            </h1>
            <p className="text-base sm:text-lg text-gray-200 mb-8 max-w-xl">
              {activeTab === 'seeker'
                ? 'Тысячи вакансий от проверенных компаний. Откликайтесь в один клик — без анкет и звонков.'
                : 'Размещайте вакансии бесплатно и находите подходящих кандидатов по навыкам, городу и опыту.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
              <button
                onClick={() => onNavigate('register')}
                className="inline-flex items-center justify-center px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-base shadow-xl shadow-blue-900/30 transition-all transform hover:scale-105 active:scale-95"
              >
                {activeTab === 'seeker' ? 'Начать поиск работы' : 'Найти сотрудников'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="inline-flex items-center justify-center px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-base border border-white/30 backdrop-blur-sm transition-all"
              >
                У меня уже есть аккаунт
              </button>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Бесплатно</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Без анкет и звонков</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Регистрация за 30 секунд</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ STATS STRIP ============================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-4 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Резюме', value: '12 400', icon: User, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Вакансий', value: '3 150', icon: Briefcase, color: 'text-green-600 dark:text-green-400' },
            { label: 'Компаний', value: '420', icon: Globe, color: 'text-purple-600 dark:text-purple-400' },
            { label: 'Городов', value: '10', icon: MapPin, color: 'text-pink-600 dark:text-pink-400' },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-700 ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">{s.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ FEATURES ============================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3">Преимущества</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">Почему именно JobSearch</h2>
          <p className="mt-4 text-base sm:text-lg text-gray-500 dark:text-gray-400">Платформа, которая делает поиск работы и сотрудников простым и быстрым.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className={`p-6 rounded-2xl border ${f.cardBg} ${f.border} hover:shadow-lg transition-all hover:-translate-y-1`}>
              <div className={`w-12 h-12 rounded-xl ${f.iconBg} flex items-center justify-center text-white mb-4 shadow-md`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ HOW IT WORKS ============================ */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-16 lg:py-20 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3">3 простых шага</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">Как это работает</h2>
            <p className="mt-4 text-base sm:text-lg text-gray-500 dark:text-gray-400">От регистрации до первого отклика — несколько минут.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
            {STEPS.map((s, idx) => (
              <div key={s.num} className="relative bg-white dark:bg-gray-800 p-7 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-5">
                  <div className="text-5xl font-black text-gray-100 dark:text-gray-700 select-none">{s.num}</div>
                  <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-md">
                    <s.icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{s.desc}</p>
                {idx < STEPS.length - 1 && (
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
          <span className="inline-block px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3">Категории</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">Популярные сферы</h2>
          <p className="mt-4 text-base sm:text-lg text-gray-500 dark:text-gray-400">Выберите направление и посмотрите актуальные вакансии.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              onClick={handleExploreClick}
              className="group text-left bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all"
            >
              <div className={`inline-flex p-3 rounded-xl border transition-colors ${CATEGORY_COLORS[c.accent]}`}>
                <c.icon className="w-6 h-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-gray-900 dark:text-white">{c.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{c.count.toLocaleString('ru-RU')} вакансий</p>
            </button>
          ))}
        </div>
      </section>

      {/* ============================ RECENT (ВАКАНСИИ / КАНДИДАТЫ) ============================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <span className="inline-block px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3">Свежие</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              {activeTab === 'seeker' ? 'Новые вакансии' : 'Новые кандидаты'}
            </h2>
          </div>
          <button onClick={handleExploreClick} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold flex items-center transition-colors">
            Смотреть все <ChevronRight className="w-5 h-5 ml-1" />
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
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">{vacancy.salary || 'Зарплата не указана'}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-4 flex-grow">{vacancy.employer_name}</p>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                  <span>{vacancy.city || 'Не указан'}</span>
                </div>
              </div>
            ))}
            {recentVacancies.length === 0 && (
              <div className="col-span-3 text-center py-12 text-gray-500 dark:text-gray-400">Пока нет доступных вакансий...</div>
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
                    <p className="text-blue-600 dark:text-blue-400 font-medium text-sm line-clamp-1">{seeker.profession || 'Профессия не указана'}</p>
                  </div>
                </div>
                <div className="space-y-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                    <span className="truncate">{seeker.city || 'Не указан'}</span>
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
              <div className="col-span-3 text-center py-12 text-gray-500 dark:text-gray-400">Пока нет доступных кандидатов...</div>
            )}
          </div>
        )}
      </section>

      {/* ============================ TESTIMONIALS ============================ */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-16 lg:py-20 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3">Отзывы</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">Что говорят пользователи</h2>
            <p className="mt-4 text-base sm:text-lg text-gray-500 dark:text-gray-400">Тысячи людей уже нашли работу или сотрудников через JobSearch.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white dark:bg-gray-800 p-7 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow relative">
                <Quote className="absolute top-5 right-5 w-10 h-10 text-blue-50 dark:text-blue-900/30" />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 relative">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-600" />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{t.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t.role}</div>
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
                Готовы найти работу мечты?
              </h2>
              <p className="text-base sm:text-lg text-blue-100 mb-8 max-w-xl">
                Создайте бесплатный аккаунт прямо сейчас и начните откликаться на вакансии или искать сотрудников уже сегодня.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => onNavigate('register')} className="inline-flex items-center justify-center px-7 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                  Зарегистрироваться <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button onClick={() => onNavigate('login')} className="inline-flex items-center justify-center px-7 py-3.5 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 backdrop-blur border border-white/20 transition-colors">
                  У меня уже есть аккаунт
                </button>
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop"
                  alt="Команда"
                  className="rounded-2xl shadow-2xl w-80 h-80 object-cover border-4 border-white/20"
                />
                <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg text-white"><CheckCircle2 className="w-5 h-5" /></div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Принят на работу!</div>
                    <div className="text-xs text-gray-500">2 минуты назад</div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg text-white"><Sparkles className="w-5 h-5" /></div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">+5 новых откликов</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ FOOTER ============================ */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center text-white mb-4">
                <Briefcase className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-black">JobSearch</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed max-w-md">
                Платформа для поиска работы и сотрудников в Казахстане. Курсовая работа по разработке веб-приложения на React и PHP.
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
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Соискателям</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => onNavigate('register')} className="hover:text-white transition-colors">Создать резюме</button></li>
                <li><button onClick={() => onNavigate('register')} className="hover:text-white transition-colors">Поиск вакансий</button></li>
                <li><button onClick={() => onNavigate('help')} className="hover:text-white transition-colors">Помощь</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Работодателям</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => onNavigate('register')} className="hover:text-white transition-colors">Разместить вакансию</button></li>
                <li><button onClick={() => onNavigate('register')} className="hover:text-white transition-colors">База резюме</button></li>
                <li><button onClick={() => onNavigate('help')} className="hover:text-white transition-colors">Поддержка</button></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
            <p>© 2026 JobSearch — Курсовая работа</p>
            <p>Frontend: React + Vite | Backend: PHP + MySQL</p>
          </div>
        </div>
      </footer>

      {/* ============================ CITY MODAL ============================ */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Выберите ваш город</h3>
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
                    {city}
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
