import React, { useState } from 'react';
import { Search, MapPin, User, GraduationCap, Globe, X, Phone, Mail, Briefcase } from 'lucide-react';

const SeekerList = ({ seekers, globalCity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeeker, setSelectedSeeker] = useState(null);
  
  // Extra filters
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [eduLevel, setEduLevel] = useState('');
  const [genderFilter, setGenderFilter] = useState('');

  const filteredSeekers = seekers.filter(s => {
    const searchStr = `${s.profession || ''} ${s.name || ''} ${s.first_name || ''} ${s.surname || ''} ${s.skills || ''} ${s.city || ''}`.toLowerCase();
    const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
    const matchesCity = !globalCity || s.city === globalCity || !s.city;
    const matchesEdu = !eduLevel || s.education_level === eduLevel;
    const matchesGender = !genderFilter || s.gender === genderFilter;
    
    return matchesSearch && matchesCity && matchesEdu && matchesGender;
  });

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-24 transition-colors z-10 flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 p-3 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800 focus:border-blue-300 dark:focus:border-blue-500 outline-none transition-all"
              placeholder="Поиск по профессии, навыкам, имени или городу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`px-4 py-3 rounded-lg border font-medium text-sm transition-colors whitespace-nowrap flex items-center ${isFiltersOpen ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'}`}
          >
            Фильтры
          </button>
        </div>

        {isFiltersOpen && (
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">Уровень образования</label>
              <select 
                value={eduLevel} 
                onChange={(e) => setEduLevel(e.target.value)}
                className="block w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              >
                <option value="">Любое образование</option>
                <option value="Среднее">Среднее</option>
                <option value="Среднее специальное">Среднее специальное</option>
                <option value="Высшее">Высшее</option>
                <option value="Магистратура">Магистратура</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">Пол</label>
              <select 
                value={genderFilter} 
                onChange={(e) => setGenderFilter(e.target.value)}
                className="block w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              >
                <option value="">Любой</option>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* List */}
      {filteredSeekers.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Кандидаты не найдены</h3>
          <p className="text-gray-500 dark:text-gray-400">Попробуйте изменить параметры поиска</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSeekers.map(seeker => (
            <div 
              key={seeker.id} 
              onClick={() => setSelectedSeeker(seeker)}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className="flex items-start gap-4 mb-4">
                {seeker.avatar ? (
                  <img src={seeker.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                    <User className="w-8 h-8" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {seeker.first_name || seeker.surname ? `${seeker.first_name} ${seeker.surname}` : seeker.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium text-sm truncate">{seeker.profession || 'Профессия не указана'}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4 flex-grow">
                {seeker.city && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{seeker.city}</span>
                  </div>
                )}
                {seeker.education_level && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{seeker.education_level}</span>
                  </div>
                )}
              </div>

              {seeker.skills && (
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {seeker.skills.split(',').slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-xs font-medium border border-gray-200 dark:border-gray-600 truncate max-w-[120px]">
                        {skill.trim()}
                      </span>
                    ))}
                    {seeker.skills.split(',').length > 3 && (
                      <span className="px-2.5 py-1 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md text-xs font-medium border border-gray-200 dark:border-gray-600">
                        +{seeker.skills.split(',').length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedSeeker && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity" onClick={() => setSelectedSeeker(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-100 dark:border-gray-700">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-5 border-b dark:border-gray-700 pb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Резюме кандидата</h3>
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
                      <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mt-1">{selectedSeeker.profession || 'Профессия не указана'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                        <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1 uppercase tracking-wider font-bold">Город</span>
                        <span className="font-semibold text-gray-900 dark:text-white flex items-center">
                           <MapPin className="w-4 h-4 mr-2 text-blue-500" /> {selectedSeeker.city || 'Не указан'}
                        </span>
                     </div>
                     <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                        <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1 uppercase tracking-wider font-bold">Контакты</span>
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
                      <User className="w-5 h-5 mr-2 text-blue-500" /> Личные данные
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                          <span className="text-gray-500 dark:text-gray-400 block text-xs mb-1">Пол</span>
                          <span className="font-medium text-gray-900 dark:text-white">{selectedSeeker.gender === 'male' ? 'Мужской' : selectedSeeker.gender === 'female' ? 'Женский' : '-'}</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                          <span className="text-gray-500 dark:text-gray-400 block text-xs mb-1">Дата рождения</span>
                          <span className="font-medium text-gray-900 dark:text-white">{selectedSeeker.birthday || '-'}</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg col-span-2">
                          <span className="text-gray-500 dark:text-gray-400 block text-xs mb-1">Гражданство</span>
                          <span className="font-medium text-gray-900 dark:text-white">{selectedSeeker.citizenship || '-'}</span>
                        </div>
                    </div>
                  </div>

                  <div className="border-t dark:border-gray-700 pt-5">
                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center mb-4 text-lg">
                      <GraduationCap className="w-5 h-5 mr-2 text-blue-500" /> Образование
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                      <p className="text-base font-bold text-gray-900 dark:text-white mb-1">{selectedSeeker.education_level || 'Не указано'}</p>
                      {selectedSeeker.education_institution && <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{selectedSeeker.education_institution}</p>}
                      {selectedSeeker.education_faculty && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedSeeker.education_faculty}</p>}
                      {selectedSeeker.education_specialty && <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSeeker.education_specialty}</p>}
                      {selectedSeeker.education_year && <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Год окончания: {selectedSeeker.education_year}</p>}
                    </div>
                  </div>

                  {selectedSeeker.skills && (
                    <div className="border-t dark:border-gray-700 pt-5">
                      <h4 className="font-bold text-gray-900 dark:text-white flex items-center mb-4 text-lg">
                        <Globe className="w-5 h-5 mr-2 text-blue-500" /> Навыки
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
                        <Briefcase className="w-5 h-5 mr-2 text-blue-500" /> О себе
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl text-sm text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-600 whitespace-pre-wrap">
                        {selectedSeeker.about}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/80 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t dark:border-gray-700">
                <button type="button" className="w-full inline-flex justify-center rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm px-6 py-2.5 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:ml-3 sm:w-auto sm:text-sm transition-colors" onClick={() => setSelectedSeeker(null)}>Закрыть</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerList;
