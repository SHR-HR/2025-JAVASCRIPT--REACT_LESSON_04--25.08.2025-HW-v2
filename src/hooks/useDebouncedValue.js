// Импортируем необходимые хуки из React
import { useState, useEffect } from 'react'

// Кастомный хук useDebouncedValue для отложенного обновления значения
// Принимает параметры:
// - value: исходное значение, которое нужно "задержать"
// - delay: задержка в миллисекундах перед обновлением значения
export function useDebouncedValue(value, delay) {
  // Создаем состояние для хранения "отложенного" значения
  // Инициализируем его переданным значением value
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  // Используем эффект для реализации логики debounce
  useEffect(() => {
    // Устанавливаем таймер, который обновит debouncedValue через указанную задержку
    const handler = setTimeout(() => {
      setDebouncedValue(value) // Обновляем значение после задержки
    }, delay) // Задержка в миллисекундах
    
    // Функция очистки эффекта: отменяет таймер при размонтировании компонента
    // или при изменении зависимостей (value или delay)
    return () => {
      clearTimeout(handler) // Отменяем установленный таймер
    }
  }, [value, delay]) // Зависимости эффекта: перезапускаем эффект при изменении value или delay
  
  // Возвращаем текущее "отложенное" значение
  return debouncedValue
}





