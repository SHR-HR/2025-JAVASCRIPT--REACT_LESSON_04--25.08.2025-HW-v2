// D:\25.08.2025-HW----REACT_LESSON_04--\2025-JAVASCRIPT--REACT_LESSON_04--25.08.2025-HW-v2\__tests__\booklist.test.jsx

// Импорт функций для тестирования из библиотеки Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
// Импорт функций виртуального тестирования из Vitest
import { vi, beforeEach, afterEach } from 'vitest'
// Импорт основного компонента для тестирования
import BookList from '../src/components/BookList/BookList'

// Создание mock-объектов для тестирования навигации и буфера обмена
// Mock навигации и clipboard API
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000', // Базовый URL для тестов
    pathname: '/', // Путь по умолчанию
    search: '' // Параметры查询字符串 (изначально пустые)
  },
  writable: true // Разрешение перезаписи свойств
})

// Mock объекта history для тестирования навигации
Object.defineProperty(window, 'history', {
  value: {
    replaceState: vi.fn() // Mock функция replaceState
  },
  writable: true
})

// Mock объекта clipboard для тестирования копирования в буфер
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn() // Mock функция writeText
  },
  writable: true
})

// Mock localStorage для тестирования работы с локальным хранилищем
// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(), // Mock функции получения элемента
  setItem: vi.fn(), // Mock функции установки элемента
  removeItem: vi.fn(), // Mock функции удаления элемента
  clear: vi.fn(), // Mock функции очистки хранилища
}
// Подмена глобального объекта localStorage на mock-версию
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Основной блок тестов для компонента BookList
describe('BookList', () => {
  // Действия выполняемые перед каждым тестом
  beforeEach(() => {
    vi.clearAllMocks() // Очистка всех mock-вызовов
    localStorageMock.getItem.mockReturnValue(null) // Настройка localStorage возвращать null
    window.location.search = '' // Очистка параметров查询字符串 URL
  })

  // Действия выполняемые после каждого теста
  afterEach(() => {
    vi.useRealTimers() // Восстановление реальных таймеров
  })

  // Тест: проверка корректного рендеринга компонента и отображения всех книг по умолчанию
  test('рендерится без ошибок и показывает все книги по умолчанию', () => {
    render(<BookList />) // Рендер компонента
    
    // Проверка что текст статистики отображается
    expect(screen.getByText('Найдено книг:')).toBeInTheDocument()
    // Проверка что все тестовые книги отображаются
    expect(screen.getByText('React для чайников')).toBeInTheDocument()
    expect(screen.getByText('Чайник для JavaScript')).toBeInTheDocument()
    expect(screen.getByText('Алгоритмы на JS')).toBeInTheDocument()
  })

  // Тест: проверка работы поиска по подстроке без учета регистра
  test('поиск по подстроке работает без учёта регистра', async () => {
    render(<BookList />) // Рендер компонента
    
    // Получение поля ввода поиска по accessibility-лейблу
    const searchInput = screen.getByLabelText('Поиск книг по названию')
    // Симуляция ввода текста 'react' в поле поиска
    fireEvent.change(searchInput, { target: { value: 'react' } })
    
    // Ожидание срабатывания debounce и применения фильтрации
    // Ждём debounce
    await waitFor(() => {
      // Проверка что книга с React отображается
      expect(screen.getByText('React для чайников')).toBeInTheDocument()
      // Проверка что другие книги не отображаются
      expect(screen.queryByText('Чайник для JavaScript')).not.toBeInTheDocument()
    }, { timeout: 500 }) // Таймаут ожидания 500ms
  })

  // Тест: проверка что фильтрация по диапазону страниц включает граничные значения
  test('диапазон страниц включительный - граничные значения входят', async () => {
    render(<BookList />) // Рендер компонента
    
    // Получение полей ввода минимального и максимального количества страниц
    const minInput = screen.getByLabelText('Минимальное количество страниц')
    const maxInput = screen.getByLabelText('Максимальное количество страниц')
    
    // Установка значений диапазона 300-320 страниц
    fireEvent.change(minInput, { target: { value: '300' } })
    fireEvent.change(maxInput, { target: { value: '320' } })
    
    // Ожидание применения фильтрации
    await waitFor(() => {
      // Проверка что книги с 320 страницами отображаются
      expect(screen.getByText('React для чайников')).toBeInTheDocument() // 320 страниц
      // Проверка что книги с 300 страницами отображаются
      expect(screen.getByText('Чайник для JavaScript')).toBeInTheDocument() // 300 страниц
      // Проверка что книги с меньшим количеством страниц не отображаются
      expect(screen.queryByText('Современный CSS')).not.toBeInTheDocument() // 280 страниц
    })
  })

  // Тест: проверка отображения предупреждения при некорректном диапазоне
  test('при min > max показывается Alert и диапазон не применяется', async () => {
    render(<BookList />) // Рендер компонента
    
    // Получение полей ввода минимального и максимального количества страниц
    const minInput = screen.getByLabelText('Минимальное количество страниц')
    const maxInput = screen.getByLabelText('Максимальное количество страниц')
    
    // Установка некорректного диапазона (минимум больше максимума)
    fireEvent.change(minInput, { target: { value: '400' } })
    fireEvent.change(maxInput, { target: { value: '300' } })
    
    // Ожидание отображения предупреждения
    await waitFor(() => {
      // Проверка что отображается сообщение об ошибке
      expect(screen.getByText('Минимум больше максимума — диапазон не применяется')).toBeInTheDocument()
      // Проверка что все книги отображаются (фильтрация не применяется)
      // Все книги должны быть видны, так как диапазон игнорируется
      expect(screen.getByText('React для чайников')).toBeInTheDocument()
      expect(screen.getByText('Современный CSS')).toBeInTheDocument()
    })
  })

  // Тест: проверка работы сортировки по возрастанию и убыванию
  test('сортировка по возрастанию/убыванию работает', async () => {
    render(<BookList />) // Рендер компонента
    
    // Получение выпадающего списка сортировки
    const sortSelect = screen.getByLabelText('Порядок сортировки книг')
    
    // Проверка сортировки по возрастанию (значение по умолчанию)
    // По возрастанию (по умолчанию)
    const bookItems = screen.getAllByRole('listitem')
    // Проверка что первая книга имеет наименьшее количество страниц
    expect(bookItems[0]).toHaveTextContent('Современный CSS') // 280 страниц
    
    // Изменение сортировки на убывание
    // По убыванию
    fireEvent.change(sortSelect, { target: { value: 'desc' } })
    
    // Ожидание применения сортировки
    await waitFor(() => {
      const newBookItems = screen.getAllByRole('listitem')
      // Проверка что первая книга имеет наибольшее количество страниц
      expect(newBookItems[0]).toHaveTextContent('Алгоритмы на JS') // 500 страниц
    })
  })

  // Тест: проверка корректности подсчета книг с более чем 400 страницами
  test('подсчёт книг с > 400 страницами корректен', () => {
    render(<BookList />) // Рендер компонента
    
    // Проверка что отображается правильное количество книг с >400 страницами
    // В тестовых данных: Алгоритмы на JS (500), Чистый код (464), Node.js (450) = 3 книги
    expect(screen.getByText(/Из них страниц > 400:.*3/)).toBeInTheDocument()
  })

  // Тест: проверка работы debounce-механизма для поиска
  test('debounce работает - до 300мс фильтрация не срабатывает', async () => {
    // Использование fake таймеров для контроля времени
    vi.useFakeTimers()
    render(<BookList />) // Рендер компонента
    
    // Получение поля ввода поиска
    const searchInput = screen.getByLabelText('Поиск книг по названию')
    // Ввод текста для поиска
    fireEvent.change(searchInput, { target: { value: 'react' } })
    
    // Проверка что сразу после ввода все книги еще отображаются
    // Сразу после ввода - все книги ещё видны
    expect(screen.getByText('Чайник для JavaScript')).toBeInTheDocument()
    
    // Перемещение времени вперед на 200ms (меньше debounce-таймаута)
    // Ждём 200мс - ещё не должно сработать
    vi.advanceTimersByTime(200)
    // Проверка что фильтрация еще не применилась
    expect(screen.getByText('Чайник для JavaScript')).toBeInTheDocument()
    
    // Перемещение времени вперед еще на 150ms (всего 350ms)
    // Ждём ещё 150мс (итого 350мс) - теперь должно сработать
    vi.advanceTimersByTime(150)
    
    // Ожидание применения фильтрации
    await waitFor(() => {
      // Проверка что ненужные книги скрыты
      expect(screen.queryByText('Чайник для JavaScript')).not.toBeInTheDocument()
      // Проверка что нужные книги отображаются
      expect(screen.getByText('React для чайников')).toBeInTheDocument()
    })
  })

  // Тест: проверка инициализации состояния из URL параметров
  test('инициализация из URL работает корректно', () => {
    // Установка тестовых параметров в URL
    // Устанавливаем URL параметры
    window.location.search = '?q=react&min=300&order=desc'
    
    render(<BookList />) // Рендер компонента
    
    // Проверка что поля заполнены значениями из URL параметров
    // Проверяем что поля заполнены значениями из URL
    expect(screen.getByDisplayValue('react')).toBeInTheDocument()
    expect(screen.getByDisplayValue('300')).toBeInTheDocument()
    expect(screen.getByDisplayValue('По убыванию')).toBeInTheDocument()
  })
})






