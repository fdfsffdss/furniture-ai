# 📦 Структура проекта FurniAI

## 🎨 Frontend (`/frontend`)

### `src/app` - Главное приложение (Next.js 14 App Router)
```
app/
├── layout.tsx          # Основной лейаут с NavBar
├── globals.css         # Глобальные стили (Tailwind)
├── page.tsx            # Главная страница (/)
├── upload/
│   └── page.tsx        # Загрузка и редактирование (/upload)
├── showroom/
│   └── page.tsx        # AI шоурум мебели (/showroom)
├── gallery/
│   └── page.tsx        # Галерея интерьеров (/gallery)
├── interior/[id]/
│   └── page.tsx        # Просмотр интерьера (/interior/:id)
└── profile/
    └── page.tsx        # Профиль пользователя (/profile)
```

### `src/components` - React компоненты
```
components/
├── NavBar.tsx           # Верхняя навигационная панель
├── ImageUpload.tsx      # Компонент загрузки с drag-and-drop
├── ChatConsultant.tsx   # AI чат консультант
├── FurnitureEditor.tsx  # Редактор параметров мебели (размеры, цвет, материал)
└── GalleryCard.tsx      # Карточка интерьера в галерее
```

### `src/lib` - Утилиты и API клиент
```
lib/
└── api.ts              # Axios API клиент со всеми методами
```

### `src/store` - Управление состоянием
```
store/
└── useStore.ts         # Zustand хранилища (InteriorStore, ChatStore)
```

### Конфигурационные файлы
```
frontend/
├── next.config.js      # Next.js конфигурация
├── tailwind.config.js  # Tailwind CSS конфигурация
├── postcss.config.js   # PostCSS конфигурация
├── tsconfig.json       # TypeScript конфигурация
├── package.json        # Зависимости
├── .eslintrc.json      # ESLint конфигурация
└── .gitignore          # Git игнорирование
```

---

## 🔌 Backend (`/backend`)

### `src/index.js` - Главный файл сервера
Инициализирует Express, подключает middleware, запускает сервер на PORT=3001

### `src/routes` - API маршруты
```
routes/
├── aiRoutes.js         # POST /api/ai/analyze, /api/ai/chat, etc.
├── interiorRoutes.js   # GET/POST/PUT /api/interiors/*
└── uploadRoutes.js     # POST /api/upload для загрузки файлов
```

### `src/services` - Бизнес логика
```
services/
└── geminiService.js    # Интеграция с Google Gemini API
  ├── analyzeInterior()
  ├── consultantChat()
  ├── generateFurnitureProposals()
  └── suggestFurnitureFor()
```

### `data` - Хранилище данных
```
data/
└── interiors.json      # JSON файл со всеми интерьерами (создаётся автоматически)
```

### Конфигурационные файлы
```
backend/
├── src/
│   ├── index.js
│   ├── routes/
│   ├── services/
│   └── middleware/
├── .env               # Переменные окружения (не коммитить!)
├── .env.example       # Пример .env
├── .gitignore
└── package.json
```

---

## 📊 Структура данных

### Интерьер (Interior)
```javascript
{
  id: "uuid",
  imageBase64: "data:image/jpeg;base64,...",
  analysis: {
    roomType: "Living Room",
    style: "Modern",
    colors: ["white", "gray"],
    lighting: "Natural light",
    furnishing: "Well-furnished",
    recommendations: [],
    furnitureNeeds: []
  },
  furniture: [
    {
      id: "uuid",
      name: "Modern Sofa",
      description: "3-seater sofa",
      style: "Modern",
      color: "#333333",
      material: "fabric",
      dimensions: {
        width: 200,
        depth: 90,
        height: 80
      },
      price_range: "$800-$1200",
      placement: "Main wall",
      addedAt: "2024-01-21T10:30:00Z"
    }
  ],
  published: true,
  publishedAt: "2024-01-21T10:35:00Z",
  createdAt: "2024-01-21T10:30:00Z",
  views: 42,
  likes: 15
}
```

### Сообщение чата
```javascript
{
  role: "user" | "assistant",
  content: "text message"
}
```

### Предложение мебели
```javascript
{
  name: "Furniture name",
  description: "Short description",
  style: "Style",
  color: "#HexColor",
  dimensions: {
    width: number,
    depth: number,
    height: number
  },
  price_range: "$XXX-$XXX",
  placement: "Where to place"
}
```

---

## 🎨 Дизайн системы

### Цветовая палитра (Tailwind)
```javascript
{
  primary: {
    dark: '#6B0F1A',   // Основной тёмно-бордовый
    main: '#8C1D18',   // Основной красный (используется везде)
    light: '#A62E25'   // Светлый красный (hover состояния)
  },
  dark: {
    bg: '#1A1A1A',     // Фон (тёмно-чёрный)
    border: '#2A2A2A', // Границы элементов
    hover: '#333333'   // Hover состояние фонов
  }
}
```

### Компоненты
- Кнопки: `px-8 py-4 bg-primary-main hover:bg-primary-light`
- Поля: `bg-dark-hover border border-dark-border`
- Карточки: `bg-dark-bg border border-dark-border rounded-xl`
- Тени: `shadow-soft` (4px), `shadow-premium` (8px)
- Радиус: `rounded-lg` (8px), `rounded-xl` (16px)

---

## 🔄 API структура

### Request/Response примеры

**Анализ интерьера:**
```
POST /api/ai/analyze
{ imageBase64: "..." } → { roomType, style, colors, ... }
```

**Чат:**
```
POST /api/ai/chat
{ messages: [], interiorContext: {} } → { message: "..." }
```

**Мебель:**
```
POST /api/ai/furniture-proposals
{ roomType, style, dimensions } → { proposals: [...] }
```

**CRUD интерьеров:**
```
GET /api/interiors → { interiors: [...] }
POST /api/interiors → { id, ... }
PUT /api/interiors/:id/publish → { published: true }
PUT /api/interiors/:id/furniture → { furniture: [...] }
POST /api/interiors/:id/view → { views: count }
POST /api/interiors/:id/like → { likes: count }
```

---

## 📦 Зависимости

### Frontend
- **next** - React фреймворк
- **react, react-dom** - React библиотеки
- **typescript** - Типизация
- **tailwindcss** - CSS фреймворк
- **framer-motion** - Анимации
- **zustand** - State management
- **axios** - HTTP клиент
- **react-hot-toast** - Notifications

### Backend
- **express** - Web фреймворк
- **cors** - Кроссдоменные запросы
- **dotenv** - Переменные окружения
- **@google-cloud/generative-ai** - Gemini API SDK
- **multer** - Загрузка файлов
- **uuid** - Генерация ID

---

## 🚀 Команды

### Установка
```bash
npm install
```

### Разработка
```bash
npm run dev                    # Оба сервера (frontend + backend)
cd frontend && npm run dev     # Frontend только
cd backend && npm run dev      # Backend только
```

### Сборка
```bash
npm run build                  # Оба
cd frontend && npm run build   # Frontend только
```

### Запуск
```bash
npm start                      # Только backend
npm run dev                    # Разработка
```

---

## 🔐 Переменные окружения

### Backend (.env)
```env
GEMINI_API_KEY=AIza_...
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 📁 Размеры файлов

| Файл | Строк кода | Размер |
|------|-----------|--------|
| geminiService.js | 150+ | ~5KB |
| aiRoutes.js | 100+ | ~3KB |
| interiorRoutes.js | 150+ | ~5KB |
| uploadRoutes.js | 50+ | ~2KB |
| index.js (backend) | 50+ | ~2KB |
| ChatConsultant.tsx | 100+ | ~3KB |
| FurnitureEditor.tsx | 100+ | ~3KB |
| ImageUpload.tsx | 80+ | ~2KB |
| API client | 80+ | ~3KB |

---

## 📊 Статистика проекта

```
Frontend:
- 6 страниц
- 5 основных компонентов
- 1 API клиент
- 2 хранилища (Zustand)
- 1700+ строк кода

Backend:
- 3 маршрута (ai, interiors, upload)
- 1 сервис Gemini
- 7 API endpoints
- JSON хранилище данных
- 600+ строк кода

Всего:
- ~2300 строк кода
- Готовая к запуску система
```

---

## 🔗 Связи между компонентами

```
frontend/
  ├── ImageUpload → api.uploadService
  ├── ChatConsultant → api.aiService
  ├── FurnitureEditor → useInteriorStore
  └── GalleryCard → interiorService

backend/
  ├── aiRoutes → geminiService
  ├── interiorRoutes → interiors.json
  └── uploadRoutes → multer
```

---

## 🛠️ Как расширять проект

### Добавить новую страницу
1. Создать `src/app/newpage/page.tsx`
2. Добавить маршрут в NavBar.tsx
3. Импортировать компоненты

### Добавить новый API endpoint
1. Создать маршрут в `backend/src/routes/`
2. Добавить функцию в `api.ts` (frontend)
3. Использовать в компонентах

### Интегрировать Gemini
1. Создать функцию в `geminiService.js`
2. Экспортировать роут в `aiRoutes.js`
3. Использовать через `aiService` в frontend

---

Структура полностью готова к разработке! 🚀
