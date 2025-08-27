// Утилиты для работы с query-параметрами URL

// Функция для парсинга query-строки в объект
export function parseQuery(search) {
  // Создаем объект URLSearchParams из query-строки
  const params = new URLSearchParams(search)
  // Создаем пустой объект для результата
  const result = {}
  
  // Получаем параметр 'q' (поисковый запрос)
  const q = params.get('q')
  // Если параметр существует и не пустой, добавляем в результат
  if (q) result.q = q
  
  // Получаем параметр 'min' (минимальное количество страниц)
  const min = params.get('min')
  // Если параметр существует и является валидным числом, добавляем в результат
  if (min && !isNaN(Number(min))) result.min = min
  
  // Получаем параметр 'max' (максимальное количество страниц)
  const max = params.get('max')
  // Если параметр существует и является валидным числом, добавляем в результат
  if (max && !isNaN(Number(max))) result.max = max
  
  // Получаем параметр 'order' (порядок сортировки)
  const order = params.get('order')
  // Если параметр существует и имеет допустимое значение, добавляем в результат
  if (order === 'asc' || order === 'desc') result.order = order
  
  // Возвращаем объект с распарсенными параметрами
  return result
}

// Функция для преобразования объекта фильтров в query-строку
export function stringifyQuery(filters) {
  // Создаем пустой объект URLSearchParams
  const params = new URLSearchParams()
  
  // Добавляем параметр 'q' (поисковый запрос), если он существует
  if (filters.q) {
    params.set('q', filters.q)
  }
  
  // Добавляем параметр 'min' (минимальное количество страниц), если он существует
  if (filters.min) {
    params.set('min', filters.min)
  }
  
  // Добавляем параметр 'max' (максимальное количество страниц), если он существует
  if (filters.max) {
    params.set('max', filters.max)
  }
  
  // Добавляем параметр 'order' (порядок сортировки), если он существует и не равен значению по умолчанию 'asc'
  if (filters.order && filters.order !== 'asc') {
    params.set('order', filters.order)
  }
  
  // Преобразуем параметры в строку и возвращаем
  return params.toString()
}



