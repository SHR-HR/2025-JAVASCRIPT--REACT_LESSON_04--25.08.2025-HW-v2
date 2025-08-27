// Импортируем функцию defineConfig из Vitest для создания конфигурации тестов
import { defineConfig } from 'vitest/config'

// Импортируем плагин React для поддержки React компонентов в тестах
import react from '@vitejs/plugin-react'

// Экспортируем конфигурацию по умолчанию для Vitest
export default defineConfig({
  // Массив плагинов, которые будут использоваться в тестовой среде
  plugins: [
    // Плагин React для обработки JSX и React-компонентов в тестах
    react()
  ],
  
  // Настройки тестовой среды Vitest
  test: {
    // Окружение для тестов: jsdom эмулирует браузерное окружение в Node.js
    // Позволяет тестировать DOM-элементы и браузерные API
    environment: 'jsdom',
    
    // Файлы, которые выполняются перед запуском тестов
    // ./src/test-setup.js - файл с настройками тестовой среды
    // Обычно содержит импорт расширений для jest-dom и другие глобальные настройки
    setupFiles: ['./src/test-setup.js'],
    
    // Включение глобальных переменных Vitest (например, describe, it, expect)
    // без необходимости их импорта в каждом тестовом файле
    globals: true
  }
})




