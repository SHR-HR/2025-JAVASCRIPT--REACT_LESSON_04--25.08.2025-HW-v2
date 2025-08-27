// Импортируем необходимые хуки из React
import { useEffect, useRef } from 'react'
// Импортируем утилиты для работы с query-параметрами URL
import { parseQuery, stringifyQuery } from '../utils/query'

// Кастомный хук useQueryParamsSync для синхронизации состояния с query-параметрами URL
// Принимает параметры:
// - filters: объект с текущими значениями фильтров
// - onExternalChange: callback-функция, вызываемая при изменении URL извне (навигация назад/вперед)
export function useQueryParamsSync(filters, onExternalChange) {
  // useRef для отслеживания первоначального монтирования компонента
  const isInitialMount = useRef(true)
  // useRef для определения, является ли изменение внутренним (чтобы избежать циклических обновлений)
  const isInternalChange = useRef(false)
  
  // Эффект для инициализации из URL при монтировании компонента
  useEffect(() => {
    // Проверяем, является ли это первоначальным монтированием
    if (isInitialMount.current) {
      // Парсим текущие query-параметры из URL
      const urlParams = parseQuery(window.location.search)
      // Если есть параметры в URL, передаем их в callback
      if (Object.keys(urlParams).length > 0) {
        onExternalChange(urlParams)
      }
      // Отмечаем, что первоначальное монтирование завершено
      isInitialMount.current = false
    }
  }, [onExternalChange]) // Зависимость: callback-функция

  // Эффект для обновления URL при изменении фильтров
  useEffect(() => {
    // Пропускаем обновление при первоначальном монтировании и внутренних изменениях
    if (!isInitialMount.current && !isInternalChange.current) {
      // Преобразуем объект фильтров в query-строку
      const queryString = stringifyQuery(filters)
      // Формируем новый URL
      const newUrl = queryString 
        ? `${window.location.pathname}?${queryString}` // Добавляем query-параметры
        : window.location.pathname // Только путь, если параметров нет
      
      // Проверяем, изменился ли URL, чтобы избежать лишних обновлений истории
      if (window.location.href !== `${window.location.origin}${newUrl}`) {
        // Обновляем URL без перезагрузки страницы
        window.history.replaceState(null, '', newUrl)
      }
    }
    // Сбрасываем флаг внутреннего изменения после обработки
    isInternalChange.current = false
  }, [filters]) // Зависимость: объект фильтров

  // Эффект для отслеживания изменений URL (кнопки назад/вперед в браузере)
  useEffect(() => {
    // Обработчик события popstate (навигация по истории)
    const handlePopState = () => {
      // Устанавливаем флаг, что изменение является внутренним (из истории браузера)
      isInternalChange.current = true
      // Парсим текущие query-параметры из URL
      const urlParams = parseQuery(window.location.search)
      // Вызываем callback с новыми параметрами
      onExternalChange(urlParams)
    }
    
    // Добавляем обработчик события popstate
    window.addEventListener('popstate', handlePopState)
    
    // Функция очистки: удаляем обработчик при размонтировании компонента
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [onExternalChange]) // Зависимость: callback-функция
}







