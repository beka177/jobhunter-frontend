import React, { useState, useEffect, useCallback } from 'react';
import { API_URL, UserRole } from './constants';

// Импорт компонентов из отдельных файлов
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import VacancyList from './components/VacancyList';
import CreateVacancyForm from './components/CreateVacancyForm';
import AuthForm from './components/AuthForm';
import ApplicationsList from './components/ApplicationsList';
import ResumeForm from './components/ResumeForm';
import SeekerApplications from './components/SeekerApplications';

// --- Основной компонент App ---
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [loadingVacancies, setLoadingVacancies] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState('');

  // 1. ВОССТАНОВЛЕНИЕ СЕССИИ (При загрузке страницы)
  useEffect(() => {
    // Проверяем, есть ли сохраненный пользователь в браузере
    const savedUser = localStorage.getItem('jobhunter_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Ошибка чтения пользователя из памяти", e);
      }
    }
  }, []);

  // Получение вакансий
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
        console.error("Expected array, got:", data);
        setVacancies([]);
      }
    } catch (error) {
      console.error("Failed to fetch vacancies:", error);
      setIsConnected(false);
      setConnectionError('Ошибка: Сервер недоступен. Убедитесь, что OSPanel запущен, а файлы лежат в domains/jobhunter/api');
    } finally {
      setLoadingVacancies(false);
    }
  }, []);

  // Проверка соединения при загрузке
  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  // 2. СОХРАНЕНИЕ СЕССИИ (При успешном входе)
  const handleLoginSuccess = (userData) => {
    // Сохраняем данные в память браузера
    localStorage.setItem('jobhunter_user', JSON.stringify(userData));
    
    setUser(userData);
    setCurrentPage('home');
    fetchVacancies();
  };

  // 3. УДАЛЕНИЕ СЕССИИ (При выходе)
  const handleLogout = () => {
    // Очищаем память браузера
    localStorage.removeItem('jobhunter_user');
    
    setUser(null);
    setCurrentPage('login');
  };

  const handleDeleteVacancy = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить вакансию?')) return;
    try {
      await fetch(`${API_URL}/vacancies.php?id=${id}`, { method: 'DELETE' });
      fetchVacancies(); // Обновляем список
    } catch (e) {
      alert('Ошибка удаления');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Navbar user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        {!isConnected && currentPage === 'home' && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Ошибка соединения с сервером!</strong>
            <span className="block sm:inline"> {connectionError || 'Проверьте консоль браузера (F12) для деталей.'}</span>
            <p className="mt-2 text-sm">Проверьте, что файлы бэкенда находятся в папке <code>OSPanel/domains/jobhunter/api</code></p>
          </div>
        )}

        {/* Главная страница */}
        {currentPage === 'home' && (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-2">
                Найди работу мечты
              </h1>
              <p className="text-lg text-gray-500">
                Тысячи вакансий от ведущих компаний.
              </p>
            </div>
            {loadingVacancies ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <VacancyList vacancies={vacancies} user={user} onDelete={handleDeleteVacancy} />
            )}
          </>
        )}

        {/* Страницы авторизации */}
        {currentPage === 'login' && (
          <AuthForm onSuccess={handleLoginSuccess} onNavigate={setCurrentPage} />
        )}

        {currentPage === 'register' && (
          <AuthForm isRegister onSuccess={handleLoginSuccess} onNavigate={setCurrentPage} />
        )}

        {/* Страницы работодателя */}
        {currentPage === 'create-vacancy' && user && user.role === UserRole.EMPLOYER && (
          <CreateVacancyForm 
            user={user} 
            onSuccess={() => {
              setCurrentPage('home');
              fetchVacancies();
            }} 
            onCancel={() => setCurrentPage('home')}
          />
        )}

        {/* 
          ВАЖНО: ApplicationsList строго внутри условия. 
          Если это не страница 'applications' или юзер не Employer, компонент даже не вызовется.
        */}
        {currentPage === 'applications' && user && user.role === UserRole.EMPLOYER && (
          <ApplicationsList user={user} />
        )}

        {/* Страницы соискателя */}
        {currentPage === 'resume' && user && user.role === UserRole.SEEKER && (
          <ResumeForm user={user} onSuccess={() => alert('Резюме обновлено')} />
        )}

        {currentPage === 'seeker-applications' && user && user.role === UserRole.SEEKER && (
          <SeekerApplications user={user} />
        )}
      </main>

      <Footer isConnected={isConnected} />
    </div>
  );
}

export default App;