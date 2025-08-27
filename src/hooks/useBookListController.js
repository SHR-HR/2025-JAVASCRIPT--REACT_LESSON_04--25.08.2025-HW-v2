// Импортируем необходимые хуки из React
import { useEffect, useMemo, useState } from 'react'
// Импортируем кастомный хук для отложенного значения (debounce)
import { useDebouncedValue } from './useDebouncedValue'
// Импортируем кастомный хук для синхронизации с query-параметрами URL
import { useQueryParamsSync } from './useQueryParamsSync'
// Импортируем функцию валидации диапазона
import { validateRange } from '../utils/validateRange'
// Импортируем функции сортировки
import { byPagesAscThenTitle, byPagesDescThenTitle } from '../utils/sorters'

// Ключ для сохранения в localStorage
const STORAGE_KEY = 'booklist:filters:v1'

// Основной кастомный хук для управления состоянием списка книг
export function useBookListController(sourceBooks) {
  // Состояние для поискового запроса
  const [query, setQuery] = useState('')
  // Состояние для минимального количества страниц
  const [minPages, setMinPages] = useState('')
  // Состояние для максимального количества страниц
  const [maxPages, setMaxPages] = useState('')
  // Состояние для порядка сортировки (по умолчанию по возрастанию)
  const [sortOrder, setSortOrder] = useState('asc')
  // Состояние для уведомлений/алертов
  const [alert, setAlert] = useState(null)

  // Используем debounce для поискового запроса (задержка 300 мс)
  const debouncedQuery = useDebouncedValue(query, 300)

  // Инициализация из localStorage при монтировании компонента
  useEffect(() => {
    try {
      // Пытаемся получить сохраненные данные из localStorage
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        // Парсим JSON данные
        const f = JSON.parse(saved)
        // Восстанавливаем состояния из сохраненных значений
        setQuery(f.query || '')
        setMinPages(f.minPages || '')
        setMaxPages(f.maxPages || '')
        setSortOrder(f.sortOrder || 'asc')
      }
    } catch (e) {
      // В случае ошибки выводим предупреждение в консоль
      console.warn('Не удалось загрузить фильтры из localStorage:', e)
    }
  }, []) // Пустой массив зависимостей - эффект выполняется только при монтировании

  // Синхронизация с URL параметрами (+ начитка по back/forward навигации)
  const filters = { q: debouncedQuery, min: minPages, max: maxPages, order: sortOrder }
  useQueryParamsSync(filters, (nf) => {
    // Колбэк, вызываемый при изменении query-параметров
    setQuery(nf.q || '')
    setMinPages(nf.min || '')
    setMaxPages(nf.max || '')
    setSortOrder(nf.order || 'asc')
  })

  // Сохранение в localStorage при изменении фильтров
  useEffect(() => {
    try {
      // Сохраняем текущие значения фильтров в localStorage
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ query: debouncedQuery, minPages, maxPages, sortOrder })
      )
    } catch (e) {
      // В случае ошибки выводим предупреждение в консоль
      console.warn('Не удалось сохранить фильтры в localStorage:', e)
    }
  }, [debouncedQuery, minPages, maxPages, sortOrder]) // Зависимости: значения фильтров

  // Валидация диапазона страниц с использованием useMemo для оптимизации
  const rangeValidation = useMemo(
    () => validateRange(minPages, maxPages),
    [minPages, maxPages] // Пересчитываем только при изменении minPages или maxPages
  )

  // Эффект для отображения предупреждения при невалидном диапазоне (не автозакрывается)
  useEffect(() => {
    if (!rangeValidation.isValid && rangeValidation.message) {
      // Устанавливаем предупреждение если диапазон невалиден
      setAlert({ kind: 'warning', message: rangeValidation.message, autoClose: false })
    } else {
      // Сбрасываем уведомление если диапазон валиден
      setAlert(null)
    }
  }, [rangeValidation]) // Зависимость: результат валидации диапазона

  // Фильтрация и сортировка книг с использованием useMemo для оптимизации
  const visibleBooks = useMemo(() => {
    let filtered = sourceBooks // Начинаем с исходного массива книг

    // Фильтрация по поисковому запросу
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase()
      filtered = filtered.filter((b) => b.title.toLowerCase().includes(q))
    }

    // Фильтрация по диапазону страниц (только если диапазон валиден)
    if (rangeValidation.isValid) {
      const { min, max } = rangeValidation
      filtered = filtered.filter(
        ({ pages }) => (min === null || pages >= min) && (max === null || pages <= max)
      )
    }

    // Сортировка в зависимости от выбранного порядка
    const sorter = sortOrder === 'desc' ? byPagesDescThenTitle : byPagesAscThenTitle
    return [...filtered].sort(sorter) // Возвращаем новый отсортированный массив
  }, [sourceBooks, debouncedQuery, rangeValidation, sortOrder]) // Зависимости: исходные данные и параметры фильтрации

  // Подсчет книг с более чем 400 страницами
  const over400Count = useMemo(
    () => visibleBooks.filter((b) => b.pages > 400).length,
    [visibleBooks] // Пересчитываем только при изменении видимых книг
  )

  // Обработчик сброса фильтров
  const handleReset = () => {
    // Сбрасываем все состояния фильтров
    setQuery('')
    setMinPages('')
    setMaxPages('')
    setSortOrder('asc')
    setAlert(null) // Сбрасываем уведомления
    try {
      // Удаляем данные из localStorage
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.warn('Не удалось очистить localStorage:', e)
    }
    // Очищаем query-параметры URL
    window.history.replaceState(null, '', window.location.pathname)
  }

  // Обработчик копирования ссылки
  const handleCopyLink = async () => {
    try {
      // Копируем текущий URL в буфер обмена
      await navigator.clipboard.writeText(window.location.href)
      // Показываем успешное уведомление
      setAlert({
        kind: 'info',
        message: 'Ссылка скопирована в буфер обмена!',
        autoClose: true,
        autoCloseDelay: 3000, // Автозакрытие через 3 секунды
      })
    } catch (e) {
      console.warn('Не удалось скопировать ссылку:', e)
      // Показываем уведомление об ошибке
      setAlert({
        kind: 'warning',
        message: 'Не удалось скопировать ссылку',
        autoClose: true,
        autoCloseDelay: 3000,
      })
    }
  }

  // Обработчик изменения минимального количества страниц
  const handleMinPagesChange = (e) => {
    const v = e.target.value
    // Устанавливаем значение только если оно пустое или валидное число >= 0
    if (v === '' || (Number(v) >= 0 && !isNaN(Number(v)))) setMinPages(v)
  }
  
  // Обработчик изменения максимального количества страниц
  const handleMaxPagesChange = (e) => {
    const v = e.target.value
    // Устанавливаем значение только если оно пустое или валидное число >= 0
    if (v === '' || (Number(v) >= 0 && !isNaN(Number(v)))) setMaxPages(v)
  }

  // Возвращаем объект с состояниями и методами для использования в компоненте
  return {
    // state - текущие состояния
    query, minPages, maxPages, sortOrder, alert,
    // setters for controlled inputs - функции для управления состояниями
    setQuery, setSortOrder, setAlert,
    // derived - производные данные (отфильтрованные и отсортированные)
    visibleBooks, over400Count,
    // handlers - обработчики событий
    handleReset, handleCopyLink, handleMinPagesChange, handleMaxPagesChange,
  }
}






