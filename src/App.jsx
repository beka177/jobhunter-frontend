
import React, { useState, useEffect, useCallback } from 'react';
import { API_URL, UserRole } from './constants';
import { ArrowLeft } from 'lucide-react';
import { useToast } from './toast.jsx';

// Импорт компонентов из отдельных файлов
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import VacancyList from './components/VacancyList';
import CreateVacancyForm from './components/CreateVacancyForm';
import EditVacancyForm from './components/EditVacancyForm'; 
import AuthForm from './components/AuthForm';
import ApplicationsList from './components/ApplicationsList';
import ResumeForm from './components/ResumeForm';
import SeekerApplications from './components/SeekerApplications';
import VacancyDetails from './components/VacancyDetails';
import HelpPage from './components/HelpPage';
import FavoritesList from './components/FavoritesList';
import EditProfileForm from './components/EditProfileForm';
import AdminPanel from './components/AdminPanel';
import SeekerList from './components/SeekerList';
import MessagesPage from './components/MessagesPage';

function App() {
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState('loading');
  const [globalCity, setGlobalCity] = useState(localStorage.getItem('jobsearch_city') || 'Астана');
  const [selectedVacancyId, setSelectedVacancyId] = useState(null); 
  const [user, setUser] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [loadingVacancies, setLoadingVacancies] = useState(false);
  const [seekers, setSeekers] = useState([]);
  const [loadingSeekers, setLoadingSeekers] = useState(false);
  const [seekersError, setSeekersError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [chatTarget, setChatTarget] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const refreshUnread = useCallback(async () => {
    if (!user) { setUnreadMessages(0); return; }
    try {
      const r = await fetch(`${API_URL}/messages.php?action=unread&user_id=${user.id}`);
      if (r.ok) {
        const data = await r.json();
        setUnreadMessages(Number(data.unread) || 0);
      }
    } catch (e) { /* ignore */ }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    refreshUnread();
    const id = setInterval(refreshUnread, 30000);
    return () => clearInterval(id);
  }, [user, refreshUnread]);

  const openChatWith = (otherUserId, otherUserRole, vacancyId) => {
    if (!user) return;
    setChatTarget({ otherUserId, otherUserRole, vacancyId });
    setCurrentPage('messages');
  };

  const fetchFavorites = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_URL}/favorites.php?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setFavorites(data.map(item => item.id));
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки избранного", error);
    }
  }, []);

  useEffect(() => {
    if (user && user.role === UserRole.SEEKER) {
      fetchFavorites(user.id);
    } else {
      setFavorites([]);
    }
  }, [user, fetchFavorites]);

  const toggleFavorite = async (vacancyId) => {
    if (!user) {
      toast.info('Войдите, чтобы добавить в избранное');
      return;
    }
    
    const isFav = favorites.includes(vacancyId);
    const method = isFav ? 'DELETE' : 'POST';
    const url = isFav 
      ? `${API_URL}/favorites.php?user_id=${user.id}&vacancy_id=${vacancyId}`
      : `${API_URL}/favorites.php`;
    
    const body = isFav ? null : JSON.stringify({ user_id: user.id, vacancy_id: vacancyId });

    try {
      const response = await fetch(url, {
        method,
        headers: isFav ? {} : { 'Content-Type': 'application/json' },
        body
      });
      
      if (response.ok) {
        if (isFav) {
          setFavorites(prev => prev.filter(id => id !== vacancyId));
        } else {
          setFavorites(prev => [...prev, vacancyId]);
        }
      }
    } catch (error) {
      console.error("Ошибка обновления избранного", error);
    }
  };

  const handleCityChange = (newCity) => {
    setGlobalCity(newCity);
    localStorage.setItem('jobsearch_city', newCity);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('jobsearch_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setCurrentPage('home');
      } catch (e) {
        console.error("Ошибка чтения пользователя", e);
        setCurrentPage('landing');
      }
    } else {
      setCurrentPage('landing');
    }
  }, []);

  const fetchVacancies = useCallback(async () => {
    setLoadingVacancies(true);
    setConnectionError('');
    try {
      const response = await fetch(`${API_URL}/vacancies.php`);
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setVacancies(data);
        setIsConnected(true);
      } else {
        setVacancies([]);
      }
    } catch (error) {
      setIsConnected(false);
      setConnectionError('Ошибка: Сервер недоступен.');
    } finally {
      setLoadingVacancies(false);
    }
  }, []);

  const fetchSeekers = useCallback(async () => {
    setLoadingSeekers(true);
    setSeekersError('');
    try {
      const response = await fetch(`${API_URL}/seekers.php`);
      if (!response.ok) {
        let errText = await response.text();
        if (response.status === 404) throw new Error("Файл seekers.php не найден на сервере (404)!");
        if (response.status === 500) throw new Error("Внутренняя ошибка сервера (500). Возможно, таблица users не содержит некоторых колонок.\nОтвет сервера: " + errText);
        throw new Error(`Ошибка сервера: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setSeekers(data);
      } else {
        setSeekersError("Сервер вернул неправильный формат данных");
      }
    } catch (error) {
      console.error("Ошибка загрузки соискателей", error);
      setSeekersError(error.message || "Не удалось подключиться к серверу");
    } finally {
      setLoadingSeekers(false);
    }
  }, []);

  useEffect(() => {
    fetchVacancies();
    if (user?.role === UserRole.EMPLOYER) {
      fetchSeekers();
    }
  }, [fetchVacancies, fetchSeekers, user?.role]);

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('jobsearch_user', JSON.stringify(userData));
    setUser(userData);
    setCurrentPage('home');
    fetchVacancies();
  };

  const handleLogout = () => {
    localStorage.removeItem('jobsearch_user');
    setUser(null);
    setCurrentPage('landing');
  };

  const handleUpdateProfile = (updatedUser) => {
    localStorage.setItem('jobsearch_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setCurrentPage('home'); // Or stay on profile page? Let's go home for now or maybe stay.
  };

  const handleDeleteVacancy = async (id) => {
    if (!window.confirm('Вы уверены?')) return;
    try {
      const r = await fetch(`${API_URL}/vacancies.php?id=${id}`, { method: 'DELETE' });
      if (r.ok) {
        toast.success('Вакансия удалена');
        fetchVacancies();
      } else {
        toast.error('Не удалось удалить вакансию');
      }
    } catch (e) { toast.error('Ошибка сети при удалении'); }
  };

  const handleOpenVacancy = (id) => {
    setSelectedVacancyId(id);
    setCurrentPage('vacancy-details');
  };

  // Метод для перехода к редактированию
  const handleEditVacancy = (id) => {
    setSelectedVacancyId(id);
    setCurrentPage('edit-vacancy');
  };

  // Determine the actual view to render
  const renderView = () => {
    if (currentPage === 'loading') return <div className="flex-grow flex items-center justify-center">Загрузка...</div>;
    
    const isAuthPage = currentPage === 'login' || currentPage === 'register';
    
    // Если пользователь не авторизован и пытается попасть на любую страницу кроме входа/регистрации,
    // или если страница явно 'landing' -> Показываем LandingPage
    if (!user && !isAuthPage) {
      return <LandingPage onNavigate={setCurrentPage} onCityChange={handleCityChange} globalCity={globalCity} />;
    }

    if (currentPage === 'landing') return <LandingPage onNavigate={setCurrentPage} onCityChange={handleCityChange} globalCity={globalCity} />;

    return (
      <>
        <Navbar user={user} onLogout={handleLogout} onNavigate={setCurrentPage} globalCity={globalCity} onCityChange={handleCityChange} unreadMessages={unreadMessages} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
          {!isConnected && (currentPage === 'home' || !currentPage) && (
             <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800/50 text-red-700 dark:text-red-400 px-4 py-3 rounded relative mb-6">
              <strong className="font-bold">Нет связи с сервером!</strong>
              <span className="block sm:inline"> Проверьте OSPanel.</span>
            </div>
          )}

          {(currentPage === 'home' || currentPage === 'landing' && user) && (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl mb-2">
                  {user?.role === UserRole.EMPLOYER ? 'База резюме' : 'Найди работу мечты'}
                </h1>
              </div>
              {user?.role === UserRole.EMPLOYER ? (
                loadingSeekers ? (
                  <div className="text-center py-10 dark:text-gray-400">Загрузка кандидатов...</div>
                ) : seekersError ? (
                  <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded relative text-center">
                    <strong className="font-bold block text-lg mb-1">Не удалось загрузить списки резюме!</strong>
                    <span className="block">{seekersError}</span>
                    <span className="block mt-2 text-sm">Пожалуйста, убедитесь, что вы скопировали файл <b>seekers.php</b> в папку <b>OSPanel/domains/jobsearch/api/</b></span>
                  </div>
                ) : (
                  <SeekerList seekers={seekers} globalCity={globalCity} user={user} onOpenChat={openChatWith} />
                )
              ) : (
                loadingVacancies ? (
                  <div className="text-center py-10 dark:text-gray-400">Загрузка...</div>
                ) : (
                  <VacancyList 
                    vacancies={vacancies} 
                    user={user} 
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    onDelete={handleDeleteVacancy}
                    onEdit={handleEditVacancy}
                    onOpenVacancy={handleOpenVacancy} 
                    globalCity={globalCity}
                  />
                )
              )}
            </>
          )}

      {currentPage === 'favorites' && user && user.role === UserRole.SEEKER && (
        <FavoritesList 
          user={user} 
          onNavigate={setCurrentPage} 
          onOpenVacancy={handleOpenVacancy} 
        />
      )}

      {currentPage === 'my-vacancies' && user && user.role === UserRole.EMPLOYER && (
        <>
          <div className="flex items-center mb-8">
            <button 
              onClick={() => setCurrentPage('home')} 
              className="mr-4 p-2 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-colors text-blue-600 dark:text-blue-400"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Мои опубликованные вакансии</h1>
          </div>
          {loadingVacancies ? (
            <div className="text-center py-10 dark:text-gray-400">Загрузка...</div>
          ) : (
              <VacancyList 
                vacancies={vacancies.filter(v => String(v.employer_id) === String(user.id))} 
                user={user} 
                onDelete={handleDeleteVacancy}
                onEdit={handleEditVacancy}
                onOpenVacancy={handleOpenVacancy} 
                globalCity={globalCity}
              />
          )}
        </>
      )}

      {currentPage === 'vacancy-details' && selectedVacancyId && (
          <VacancyDetails
              vacancyId={selectedVacancyId}
              user={user}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onNavigate={setCurrentPage}
              onEdit={handleEditVacancy}
              onOpenChat={openChatWith}
          />
      )}

      {currentPage === 'messages' && user && (user.role === UserRole.SEEKER || user.role === UserRole.EMPLOYER) && (
          <MessagesPage
              user={user}
              onNavigate={setCurrentPage}
              chatTarget={chatTarget}
              onChatTargetConsumed={() => setChatTarget(null)}
              onUnreadRefresh={refreshUnread}
          />
      )}

      {currentPage === 'edit-vacancy' && selectedVacancyId && (
          <EditVacancyForm 
              vacancyId={selectedVacancyId} 
              onSuccess={() => { 
                if (user?.role === UserRole.ADMIN) {
                  setCurrentPage('admin-panel');
                } else {
                  setCurrentPage('my-vacancies'); 
                }
                fetchVacancies(); 
              }} 
              onCancel={() => {
                if (user?.role === UserRole.ADMIN) {
                  setCurrentPage('admin-panel');
                } else {
                  setCurrentPage('my-vacancies'); 
                }
              }} 
          />
      )}

      {currentPage === 'help' && (
          <HelpPage onNavigate={setCurrentPage} />
      )}

      {currentPage === 'login' && <AuthForm onSuccess={handleLoginSuccess} onNavigate={setCurrentPage} />}
      {currentPage === 'register' && <AuthForm isRegister onSuccess={handleLoginSuccess} onNavigate={setCurrentPage} />}
      
      {currentPage === 'edit-profile' && user && (
        <EditProfileForm 
          user={user} 
          onUpdate={handleUpdateProfile} 
          onCancel={() => setCurrentPage('home')} 
        />
      )}

      {currentPage === 'admin-panel' && user && user.role === UserRole.ADMIN && (
        <AdminPanel user={user} onNavigate={setCurrentPage} onEditVacancy={handleEditVacancy} />
      )}

      {currentPage === 'create-vacancy' && user && user.role === UserRole.EMPLOYER && (
        <CreateVacancyForm user={user} onSuccess={() => { setCurrentPage('my-vacancies'); fetchVacancies(); }} onCancel={() => setCurrentPage('home')} />
      )}

      {currentPage === 'applications' && user && user.role === UserRole.EMPLOYER && (
        <ApplicationsList user={user} onNavigate={setCurrentPage} onOpenChat={openChatWith} />
      )}

      {currentPage === 'resume' && user && user.role === UserRole.SEEKER && (
        <ResumeForm user={user} onSuccess={() => toast.success('Резюме обновлено')} onNavigate={setCurrentPage} />
      )}

      {currentPage === 'seeker-applications' && user && user.role === UserRole.SEEKER && (
        <SeekerApplications user={user} onNavigate={setCurrentPage} />
      )}
        </main>

        <Footer isConnected={isConnected} />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {renderView()}
    </div>
  );
}

export default App;
