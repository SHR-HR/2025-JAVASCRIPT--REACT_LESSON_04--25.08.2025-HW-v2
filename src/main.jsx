// Импортируем React из пакета 'react'
import React from 'react'
// Импортируем ReactDOM из пакета 'react-dom/client' (API React 18+)
import ReactDOM from 'react-dom/client'
// Импортируем главный компонент приложения
import App from './App.jsx'
// Импортируем глобальные стили для всего приложения
import './styles/global.scss'

// Создаем корневой элемент React и монтируем приложение в DOM
// document.getElementById('root') - находим HTML-элемент с id="root" в index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  // Оборачиваем приложение в StrictMode для дополнительных проверок в режиме разработки
  // StrictMode помогает обнаружить устаревшие API, небезопасные методы жизненного цикла
  // и другие потенциальные проблемы
  <React.StrictMode>
    {/* Рендерим главный компонент приложения */}
    <App />
  </React.StrictMode>
)




