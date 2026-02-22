
import React, { useState, useEffect, useCallback } from 'react';
import { API_URL, UserRole } from './constants';
import { ArrowLeft } from 'lucide-react';

// Импорт компонентов из отдельных файлов
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedVacancyId, setSelectedVacancyId] = useState(null); 
  const [user, setUser] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [loadingVacancies, setLoadingVacancies] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [favorites, setFavorites] = useState([]);

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
      alert('Войдите, чтобы добавить в избранное');
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

  useEffect(() => {
    const savedUser = localStorage.getItem('jobhunter_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Ошибка чтения пользователя", e);
      }
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

  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('jobhunter_user', JSON.stringify(userData));
    setUser(userData);
    setCurrentPage('home');
    fetchVacancies();
  };

  const handleLogout = () => {
    localStorage.removeItem('jobhunter_user');
    setUser(null);
    setCurrentPage('login');
  };

  const handleDeleteVacancy = async (id) => {
    if (!window.confirm('Вы уверены?')) return;
    try {
      await fetch(`${API_URL}/vacancies.php?id=${id}`, { method: 'DELETE' });
      fetchVacancies();
    } catch (e) { alert('Ошибка удаления'); }
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Navbar user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        {!isConnected && currentPage === 'home' && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Нет связи с сервером!</strong>
            <span className="block sm:inline"> Проверьте OSPanel.</span>
          </div>
        )}

        {currentPage === 'home' && (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-2">
                Найди работу мечты
              </h1>
            </div>
            {loadingVacancies ? (
              <div className="text-center py-10">Загрузка...</div>
            ) : (
              <VacancyList 
                vacancies={vacancies} 
                user={user} 
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onDelete={handleDeleteVacancy}
                onEdit={handleEditVacancy}
                onOpenVacancy={handleOpenVacancy} 
              />
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
                className="mr-4 p-2 hover:bg-white rounded-full transition-colors text-blue-600"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-3xl font-extrabold text-gray-900">Мои опубликованные вакансии</h1>
            </div>
            {loadingVacancies ? (
              <div className="text-center py-10">Загрузка...</div>
            ) : (
              <VacancyList 
                vacancies={vacancies.filter(v => String(v.employer_id) === String(user.id))} 
                user={user} 
                onDelete={handleDeleteVacancy}
                onEdit={handleEditVacancy}
                onOpenVacancy={handleOpenVacancy} 
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
            />
        )}

        {currentPage === 'edit-vacancy' && selectedVacancyId && (
            <EditVacancyForm 
                vacancyId={selectedVacancyId} 
                onSuccess={() => { setCurrentPage('my-vacancies'); fetchVacancies(); }} 
                onCancel={() => setCurrentPage('my-vacancies')} 
            />
        )}

        {currentPage === 'help' && (
            <HelpPage onNavigate={setCurrentPage} />
        )}

        {currentPage === 'login' && <AuthForm onSuccess={handleLoginSuccess} onNavigate={setCurrentPage} />}
        {currentPage === 'register' && <AuthForm isRegister onSuccess={handleLoginSuccess} onNavigate={setCurrentPage} />}
        
        {currentPage === 'create-vacancy' && user && user.role === UserRole.EMPLOYER && (
          <CreateVacancyForm user={user} onSuccess={() => { setCurrentPage('my-vacancies'); fetchVacancies(); }} onCancel={() => setCurrentPage('home')} />
        )}

        {currentPage === 'applications' && user && user.role === UserRole.EMPLOYER && (
          <ApplicationsList user={user} onNavigate={setCurrentPage} />
        )}

        {currentPage === 'resume' && user && user.role === UserRole.SEEKER && (
          <ResumeForm user={user} onSuccess={() => alert('Резюме обновлено')} onNavigate={setCurrentPage} />
        )}

        {currentPage === 'seeker-applications' && user && user.role === UserRole.SEEKER && (
          <SeekerApplications user={user} onNavigate={setCurrentPage} />
        )}
      </main>

      <Footer isConnected={isConnected} />
    </div>
  );
}

export default App;
