// Импортируем компонент Alert для отображения уведомлений
import Alert from '../Alert/Alert'
// Импортируем CSS-модуль для стилизации компонента
import styles from './BookList.module.scss'

// Импортируем компоненты для работы со списком книг
import Filters from './Filters' // Компонент фильтров
import Stats from './Stats' // Компонент статистики
import BooksGrid from './BooksGrid' // Компонент сетки книг
// Импортируем кастомный хук для управления состоянием списка книг
import { useBookListController } from '../../hooks/useBookListController'
// Импортируем массив книг из файла с данными
import { books } from '../../data/books'

// Основной компонент BookList для отображения и управления списком книг
function BookList() {
  // Используем кастомный хук для управления состоянием и логикой списка книг
  // Передаем в хук массив книг и получаем объект с состояниями и методами
  const {
    // Состояния (state)
    query,        // Строка поискового запроса
    minPages,     // Минимальное количество страниц для фильтрации
    maxPages,     // Максимальное количество страниц для фильтрации
    sortOrder,    // Порядок сортировки (например, 'asc', 'desc')
    alert,        // Объект уведомления (сообщение, тип и настройки)
    
    // Функции для изменения состояний (setters)
    setQuery,     // Установка поискового запроса
    setSortOrder, // Установка порядка сортировки
    setAlert,     // Установка уведомления
    
    // Производные данные (derived)
    visibleBooks, // Отфильтрованный и отсортированный список книг
    over400Count, // Количество книг с более чем 400 страницами
    
    // Обработчики событий (handlers)
    handleReset,           // Сброс фильтров и сортировки
    handleCopyLink,        // Копирование ссылки с текущими параметрами
    handleMinPagesChange,  // Изменение минимального количества страниц
    handleMaxPagesChange,  // Изменение максимального количества страниц
  } = useBookListController(books) // ← данные передаём в хук

  // Рендерим компонент
  return (
    // Основной контейнер списка книг
    <div className={styles.bookList}>
      
      {/* Условный рендеринг компонента Alert: отображаем если alert существует */}
      {alert && (
        <Alert
          kind={alert.kind} // Тип уведомления (info, warning, error, success)
          autoClose={alert.autoClose} // Флаг автоматического закрытия
          autoCloseDelay={alert.autoCloseDelay} // Задержка автоматического закрытия
          onClose={() => setAlert(null)} // Обработчик закрытия (убираем уведомление)
        >
          {alert.message} {/* Текст сообщения уведомления */}
        </Alert>
      )}

      {/* Компонент фильтров с передачей необходимых пропсов */}
      <Filters
        query={query} // Текущий поисковый запрос
        onQueryChange={setQuery} // Обработчик изменения поискового запроса
        minPages={minPages} // Минимальное количество страниц
        maxPages={maxPages} // Максимальное количество страниц
        onMinChange={handleMinPagesChange} // Обработчик изменения минимального количества страниц
        onMaxChange={handleMaxPagesChange} // Обработчик изменения максимального количества страниц
        sortOrder={sortOrder} // Текущий порядок сортировки
        onSortChange={setSortOrder} // Обработчик изменения порядка сортировки
        onReset={handleReset} // Обработчик сброса фильтров
        onCopyLink={handleCopyLink} // Обработчик копирования ссылки
      />

      {/* Компонент статистики с передачей количества книг */}
      <Stats 
        total={visibleBooks.length} // Общее количество отфильтрованных книг
        over400={over400Count} // Количество книг с более чем 400 страницами
      />

      {/* Компонент сетки книг с передачей отфильтрованного списка */}
      <BooksGrid books={visibleBooks} />
    </div>
  )
}

// Экспортируем компонент для использования в других частях приложения
export default BookList







