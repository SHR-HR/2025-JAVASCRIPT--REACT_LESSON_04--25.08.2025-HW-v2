// Файл настройки тестовой среды
// Импортируем расширения jest-dom из библиотеки @testing-library/jest-dom
// Это добавляет дополнительные matchers (утверждения) для Jest
// которые упрощают тестирование DOM-элементов

import '@testing-library/jest-dom'

// Расширения jest-dom включают такие полезные matchers как:
// - toBeInTheDocument() - проверяет, что элемент находится в DOM
// - toBeVisible() - проверяет, что элемент видим
// - toHaveAttribute() - проверяет наличие атрибута с определенным значением
// - toHaveTextContent() - проверяет текстовое содержимое элемента
// - toHaveClass() - проверяет наличие CSS-класса
// - toBeDisabled() - проверяет, что элемент disabled
// - toBeChecked() - проверяет, что чекбокс/радио выбран
// - и многие другие

// Этот файл обычно подключается в конфигурации Jest (в jest.config.js или package.json)
// через настройку setupFilesAfterEnv для глобальной доступности matchers во всех тестах





