import React, { useState, useEffect } from 'react';
import { MapPin, Search, Briefcase, Plus, User, HelpCircle, ChevronRight, GraduationCap } from 'lucide-react';
import { UserRole, API_URL } from '../constants';

const CITIES = ['Астана', 'Алматы', 'Шымкент', 'Караганда', 'Актобе', 'Тараз', 'Павлодар', 'Оскемен', 'Семей', 'Все города'];

const LandingPage = ({ onNavigate, onCityChange, globalCity }) => {
  const [activeTab, setActiveTab] = useState('seeker'); // 'seeker' or 'employer'
  const [email, setEmail] = useState('');
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
        // Ошибка сети или CORS - просто игнорируем для превью
      }
    };
    fetchPreviews();
  }, []);

  const handleContinue = (e) => {
    e.preventDefault();
    // Redirect to login/register with pre-filled email and chosen role (pre-fill not fully implemented yet in App state sharing, but changing route is correct)
    onNavigate('register');
  };

  const selectCity = (city) => {
    onCityChange(city === 'Все города' ? '' : city);
    setIsCityModalOpen(false);
  };

  const handleExploreClick = () => {
    onNavigate('register'); // Require auth to see full list for now
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm flex-shrink-0 z-10 w-full relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center cursor-pointer text-blue-600" onClick={() => onNavigate('landing')}>
              <Briefcase className="h-8 w-8" />
              <span className="ml-2 text-xl font-black text-gray-900 tracking-tight">JobSearch</span>
            </div>
            
            <div className="hidden md:flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('seeker')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'seeker' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Ищу работу
              </button>
              <button 
                onClick={() => setActiveTab('employer')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'employer' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Ищу сотрудника
              </button>
            </div>
            
            <button className="hidden lg:flex items-center text-sm font-medium text-gray-700 hover:text-blue-600" onClick={() => onNavigate('help')}>
              Помощь
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsCityModalOpen(true)}
              className="hidden sm:flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
              {globalCity || 'Все города'}
            </button>
            
            <button 
              onClick={() => onNavigate('login')}
              className="px-5 py-2 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              Войти
            </button>
            
            <button 
              onClick={() => onNavigate('register')}
              className="hidden md:block px-5 py-2 text-sm font-bold text-white bg-gray-900 hover:bg-black rounded-full transition-colors shadow-lg shadow-gray-200"
            >
              Зарегистрироваться
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col relative w-full items-center mb-10 overflow-hidden">
        <div className="relative w-full max-w-[1400px] mt-4 px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[500px]">
            {/* Background Image */}
            <img 
              src={activeTab === 'seeker' 
                ? "https://images.unsplash.com/photo-1664575602554-2087b04935a5?q=80&w=2670&auto=format&fit=crop" 
                : "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop"} 
              alt="Hero" 
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
            
            <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 md:px-24 max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-8">
                {activeTab === 'seeker' 
                  ? "Напишите адрес электронной почты, чтобы работодатели могли предложить вам работу" 
                  : "Напишите почту, чтобы разместить вакансию и найти лучших сотрудников"}
              </h1>
              
              <form onSubmit={handleContinue} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Электронная почта" 
                  className="flex-grow px-5 py-4 rounded-xl shadow-lg border-0 focus:ring-4 focus:ring-blue-500 outline-none text-lg text-gray-900 placeholder-gray-400 font-medium"
                />
                <button type="submit" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg transition-colors whitespace-nowrap">
                  Продолжить
                </button>
              </form>
              
              <p className="mt-4 text-sm text-gray-300 font-medium max-w-2xl">
                Нажимая «Продолжить», вы подтверждаете, что ознакомлены, полностью согласны и принимаете условия «соглашения»
              </p>
            </div>
            
            <div className="absolute bottom-8 left-8 sm:left-16 md:left-24 flex gap-8">
              <div>
                <div className="text-3xl font-bold text-white">12 400</div>
                <div className="text-sm font-medium text-gray-300 mt-1">резюме</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">3 150</div>
                <div className="text-sm font-medium text-gray-300 mt-1">вакансий</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">420</div>
                <div className="text-sm font-medium text-gray-300 mt-1">компаний</div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="w-full max-w-7xl mx-auto mt-16 px-4 sm:px-6 lg:px-8 mb-20">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {activeTab === 'seeker' ? 'Новые вакансии' : 'Новые кандидаты'}
            </h2>
            <button 
              onClick={handleExploreClick}
              className="text-blue-600 hover:text-blue-700 font-bold flex items-center transition-colors"
            >
              Смотреть все <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>

          {activeTab === 'seeker' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentVacancies.map(vacancy => (
                <div key={vacancy.id} onClick={handleExploreClick} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group flex flex-col">
                  {vacancy.image && (
                    <img src={vacancy.image} alt={vacancy.title} className="w-full h-40 object-cover rounded-xl mb-4 group-hover:opacity-90 transition-opacity" />
                  )}
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">{vacancy.title}</h3>
                  <p className="text-lg font-bold text-gray-900 mt-2">{vacancy.salary || 'Зарплата не указана'}</p>
                  <p className="text-gray-500 text-sm mt-1 mb-4 flex-grow">{vacancy.employer_name}</p>
                  <div className="flex items-center text-sm text-gray-600 mt-auto pt-4 border-t border-gray-100">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{vacancy.city || 'Не указан'}</span>
                  </div>
                </div>
              ))}
              {recentVacancies.length === 0 && (
                 <div className="col-span-3 text-center py-12 text-gray-500">Пока нет доступных вакансий...</div>
              )}
            </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentSeekers.map(seeker => (
                <div key={seeker.id} onClick={handleExploreClick} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    {seeker.avatar ? (
                      <img src={seeker.avatar} alt="Avatar" className="w-14 h-14 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {seeker.first_name || seeker.surname ? `${seeker.first_name} ${seeker.surname}` : seeker.name}
                      </h3>
                      <p className="text-blue-600 font-medium text-sm line-clamp-1">{seeker.profession || 'Профессия не указана'}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">{seeker.city || 'Не указан'}</span>
                    </div>
                    {seeker.education_level && (
                      <div className="flex items-center text-sm text-gray-600">
                        <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate">{seeker.education_level}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {recentSeekers.length === 0 && (
                 <div className="col-span-3 text-center py-12 text-gray-500">Пока нет доступных кандидатов...</div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* City Modal */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Выберите ваш город</h3>
              <button onClick={() => setIsCityModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CITIES.map(city => (
                  <button 
                    key={city}
                    onClick={() => selectCity(city)}
                    className={`py-2.5 px-3 text-sm font-medium rounded-xl text-center transition-all ${globalCity === city ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-100'}`}
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
