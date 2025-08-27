// Импортируем необходимые хуки из React
import { useState, useEffect } from 'react'
// Импортируем CSS-модуль для стилизации компонента
import styles from './Alert.module.scss'

// Основной компонент Alert (Уведомление)
// Принимает параметры:
// - kind: тип уведомления (по умолчанию 'info')
// - children: содержимое уведомления (текст или другие React-элементы)
// - onClose: функция обратного вызова при закрытии уведомления
// - autoClose: флаг автоматического закрытия (по умолчанию false)
// - autoCloseDelay: задержка автоматического закрытия в миллисекундах (по умолчанию 3000 мс)
function Alert({ kind = 'info', children, onClose, autoClose = false, autoCloseDelay = 3000 }) {
  // Состояние для контроля видимости уведомления
  const [isVisible, setIsVisible] = useState(true)

  // Эффект для обработки автоматического закрытия
  useEffect(() => {
    // Проверяем, включено ли автоматическое закрытие и передана ли функция onClose
    if (autoClose && onClose) {
      // Устанавливаем таймер для автоматического закрытия
      const timer = setTimeout(() => {
        // Сначала скрываем уведомление
        setIsVisible(false)
        // Затем вызываем функцию onClose с небольшой задержкой для анимации
        setTimeout(onClose, 300) // маленькая задержка под анимацию
      }, autoCloseDelay) // Задержка из параметров
      
      // Функция очистки: отменяем таймер при размонтировании компонента
      return () => clearTimeout(timer)
    }
  }, [autoClose, autoCloseDelay, onClose]) // Зависимости эффекта

  // Если уведомление не видимо, не рендерим ничего
  if (!isVisible) return null

  // Обработчик ручного закрытия уведомления
  const handleClose = () => {
    // Скрываем уведомление
    setIsVisible(false)
    // Если передана функция onClose, вызываем её с задержкой для анимации
    onClose && setTimeout(onClose, 300)
  }

  // Рендерим компонент уведомления
  return (
    <div
      // Динамически формируем классы в зависимости от типа и видимости уведомления
      className={`${styles.alert} ${styles[`alert--${kind}`]} ${!isVisible ? styles['alert--hidden'] : ''}`}
      role="alert" // ARIA-роль для доступности
      aria-live="polite" // ARIA-атрибут: уведомление будет объявлено скринридером вежливо
    >
      {/* Контейнер для содержимого уведомления */}
      <div className={styles.content}>{children}</div>
      
      {/* Кнопка закрытия (отображается только если передана функция onClose) */}
      {onClose && (
        <button
          className={styles.closeButton}
          onClick={handleClose} // Обработчик клика
          aria-label="Закрыть уведомление" // Текст для скринридеров
          type="button" // Тип кнопки
        >
          × {/* Символ закрытия (крестик) */}
        </button>
      )}
    </div>
  )
}

// Экспортируем компонент для использования в других частях приложения
export default Alert







