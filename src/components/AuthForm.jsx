import React, { useState } from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { API_URL, UserRole } from '../constants';

const AuthForm = ({ isRegister = false, onSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(''); // Новое поле для аватара
  const [role, setRole] = useState(UserRole.SEEKER);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const action = isRegister ? 'register' : 'login';
    const body = { email, password };
    
    if (isRegister) {
      body.name = name;
      body.avatar = avatar; // Отправляем аватар
      body.role = role;
    }

    try {
      const response = await fetch(`${API_URL}/auth.php?action=${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegister) {
          alert('Регистрация успешна! Теперь войдите.');
          onNavigate('login');
        } else {
          onSuccess(data.user);
        }
      } else {
        setError(data.message || 'Произошла ошибка');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером (Backend не отвечает)');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { backgroundColor: '#ffffff', color: '#000000' };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 relative pt-12 md:pt-0">
      <button 
        onClick={() => onNavigate('home')} 
        className="absolute top-4 left-4 md:top-8 md:left-8 inline-flex items-center px-4 py-2 bg-white border border-blue-600 text-blue-700 rounded-md hover:bg-blue-50 transition-colors font-medium shadow-sm"
      >
        <ArrowLeft className="h-5 w-5 mr-2" /> На главную
      </button>

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100 mt-8 md:mt-0">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            {isRegister ? 'Создать аккаунт' : 'Вход в систему'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isRegister ? 'Уже есть аккаунт? ' : 'Нет аккаунта? '}
            <span 
              onClick={() => onNavigate(isRegister ? 'login' : 'register')}
              className="font-bold text-blue-600 hover:text-blue-500 cursor-pointer transition-colors"
            >
              {isRegister ? 'Войти' : 'Зарегистрироваться'}
            </span>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            {isRegister && (
              <>
                <div>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} style={inputStyle} className="appearance-none rounded-t-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors bg-white" placeholder="Ваше Имя" />
                </div>
                <div>
                  <input type="text" value={avatar} onChange={e => setAvatar(e.target.value)} style={inputStyle} className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors bg-white" placeholder="Ссылка на фото профиля (необязательно)" />
                </div>
              </>
            )}
            <div>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} className={`appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors bg-white ${!isRegister && 'rounded-t-lg'}`} placeholder="Email адрес" />
            </div>
            <div>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} className={`appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors bg-white ${!isRegister && 'rounded-b-lg'}`} placeholder="Пароль" />
            </div>
            {isRegister && (
              <div>
                <select value={role} onChange={e => setRole(e.target.value)} style={inputStyle} className="appearance-none rounded-b-lg relative block w-full px-3 py-3 border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm cursor-pointer">
                  <option value={UserRole.SEEKER}>Я ищу работу (Соискатель)</option>
                  <option value={UserRole.EMPLOYER}>Я нанимаю (Работодатель)</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all transform hover:scale-[1.02]">
              {loading ? 'Загрузка...' : (isRegister ? 'Зарегистрироваться' : 'Войти')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;