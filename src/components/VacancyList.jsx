
import React, { useState, useMemo } from 'react';
import { Trash2, Briefcase, Filter, X, Pencil, ChevronDown, Check, ChevronsUpDown } from 'lucide-react';
import { UserRole, API_URL } from '../constants';

const VacancyList = ({ vacancies, user, onDelete, onEdit, onOpenVacancy }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [keywords, setKeywords] = useState('');
  const [sortBy, setSortBy] = useState('date_desc'); 
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const [period, setPeriod] = useState('all'); 
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);

  const sortOptions = [
    { id: 'date_desc', label: 'По дате' },
    { id: 'salary_asc', label: 'По возрастанию зарплаты' },
    { id: 'salary_desc', label: 'По убыванию зарплат' },
  ];

  const periodOptions = [
    { id: 'all', label: 'За всё время' },
    { id: 'month', label: 'За месяц' },
    { id: 'week', label: 'За неделю' },
    { id: 'three_days', label: 'За три дня' },
  ];

  const parseSalary = (salaryStr) => {
    if (!salaryStr) return 0;
    const numeric = parseInt(salaryStr.replace(/\D/g, '')) || 0;
    return numeric;
  };

  const filteredVacancies = useMemo(() => {
    return vacancies.filter((job) => {
      const matchesTitle = job.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesKeywords = keywords 
        ? job.description.toLowerCase().includes(keywords.toLowerCase()) 
        : true;

      let matchesSalary = true;
      if (minSalary) {
        const jobSalary = parseSalary(job.salary);
        const targetSalary = parseInt(minSalary) || 0;
        matchesSalary = jobSalary >= targetSalary;
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

      return matchesTitle && matchesKeywords && matchesSalary && matchesPeriod;
    });
  }, [vacancies, searchTerm, keywords, minSalary, period]);

  const sortedVacancies = useMemo(() => {
    const list = [...filteredVacancies];
    
    switch (sortBy) {
      case 'date_desc':
        return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'salary_desc':
        return list.sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
      case 'salary_asc':
        return list.sort((a, b) => parseSalary(a.salary) - parseSalary(b.salary));
      default:
        return list; 
    }
  }, [filteredVacancies, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setMinSalary('');
    setKeywords('');
    setSortBy('date_desc');
    setPeriod('all');
  };

  const handleApplyQuick = async (e, vacancyId) => {
    e.stopPropagation(); 
    if (!user) { alert('Войдите в систему'); return; }
    if (user.role === UserRole.EMPLOYER) return;

    try {
      const response = await fetch(`${API_URL}/applications.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vacancy_id: vacancyId, seeker_id: user.id })
      });
      if (response.status === 409) {
        alert('Вы уже откликнулись на эту вакансию ранее.');
      } else if (response.ok) {
        alert('Вы успешно откликнулись!');
      }
    } catch (error) { alert('Ошибка сети'); }
  };

  const inputStyle = { backgroundColor: '#ffffff', color: '#000000' };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Боковая панель фильтров */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center text-sm"><Filter className="w-4 h-4 mr-2" /> Фильтры</h3>
            {(searchTerm || minSalary || keywords || period !== 'all') && (
              <button onClick={handleResetFilters} className="text-[10px] text-gray-400 hover:text-red-500 font-bold uppercase flex items-center transition-colors">
                <X className="w-3 h-3 mr-1" /> Сбросить
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-500 mb-1 uppercase tracking-wider text-[9px]">Поиск</label>
              <input type="text" className="block w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all" placeholder="Должность..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label className="block font-semibold text-gray-500 mb-1 uppercase tracking-wider text-[9px]">Зарплата от</label>
              <input type="number" className="block w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all" placeholder="0" value={minSalary} onChange={(e) => setMinSalary(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label className="block font-semibold text-gray-500 mb-1 uppercase tracking-wider text-[9px]">Навыки</label>
              <input type="text" className="block w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all" placeholder="JS, React..." value={keywords} onChange={(e) => setKeywords(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>
      </div>

      {/* Основной список */}
      <div className="lg:col-span-3 space-y-4">
        
        {/* Панель управления (Сортировка и Период) */}
        <div className="flex items-center justify-between mb-2 bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-6">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              Найдено: <span className="text-gray-900">{sortedVacancies.length}</span>
            </span>
            
            {/* Сортировка */}
            <div className="relative">
              <button 
                onClick={() => { setIsSortOpen(!isSortOpen); setIsPeriodOpen(false); }}
                className="flex items-center text-[15px] font-normal text-gray-900 bg-white hover:bg-gray-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-gray-100 transition-all"
              >
                {sortOptions.find(o => o.id === sortBy)?.label}
                <ChevronDown className={`ml-2 w-4 h-4 text-blue-600 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)}></div>
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 py-2 overflow-hidden animate-in fade-in zoom-in duration-150">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSortBy(opt.id);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 text-[15px] flex items-center justify-between transition-colors bg-white hover:bg-gray-50 text-gray-900 ${sortBy === opt.id ? 'font-medium' : 'font-normal'}`}
                      >
                        <span className="text-gray-900">{opt.label}</span>
                        {sortBy === opt.id && <Check className="w-4 h-4 text-blue-600" />}
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
              className="flex items-center text-[16px] font-normal text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg bg-white transition-all active:scale-95"
             >
               {periodOptions.find(p => p.id === period)?.label}
               <ChevronsUpDown className="ml-1.5 w-4 h-4 text-blue-500" />
             </button>

             {isPeriodOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsPeriodOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-[24px] shadow-2xl border border-gray-100 z-20 py-4 overflow-hidden animate-in fade-in zoom-in duration-150">
                    {periodOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setPeriod(opt.id);
                          setIsPeriodOpen(false);
                        }}
                        className={`w-full text-left px-6 py-3.5 text-[17px] flex items-center justify-between transition-colors bg-white hover:bg-gray-50 text-gray-900 ${period === opt.id ? 'font-medium' : 'font-normal'}`}
                      >
                        <span className="text-gray-900">{opt.label}</span>
                        {period === opt.id && <Check className="w-5 h-5 text-blue-600" />}
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
            className="bg-white overflow-hidden shadow-sm hover:shadow-lg rounded-2xl border border-gray-100 transition-all duration-300 cursor-pointer group"
            onClick={() => onOpenVacancy(job.id)}
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-6 flex-grow">
                   {job.image ? (
                      <img src={job.image} alt="Logo" className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover bg-gray-50 border border-gray-50 flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow" />
                   ) : (
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-200 flex-shrink-0 border border-dashed border-gray-200">
                          <Briefcase className="w-10 h-10" />
                      </div>
                   )}
                   <div className="flex-grow">
                      <h3 className="text-lg sm:text-xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors leading-snug">{job.title}</h3>
                      <div className="mt-1 flex items-center text-gray-900 font-black text-xl">{job.salary}</div>
                      <p className="mt-1 text-sm text-gray-500 font-semibold">{job.employer_name}</p>
                      <div className="mt-3 text-sm text-gray-400 line-clamp-2 sm:line-clamp-3 leading-relaxed font-medium">{job.description}</div>
                   </div>
                </div>
                {user?.role === UserRole.EMPLOYER && String(user.id) === String(job.employer_id) && (
                  <div className="flex flex-col space-y-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit(job.id); }} 
                      className="text-gray-400 hover:text-blue-500 p-2 transition-colors rounded-xl hover:bg-blue-50"
                      title="Редактировать"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(job.id); }} 
                      className="text-gray-400 hover:text-red-500 p-2 transition-colors rounded-xl hover:bg-red-50"
                      title="Удалить"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
                <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">{new Date(job.created_at).toLocaleDateString()}</span>
                {(!user || user.role === UserRole.SEEKER) && (
                   <button 
                    onClick={(e) => handleApplyQuick(e, job.id)} 
                    className="px-8 py-2.5 text-sm font-black rounded-xl text-white bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-100 transition-all transform hover:scale-[1.03] active:scale-95"
                   >
                     Откликнуться
                   </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {sortedVacancies.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
             <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-gray-200" />
             </div>
             <p className="text-gray-400 font-bold text-lg">Ничего не нашли</p>
             <button onClick={handleResetFilters} className="mt-4 text-blue-400 font-bold hover:text-blue-500 transition-colors">Сбросить всё</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VacancyList;
