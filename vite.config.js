// Импортируем функцию defineConfig из Vite для типизированной конфигурации
import { defineConfig } from 'vite'

// Импортируем плагин React для Vite, который обеспечивает поддержку React
import react from '@vitejs/plugin-react'

// Экспортируем конфигурацию по умолчанию для Vite
export default defineConfig({
  // Массив плагинов, которые будут использоваться в проекте
  plugins: [
    // Вызов функции react() для создания экземпляра плагина React
    // Этот плагин обеспечивает:
    // - Быстрое обновление без перезагрузки страницы (HMR)
    // - Поддержку JSX
    // - Оптимизацию сборки для React
    react()
  ],
  
  // Настройки для обработки CSS
  css: {
    // Настройки для CSS-модулей
    modules: {
      // Преобразование имен классов в camelCase
      // Это позволяет использовать стили в JSX как styles.myClass вместо styles['my-class']
      localsConvention: 'camelCase'
    }
  }
})

