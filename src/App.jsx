// Импортируем основной компонент BookList для отображения списка книг
import BookList from './components/BookList/BookList'

// Основной компонент приложения App
function App() {
  // Возвращаем JSX разметку приложения
  return (
    // Основной контейнер приложения с классом "app"
    <div className="app">
      
      {/* Шапка приложения с классом "app__header" */}
      <header className="app__header">
        {/* Заголовок первого уровня */}
        <h1>Book Filters</h1>
        
        {/* Подзаголовок с описанием функционала приложения */}
        <p>Фильтрация, поиск и сортировка книг с синхронизацией URL</p>
      </header>
      
      {/* Основная часть приложения с классом "app__main" */}
      <main className="app__main">
        
        {/* Компонент BookList, который содержит всю логику работы с книгами */}
        <BookList />
      </main>
    </div>
  )
}

// Экспортируем компонент App по умолчанию для использования в main.jsx
export default App



