
import React, { useState, useMemo } from 'react';
import { Trash2, Briefcase, Filter, X, Pencil, ChevronDown, Check, ChevronsUpDown, Heart, Loader2 } from 'lucide-react';
import { UserRole, API_URL } from '../constants';
import { useToast } from '../toast.jsx';
import { useDebounce } from '../hooks.js';
import { useT } from '../i18n.jsx';

const VacancyList = ({ vacancies, user, favorites = [], onToggleFavorite, onDelete, onEdit, onOpenVacancy, globalCity }) => {
  const toast = useToast();
  const { t } = useT();
  const [applyingId, setApplyingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [keywords, setKeywords] = useState('');
  const [employerFilter, setEmployerFilter] = useState('');
  const [withImageOnly, setWithImageOnly] = useState(false);
  const [sortBy, setSortBy] = useState('date_desc');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [period, setPeriod] = useState('all');
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 250);
  const debouncedKeywords = useDebounce(keywords, 250);
  const debouncedEmployer = useDebounce(employerFilter, 250);

  const sortOptions = [
    { id: 'date_desc',   label: t('vlist.sort.date_desc') },
    { id: 'date_asc',    label: t('vlist.sort.date_asc') },
    { id: 'salary_desc', label: t('vlist.sort.salary_desc') },
    { id: 'salary_asc',  label: t('vlist.sort.salary_asc') },
    { id: 'title_asc',   label: t('vlist.sort.title_asc') },
    { id: 'title_desc',  label: t('vlist.sort.title_desc') },
  ];

  const periodOptions = [
    { id: 'all',        label: t('vlist.period.all') },
    { id: 'month',      label: t('vlist.period.month') },
    { id: 'week',       label: t('vlist.period.week') },
    { id: 'three_days', label: t('vlist.period.three_days') },
  ];

  const parseSalary = (salaryStr) => {
    if (!salaryStr) return 0;
    const numeric = parseInt(salaryStr.replace(/\D/g, '')) || 0;
    return numeric;
  };

  const filteredVacancies = useMemo(() => {
    return vacancies.filter((job) => {
      const matchesTitle = job.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesKeywords = debouncedKeywords
        ? (job.description || '').toLowerCase().includes(debouncedKeywords.toLowerCase())
        : true;

      const jobSalary = parseSalary(job.salary);
      let matchesMinSalary = true;
      if (minSalary) {
        matchesMinSalary = jobSalary >= (parseInt(minSalary) || 0);
      }
      let matchesMaxSalary = true;
      if (maxSalary) {
        matchesMaxSalary = jobSalary <= (parseInt(maxSalary) || 0);
      }

      let matchesPeriod = true;
      if (period !== 'all') {
        const jobDate = new Date(job.created_at);
        const now = new Date();
        const diffDays = (now - jobDate) / (1000 * 60 * 60 * 24);

        if (period === 'month') matchesPeriod = diffDays <= 30;
        else if (period === 'week') matchesPeriod = diffDays <= 7;
        else if (period === 'three_days') matchesPeriod = diffDays <= 3;
      }

      const matchesCity = !globalCity || job.city === globalCity || !job.city;

      const matchesEmployer = !debouncedEmployer
        || (job.employer_name || '').toLowerCase().includes(debouncedEmployer.toLowerCase());

      const matchesImage = !withImageOnly || !!job.image;

      return matchesTitle && matchesKeywords && matchesMinSalary && matchesMaxSalary
          && matchesPeriod && matchesCity && matchesEmployer && matchesImage;
    });
  }, [vacancies, debouncedSearch, debouncedKeywords, minSalary, maxSalary, period, globalCity, debouncedEmployer, withImageOnly]);

  const sortedVacancies = useMemo(() => {
    const list = [...filteredVacancies];
    switch (sortBy) {
      case 'date_desc':   return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'date_asc':    return list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'salary_desc': return list.sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
      case 'salary_asc':  return list.sort((a, b) => parseSalary(a.salary) - parseSalary(b.salary));
      case 'title_asc':   return list.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'ru'));
      case 'title_desc':  return list.sort((a, b) => (b.title || '').localeCompare(a.title || '', 'ru'));
      default:            return list;
    }
  }, [filteredVacancies, sortBy]);

  const filtersActive = !!(searchTerm || minSalary || maxSalary || keywords || employerFilter || withImageOnly || period !== 'all');

  const handleResetFilters = () => {
    setSearchTerm('');
    setMinSalary('');
    setMaxSalary('');
    setKeywords('');
    setEmployerFilter('');
    setWithImageOnly(false);
    setSortBy('date_desc');
    setPeriod('all');
  };

  const handleApplyQuick = async (e, vacancyId) => {
    e.stopPropagation();
    if (!user) { toast.info(t('vlist.toast.login_first')); return; }
    if (user.role === UserRole.EMPLOYER) return;
    if (applyingId) return;

    setApplyingId(vacancyId);
    try {
      const response = await fetch(`${API_URL}/applications.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vacancy_id: vacancyId, seeker_id: user.id })
      });
      if (response.status === 409) {
        toast.info(t('vlist.toast.already_applied'));
      } else if (response.ok) {
        toast.success(t('vlist.toast.applied'));
      } else {
        toast.error(t('vlist.toast.apply_fail'));
      }
    } catch (error) {
      toast.error(t('common.network_error'));
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Боковая панель фильтров */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-24 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center text-sm"><Filter className="w-4 h-4 mr-2" /> {t('common.filters')}</h3>
            {filtersActive && (
              <button onClick={handleResetFilters} className="text-[10px] text-gray-400 hover:text-red-500 dark:hover:text-red-400 font-bold uppercase flex items-center transition-colors">
                <X className="w-3 h-3 mr-1" /> {t('common.reset')}
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider text-[9px]">{t('common.search')}</label>
              <input type="text" className="block w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800 focus:border-blue-300 dark:focus:border-blue-500 outline-none transition-all" placeholder={t('vlist.filter.search')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider text-[9px]">{t('vlist.filter.salary_from')}</label>
                <input type="number" className="block w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800 focus:border-blue-300 dark:focus:border-blue-500 outline-none transition-all" placeholder="0" value={minSalary} onChange={(e) => setMinSalary(e.target.value)} />
              </div>
              <div>
                <label className="block font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider text-[9px]">{t('vlist.filter.salary_to')}</label>
                <input type="number" className="block w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800 focus:border-blue-300 dark:focus:border-blue-500 outline-none transition-all" placeholder="∞" value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider text-[9px]">{t('vlist.filter.employer')}</label>
              <input type="text" className="block w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800 focus:border-blue-300 dark:focus:border-blue-500 outline-none transition-all" placeholder={t('vlist.filter.employer_placeholder')} value={employerFilter} onChange={(e) => setEmployerFilter(e.target.value)} />
            </div>
            <div>
              <label className="block font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider text-[9px]">{t('vlist.filter.skills')}</label>
              <input type="text" className="block w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800 focus:border-blue-300 dark:focus:border-blue-500 outline-none transition-all" placeholder={t('vlist.filter.skills_placeholder')} value={keywords} onChange={(e) => setKeywords(e.target.value)} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={withImageOnly} onChange={(e) => setWithImageOnly(e.target.checked)} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{t('vlist.filter.with_image')}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Основной список */}
      <div className="lg:col-span-3 space-y-4">
        
        {/* Панель управления (Сортировка и Период) */}
        <div className="flex items-center justify-between mb-2 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
          <div className="flex items-center space-x-6">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              {t('common.found')}: <span className="text-gray-900 dark:text-white">{sortedVacancies.length}</span>
            </span>
            
            {/* Сортировка */}
            <div className="relative">
              <button 
                onClick={() => { setIsSortOpen(!isSortOpen); setIsPeriodOpen(false); }}
                className="flex items-center text-[15px] font-normal text-gray-900 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-1.5 rounded-lg border border-transparent hover:border-gray-100 dark:hover:border-gray-600 transition-all"
              >
                {sortOptions.find(o => o.id === sortBy)?.label}
                <ChevronDown className={`ml-2 w-4 h-4 text-blue-600 dark:text-blue-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)}></div>
                  <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-20 py-2 overflow-hidden animate-in fade-in zoom-in duration-150">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSortBy(opt.id);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 text-[15px] flex items-center justify-between transition-colors bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white ${sortBy === opt.id ? 'font-medium' : 'font-normal'}`}
                      >
                        <span className="text-gray-900 dark:text-white">{opt.label}</span>
                        {sortBy === opt.id && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Фильтр по периоду */}
          <div className="relative">
             <button 
              onClick={() => { setIsPeriodOpen(!isPeriodOpen); setIsSortOpen(false); }}
              className="flex items-center text-[16px] font-normal text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 transition-all active:scale-95"
             >
               {periodOptions.find(p => p.id === period)?.label}
               <ChevronsUpDown className="ml-1.5 w-4 h-4 text-blue-500 dark:text-blue-400" />
             </button>

             {isPeriodOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsPeriodOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-[24px] shadow-2xl border border-gray-100 dark:border-gray-700 z-20 py-4 overflow-hidden animate-in fade-in zoom-in duration-150">
                    {periodOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setPeriod(opt.id);
                          setIsPeriodOpen(false);
                        }}
                        className={`w-full text-left px-6 py-3.5 text-[17px] flex items-center justify-between transition-colors bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white ${period === opt.id ? 'font-medium' : 'font-normal'}`}
                      >
                        <span className="text-gray-900 dark:text-white">{opt.label}</span>
                        {period === opt.id && <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                      </button>
                    ))}
                  </div>
                </>
             )}
          </div>
        </div>

        {/* Список карточек */}
        {sortedVacancies.map((job) => (
          <div 
            key={job.id} 
            className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm hover:shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 cursor-pointer group"
            onClick={() => onOpenVacancy(job.id)}
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-6 flex-grow">
                   {job.image ? (
                      <img src={job.image} alt="Logo" className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover bg-gray-50 dark:bg-gray-700 border border-gray-50 dark:border-gray-700 flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow" />
                   ) : (
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-200 dark:text-gray-500 flex-shrink-0 border border-dashed border-gray-200 dark:border-gray-600">
                          <Briefcase className="w-10 h-10" />
                      </div>
                   )}
                   <div className="flex-grow">
                      <h3 className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors leading-snug">{job.title}</h3>
                      <div className="mt-1 flex items-center text-gray-900 dark:text-white font-black text-xl">{job.salary}</div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-semibold">{job.employer_name}</p>
                      <div className="mt-3 text-sm text-gray-400 dark:text-gray-500 line-clamp-2 sm:line-clamp-3 leading-relaxed font-medium">{job.description}</div>
                   </div>
                </div>
                {user?.role === UserRole.EMPLOYER && String(user.id) === String(job.employer_id) && (
                    <div className="flex flex-col space-y-1 ml-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(job.id); }}
                      className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 p-2 transition-colors rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      title={t('vlist.edit_title')}
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(job.id); }}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-2 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30"
                      title={t('vlist.delete_title')}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                )}
                {user?.role === UserRole.SEEKER && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(job.id); }}
                    className={`ml-4 p-2 rounded-full transition-colors ${favorites.includes(job.id) ? 'text-red-500 bg-red-50 dark:bg-red-900/30' : 'text-gray-300 dark:text-gray-500 hover:text-red-400 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    title={favorites.includes(job.id) ? t('vlist.fav_remove') : t('vlist.fav_add')}
                  >
                    <Heart className={`h-6 w-6 ${favorites.includes(job.id) ? 'fill-current' : ''}`} />
                  </button>
                )}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-gray-50 dark:border-gray-700 pt-4">
                <span className="text-[11px] font-bold text-gray-300 dark:text-gray-500 uppercase tracking-widest">{new Date(job.created_at).toLocaleDateString()}</span>
                {(!user || user.role === UserRole.SEEKER) && (
                   <button
                    onClick={(e) => handleApplyQuick(e, job.id)}
                    disabled={applyingId === job.id}
                    className="inline-flex items-center px-8 py-2.5 text-sm font-black rounded-xl text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-lg shadow-blue-100 dark:shadow-none transition-all transform hover:scale-[1.03] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                   >
                     {applyingId === job.id && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                     {applyingId === job.id ? t('vlist.applying') : t('vlist.apply')}
                   </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {sortedVacancies.length === 0 && (
          <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
             <div className="bg-gray-50 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-gray-200 dark:text-gray-500" />
             </div>
             <p className="text-gray-400 dark:text-gray-500 font-bold text-lg">{t('common.nothing_found')}</p>
             <button onClick={handleResetFilters} className="mt-4 text-blue-400 dark:text-blue-500 font-bold hover:text-blue-500 dark:hover:text-blue-400 transition-colors">{t('common.reset_all')}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VacancyList;
