import React from 'react'
// Импорт основной библиотеки React — нужен, чтобы писать React-компоненты.
import ReactDOM from 'react-dom/client'
// Импорт модуля для рендера React в DOM (в современных версиях React через "react-dom/client").
import App from './App.jsx'
// Импорт главного компонента приложения, который отвечает за всю логику и страницы.
import './index.css'
// Подключение глобальных стилей приложения.

// Находим элемент с id="root" в HTML и создаём в нём React-приложение.
ReactDOM.createRoot(document.getElementById('root')).render(
  // Включаем строгий режим React — помогает ловить потенциальные проблемы во время разработки.
  <React.StrictMode>
    {/* Рендерим главный компонент приложения */}
    <App />
  </React.StrictMode>,
)