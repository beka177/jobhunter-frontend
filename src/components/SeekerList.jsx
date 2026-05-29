import React, { useMemo, useState } from 'react';
import {
  Search, MapPin, User, GraduationCap, Globe, X, Phone, Mail, Briefcase, MessageCircle,
  ArrowUpDown, SlidersHorizontal, CheckCircle2, Sparkles, Users, ChevronRight,
} from 'lucide-react';
import { useDebounce } from '../hooks.js';
import { UserRole } from '../constants';
import { useT } from '../i18n.jsx';

// Карточка-чип популярной профессии для quick-search.
const SuggestionChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
      active
        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-300'
    }`}
  >
    {label}
  </button>
);

// Отдельная карточка соискателя — теперь живее: цветной gradient-strip сверху, индикатор online,
// inline-метаданные с иконками, цветные skill-pill, явные действия снизу.
const SeekerCard = ({ seeker, onOpen, onChat, canChat, t }) => {
  const fullName = (seeker.first_name || seeker.surname)
    ? `${seeker.first_name || ''} ${seeker.surname || ''}`.trim()
    : (seeker.name || '');
  const initial = (fullName || 'U').charAt(0).toUpperCase();

  // Считаем «полноту» резюме — для бейджа
  const filledFields = [
    seeker.profession, seeker.city, seeker.education_level,
    seeker.skills, seeker.phone, seeker.birthday,
  ].filter(Boolean).length;
  const profileQuality =
    filledFields >= 5 ? { key: 'slist.badge.complete', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' } :
    filledFields >= 3 ? { key: 'slist.badge.partial',  cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' } :
                        null;

  const skillList = (seeker.skills || '').split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div
      onClick={onOpen}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
    >
      {/* Цветная полоса сверху */}
      <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      <div className="p-5 flex-1 flex flex-col">
        {/* Шапка: аватар + имя + бейдж качества */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative flex-shrink-0">
            {seeker.avatar ? (
              <img
                src={seeker.avatar}
                alt={fullName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white dark:ring-gray-700 shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
                {initial}
              </div>
            )}
            {/* Indicator "Доступен" */}
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full ring-2 ring-white dark:ring-gray-800 flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-gray-900 dark:text-white text-base leading-tight truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {fullName || t('common.not_specified')}
            </h3>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5 truncate">
              {seeker.profession || t('landing.recent.profession_unspecified')}
            </p>
            {profileQuality && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold mt-1.5 ${profileQuality.cls}`}>
                <Sparkles className="w-2.5 h-2.5" />
                {t(profileQuality.key)}
              </span>
            )}
          </div>
        </div>

        {/* Inline-метаданные */}
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-gray-600 dark:text-gray-400 mb-4">
          {seeker.city && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              {seeker.city}
            </span>
          )}
          {seeker.education_level && (
            <span className="inline-flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
              <span className="truncate max-w-[120px]">{seeker.education_level}</span>
            </span>
          )}
          {seeker.citizenship && (
            <span className="inline-flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              {seeker.citizenship}
            </span>
          )}
        </div>

        {/* Skill-pills */}
        {skillList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
            {skillList.slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-[11px] font-semibold truncate max-w-[140px]"
              >
                {skill}
              </span>
            ))}
            {skillList.length > 4 && (
              <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md text-[11px] font-bold">
                +{skillList.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Действия снизу */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={(e) => { e.stopPropagation(); onOpen(); }}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-bold transition-colors"
          >
            {t('slist.action.details')}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          {canChat && (
            <button
              onClick={(e) => { e.stopPropagation(); onChat(); }}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-colors shadow-sm"
              title={t('slist.modal.write')}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {t('slist.action.write')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SeekerList = ({ seekers, globalCity, user, onOpenChat }) => {
  const { t } = useT();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeeker, setSelectedSeeker] = useState(null);
  const [activeChip, setActiveChip] = useState('');

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [eduLevel, setEduLevel] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [citizenshipFilter, setCitizenshipFilter] = useState('');
  const [workPermitFilter, setWorkPermitFilter] = useState('');
  const [withResumeOnly, setWithResumeOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  const debouncedSearch = useDebounce(searchTerm, 250);

  const filtersActive = !!(eduLevel || genderFilter || citizenshipFilter || workPermitFilter || withResumeOnly);

  const handleResetFilters = () => {
    setEduLevel('');
    setGenderFilter('');
    setCitizenshipFilter('');
    setWorkPermitFilter('');
    setWithResumeOnly(false);
  };

  // Чипы популярных профессий — выбираем топ-N из реальных данных
  const popularProfessions = useMemo(() => {
    const counts = {};
    for (const s of seekers) {
      const p = (s.profession || '').trim();
      if (p) counts[p] = (counts[p] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([p]) => p);
  }, [seekers]);

  const handleChipClick = (label) => {
    if (activeChip === label) {
      setActiveChip('');
      setSearchTerm('');
    } else {
      setActiveChip(label);
      setSearchTerm(label);
    }
  };

  const filteredSeekers = useMemo(() => {
    const filtered = seekers.filter(s => {
      const searchStr = `${s.profession || ''} ${s.name || ''} ${s.first_name || ''} ${s.surname || ''} ${s.skills || ''} ${s.city || ''}`.toLowerCase();
      const matchesSearch = searchStr.includes(debouncedSearch.toLowerCase());
      const matchesCity = !globalCity || s.city === globalCity || !s.city;
      const matchesEdu = !eduLevel || s.education_level === eduLevel;
      const matchesGender = !genderFilter || s.gender === genderFilter;
      const matchesCitizenship = !citizenshipFilter || s.citizenship === citizenshipFilter;
      const matchesWorkPermit = !workPermitFilter || s.work_permit === workPermitFilter;
      const matchesResume = !withResumeOnly || !!s.profession;
      return matchesSearch && matchesCity && matchesEdu && matchesGender
          && matchesCitizenship && matchesWorkPermit && matchesResume;
    });

    const sorted = [...filtered];
    const fullName = (s) => (`${s.surname || ''} ${s.first_name || ''}`.trim() || s.name || '').toLowerCase();
    switch (sortBy) {
      case 'name_asc':       sorted.sort((a, b) => fullName(a).localeCompare(fullName(b), 'ru')); break;
      case 'name_desc':      sorted.sort((a, b) => fullName(b).localeCompare(fullName(a), 'ru')); break;
      case 'profession_asc': sorted.sort((a, b) => (a.profession || 'я').localeCompare(b.profession || 'я', 'ru')); break;
      case 'city_asc':       sorted.sort((a, b) => (a.city || 'я').localeCompare(b.city || 'я', 'ru')); break;
      default: break;
    }
    return sorted;
  }, [seekers, debouncedSearch, globalCity, eduLevel, genderFilter, citizenshipFilter, workPermitFilter, withResumeOnly, sortBy]);

  const canChat = user && user.role === UserRole.EMPLOYER && onOpenChat;

  return (
    <div className="space-y-6">
      {/* Hero-поиск: крупный, с подсказками-чипами */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-indigo-400/20 rounded-full" />

        <div className="relative">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-100 mb-2">
            <Users className="w-4 h-4" />
            {t('slist.hero.label')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 leading-tight">
            {t('slist.hero.title')}
          </h2>

          {/* Поисковая строка */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); if (activeChip) setActiveChip(''); }}
                placeholder={t('slist.search_placeholder')}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-0 outline-none focus:ring-4 focus:ring-white/30 placeholder-gray-400 text-sm font-medium shadow-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => { setSearchTerm(''); setActiveChip(''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-9 pr-8 py-3.5 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0 outline-none text-sm font-medium shadow-lg cursor-pointer w-full"
                >
                  <option value="default">{t('slist.sort.default')}</option>
                  <option value="name_asc">{t('slist.sort.name_asc')}</option>
                  <option value="name_desc">{t('slist.sort.name_desc')}</option>
                  <option value="profession_asc">{t('slist.sort.profession_asc')}</option>
                  <option value="city_asc">{t('slist.sort.city_asc')}</option>
                </select>
              </div>
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg whitespace-nowrap ${
                  isFiltersOpen || filtersActive
                    ? 'bg-yellow-300 text-gray-900'
                    : 'bg-white/15 backdrop-blur hover:bg-white/25 text-white border border-white/20'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">{t('common.filters')}</span>
                {filtersActive && <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-extrabold text-white bg-red-500 rounded-full">!</span>}
              </button>
            </div>
          </div>

          {/* Чипы популярных профессий */}
          {popularProfessions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 items-center">
              <span className="text-xs font-bold text-blue-100 mr-1">{t('slist.popular')}:</span>
              {popularProfessions.map(p => (
                <SuggestionChip
                  key={p}
                  label={p}
                  active={activeChip === p}
                  onClick={() => handleChipClick(p)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Развёрнутая панель фильтров */}
      {isFiltersOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg p-5 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{t('slist.filter.education')}</label>
              <select value={eduLevel} onChange={(e) => setEduLevel(e.target.value)}
                className="block w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-200">
                <option value="">{t('slist.filter.any')}</option>
                <option value="Среднее">{t('slist.edu.secondary')}</option>
                <option value="Среднее специальное">{t('slist.edu.secondary_special')}</option>
                <option value="Высшее">{t('slist.edu.higher')}</option>
                <option value="Магистратура">{t('slist.edu.master')}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{t('slist.filter.gender')}</label>
              <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}
                className="block w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-200">
                <option value="">{t('slist.filter.any_m')}</option>
                <option value="male">{t('slist.field.gender_male')}</option>
                <option value="female">{t('slist.field.gender_female')}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{t('slist.filter.citizenship')}</label>
              <select value={citizenshipFilter} onChange={(e) => setCitizenshipFilter(e.target.value)}
                className="block w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-200">
                <option value="">{t('slist.filter.any')}</option>
                <option value="Казахстан">{t('slist.cit.kz')}</option>
                <option value="Россия">{t('slist.cit.ru')}</option>
                <option value="Другое">{t('slist.cit.other')}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{t('slist.filter.work_permit')}</label>
              <select value={workPermitFilter} onChange={(e) => setWorkPermitFilter(e.target.value)}
                className="block w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-200">
                <option value="">{t('slist.filter.any')}</option>
                <option value="Казахстан">{t('slist.permit.kz')}</option>
                <option value="Россия">{t('slist.permit.ru')}</option>
                <option value="Не требуется">{t('slist.permit.none')}</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={withResumeOnly} onChange={(e) => setWithResumeOnly(e.target.checked)} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{t('slist.filter.with_resume')}</span>
            </label>
            {filtersActive && (
              <button onClick={handleResetFilters} className="text-xs font-bold text-gray-500 hover:text-red-500 dark:hover:text-red-400 uppercase flex items-center transition-colors">
                <X className="w-3 h-3 mr-1" /> {t('slist.reset_filters')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Счётчик результатов */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-extrabold text-gray-900 dark:text-white text-lg">{filteredSeekers.length}</span>{' '}
          {t('slist.found_total')}
        </p>
        {(searchTerm || filtersActive) && (
          <button
            onClick={() => { setSearchTerm(''); setActiveChip(''); handleResetFilters(); }}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t('common.reset_all')}
          </button>
        )}
      </div>

      {/* Сетка карточек */}
      {filteredSeekers.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('slist.empty.title')}</h3>
          <p className="text-gray-500 dark:text-gray-400">{t('slist.empty.subtitle')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSeekers.map(seeker => (
            <SeekerCard
              key={seeker.id}
              seeker={seeker}
              onOpen={() => setSelectedSeeker(seeker)}
              onChat={() => onOpenChat?.(seeker.id, 'seeker', null)}
              canChat={canChat}
              t={t}
            />
          ))}
        </div>
      )}

      {/* Модалка деталей — без изменений по логике, тот же UX */}
      {selectedSeeker && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity" onClick={() => setSelectedSeeker(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-100 dark:border-gray-700">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-5 border-b dark:border-gray-700 pb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('slist.modal.title')}</h3>
                  <button onClick={() => setSelectedSeeker(null)} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded-full transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-5">
                    {selectedSeeker.avatar ? (
                        <img src={selectedSeeker.avatar} alt="Avatar" className="h-20 w-20 rounded-full object-cover border-2 border-blue-100 dark:border-blue-900/50 shadow-sm" />
                    ) : (
                        <div className="h-20 w-20 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-2xl border-2 border-blue-100 dark:border-blue-800/50">
                            {(selectedSeeker.first_name || selectedSeeker.name || 'U').charAt(0).toUpperCase()}
                        </div>
                    )}

                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedSeeker.first_name || selectedSeeker.surname ? `${selectedSeeker.first_name} ${selectedSeeker.surname}` : selectedSeeker.name}
                      </p>
                      <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mt-1">{selectedSeeker.profession || t('landing.recent.profession_unspecified')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                        <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1 uppercase tracking-wider font-bold">{t('common.city')}</span>
                        <span className="font-semibold text-gray-900 dark:text-white flex items-center">
                           <MapPin className="w-4 h-4 mr-2 text-blue-500" /> {selectedSeeker.city || t('common.not_specified')}
                        </span>
                     </div>
                     <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                        <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1 uppercase tracking-wider font-bold">{t('slist.section.contacts')}</span>
                        <div className="space-y-1">
                          <span className="font-semibold text-gray-900 dark:text-white flex items-center text-sm">
                             <Mail className="w-4 h-4 mr-2 text-blue-500" /> {selectedSeeker.email}
                          </span>
                          {selectedSeeker.phone && (
                            <span className="font-semibold text-gray-900 dark:text-white flex items-center text-sm">
                               <Phone className="w-4 h-4 mr-2 text-blue-500" /> {selectedSeeker.phone}
                            </span>
                          )}
                        </div>
                     </div>
                  </div>

                  <div className="border-t dark:border-gray-700 pt-5">
                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center mb-4 text-lg">
                      <User className="w-5 h-5 mr-2 text-blue-500" /> {t('slist.section.personal')}
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                          <span className="text-gray-500 dark:text-gray-400 block text-xs mb-1">{t('slist.filter.gender')}</span>
                          <span className="font-medium text-gray-900 dark:text-white">{selectedSeeker.gender === 'male' ? t('slist.field.gender_male') : selectedSeeker.gender === 'female' ? t('slist.field.gender_female') : '-'}</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                          <span className="text-gray-500 dark:text-gray-400 block text-xs mb-1">{t('slist.field.birthday')}</span>
                          <span className="font-medium text-gray-900 dark:text-white">{selectedSeeker.birthday || '-'}</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg col-span-2">
                          <span className="text-gray-500 dark:text-gray-400 block text-xs mb-1">{t('slist.field.citizenship')}</span>
                          <span className="font-medium text-gray-900 dark:text-white">{selectedSeeker.citizenship || '-'}</span>
                        </div>
                    </div>
                  </div>

                  <div className="border-t dark:border-gray-700 pt-5">
                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center mb-4 text-lg">
                      <GraduationCap className="w-5 h-5 mr-2 text-blue-500" /> {t('slist.section.education')}
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                      <p className="text-base font-bold text-gray-900 dark:text-white mb-1">{selectedSeeker.education_level || t('slist.field.education_not_specified')}</p>
                      {selectedSeeker.education_institution && <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{selectedSeeker.education_institution}</p>}
                      {selectedSeeker.education_faculty && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedSeeker.education_faculty}</p>}
                      {selectedSeeker.education_specialty && <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSeeker.education_specialty}</p>}
                      {selectedSeeker.education_year && <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">{t('slist.field.education_year')}: {selectedSeeker.education_year}</p>}
                    </div>
                  </div>

                  {selectedSeeker.skills && (
                    <div className="border-t dark:border-gray-700 pt-5">
                      <h4 className="font-bold text-gray-900 dark:text-white flex items-center mb-4 text-lg">
                        <Globe className="w-5 h-5 mr-2 text-blue-500" /> {t('slist.section.skills')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSeeker.skills.split(',').map((skill, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium border border-blue-100 dark:border-blue-800/30">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSeeker.about && (
                    <div className="border-t dark:border-gray-700 pt-5">
                      <h4 className="font-bold text-gray-900 dark:text-white flex items-center mb-4 text-lg">
                        <Briefcase className="w-5 h-5 mr-2 text-blue-500" /> {t('slist.section.about')}
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl text-sm text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-600 whitespace-pre-wrap">
                        {selectedSeeker.about}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/80 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse gap-2 border-t dark:border-gray-700">
                <button type="button" className="w-full inline-flex justify-center rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm px-6 py-2.5 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:w-auto sm:text-sm transition-colors" onClick={() => setSelectedSeeker(null)}>{t('common.close')}</button>
                {user && user.role === UserRole.EMPLOYER && onOpenChat && (
                  <button
                    type="button"
                    onClick={() => { onOpenChat(selectedSeeker.id, 'seeker', null); setSelectedSeeker(null); }}
                    className="w-full inline-flex items-center justify-center rounded-xl border border-transparent shadow-sm px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-base font-bold text-white sm:w-auto sm:text-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" /> {t('slist.modal.write')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerList;
