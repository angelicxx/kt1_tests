# Todo List API

**Цель проекта:** разработать и протестировать REST API для управления списком задач (ToDo List).

Реализовано полноценное API с CRUD-операциями, валидацией данных, обработкой ошибок, тестированием через Postman и документацией.

---

## Запуск проекта

### Установка зависимостей:
```bash
npm install
```

### Инициализация базы данных:
```bash
npm run init:db
```

### Запуск сервера:
```bash
npm start
```

После запуска:
- API доступно по адресу: [http://localhost:3000](http://localhost:3000)
- Swagger-документация: [http://localhost:3000/docs](http://localhost:3000/docs)

---

## Основные эндпоинты API

| Метод | Путь | Описание |
|-------|------|----------|
| **POST** | `/tasks` | Создание новой задачи |
| **GET** | `/tasks` | Получение списка всех задач |
| **GET** | `/tasks?completed=true` | Получение только выполненных задач |
| **GET** | `/tasks/{id}` | Получение задачи по ID |
| **PUT** | `/tasks/{id}` | Обновление существующей задачи |
| **DELETE** | `/tasks/{id}` | Удаление задачи по ID |

---

## Примеры запросов и ответов

### Создание задачи
**POST /tasks**
```json
{
  "title": "Купить молоко",
  "description": "2 литра",
  "completed": false
}
```

**Ответ (201 Created):**
```json
{
  "id": 1,
  "title": "Купить молоко",
  "description": "2 литра",
  "completed": false,
  "created_at": "2025-10-20T12:00:00Z",
  "updated_at": "2025-10-20T12:00:00Z"
}
```

---

### Получение всех задач
**GET /tasks**

**Ответ (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Купить молоко",
    "description": "2 литра",
    "completed": false
  },
  {
    "id": 2,
    "title": "Помыть машину",
    "description": "",
    "completed": true
  }
]
```

---

### Получение задачи по ID
**GET /tasks/1**

**Ответ (200 OK):**
```json
{
  "id": 1,
  "title": "Купить молоко",
  "description": "2 литра",
  "completed": false
}
```

**Если задача не найдена → (404 Not Found):**
```json
{
  "error": "NotFound",
  "message": "Task not found"
}
```

---

### Обновление задачи
**PUT /tasks/1**
```json
{
  "title": "Купить молоко и хлеб",
  "completed": true
}
```

**Ответ (200 OK):**
```json
{
  "id": 1,
  "title": "Купить молоко и хлеб",
  "description": "2 литра",
  "completed": true,
  "updated_at": "2025-10-20T12:10:00Z"
}
```

---

### Удаление задачи
**DELETE /tasks/1**

**Ответ (204 No Content)**  
(тело ответа пустое)

---

## Валидация данных

Валидация выполняется с помощью **Joi**.

**POST /tasks**
| Поле | Тип | Обязательное | Описание |
|------|-----|---------------|-----------|
| `title` | string | да | Название задачи |
| `description` | string | нет | Описание задачи |
| `completed` | boolean | нет | Статус выполнения (по умолчанию `false`) |

Ошибки возвращаются в виде:
```json
{
  "error": "ValidationError",
  "message": "Invalid request body",
  "details": [
    { "message": "\"title\" is required", "path": ["title"] }
  ]
}
```

---

## Тестирование API через Postman

Для проверки API создана коллекция **`Todo API.postman_collection.json`**, содержащая тесты для каждого сценария:

1. Создание задачи  
2. Получение списка задач  
3. Получение по ID  
4. Обновление  
5. Удаление  

Импортируйте коллекцию в Postman:  
**File → Import → Upload Files → Todo API.postman_collection.json**

Каждый запрос содержит встроенные тесты (проверка статусов, структуры ответа и т.д.).

---

## Swagger документация

Подробная спецификация API доступна по адресу:  
➡️ [http://localhost:3000/docs](http://localhost:3000/docs)

Файл спецификации находится в проекте по пути:  
`/docs/openapi.yaml`

---

## Используемые технологии

| Технология | Назначение |
|-------------|-------------|
| **Node.js / Express** | Разработка REST API |
| **SQLite3** | Хранение данных |
| **Joi** | Валидация данных |
| **Swagger UI / OpenAPI 3.0** | Документация API |
| **Postman** | Тестирование API |

