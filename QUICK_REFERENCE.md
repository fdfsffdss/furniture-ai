# 🚀 Быстрая справка FurniAI

## ⚡ Быстрый старт (3 минуты)

```bash
# 1. Установить зависимости
npm install

# 2. Настроить .env (backend)
GEMINI_API_KEY=AIza_YOUR_KEY_HERE

# 3. Запустить оба сервера
npm run dev

# 4. Открыть http://localhost:3000
```

---

## 📂 Главные файлы

| Файл | Назначение |
|------|-----------|
| `backend/src/index.js` | Express сервер |
| `backend/src/services/geminiService.js` | Gemini AI |
| `frontend/src/app/page.tsx` | Главная страница |
| `frontend/src/lib/api.ts` | API клиент |
| `frontend/src/components/ChatConsultant.tsx` | AI чат |

---

## 🎯 Основные функции

### Анализ интерьера
```javascript
const analysis = await aiService.analyzeInterior(imageBase64);
// roomType, style, colors, lighting, recommendations
```

### AI Чат
```javascript
const response = await aiService.chat(messages, context);
// Получить совет от AI
```

### Мебель
```javascript
const furniture = await aiService.generateFurnitureProposals(
  roomType, style, dimensions
);
// Получить список мебели
```

### Галерея
```javascript
const interiors = await interiorService.getPublished();
// Получить все интерьеры
```

---

## 🎨 Цвета

| Название | Hex | Использование |
|----------|-----|---------------|
| Основной | #8C1D18 | Кнопки, акценты |
| Фон | #1A1A1A | Фоны элементов |
| Граница | #2A2A2A | Границы |
| Hover | #333333 | Наведение |

---

## 📱 Страницы

| URL | Описание |
|-----|---------|
| `/` | Главная |
| `/upload` | Загрузка интерьера |
| `/showroom` | AI каталог мебели |
| `/gallery` | Галерея интерьеров |
| `/interior/:id` | Просмотр интерьера |
| `/profile` | Профиль |

---

## 🔗 API endpoints

| Метод | URL | Описание |
|-------|-----|---------|
| POST | `/api/ai/analyze` | Анализ интерьера |
| POST | `/api/ai/chat` | AI консультант |
| POST | `/api/ai/furniture-proposals` | Предложения мебели |
| GET | `/api/interiors` | Все интерьеры |
| POST | `/api/interiors` | Создать |
| PUT | `/api/interiors/:id/publish` | Опубликовать |
| PUT | `/api/interiors/:id/furniture` | Добавить мебель |
| POST | `/api/upload` | Загрузить файл |

---

## 🛠️ Разработка

### Добавить компонент
```typescript
// frontend/src/components/MyComponent.tsx
'use client';
export function MyComponent() {
  return <div>...</div>;
}
```

### Использовать API
```typescript
import { aiService } from '@/lib/api';
const result = await aiService.analyzeInterior(image);
```

### Добавить маршрут
```javascript
// backend/src/routes/newRoutes.js
router.get('/endpoint', (req, res) => {
  res.json({ data: 'value' });
});
```

---

## 🐛 Частые проблемы

### Backend не запускается
```bash
cd backend
npm install
npm run dev
```

### API недоступен
```bash
# Проверить что backend запущен
curl http://localhost:3001/health
```

### GEMINI_API_KEY не работает
- Проверить что ключ правильный (начинается с `AIza`)
- Проверить что ключ полностью скопирован
- Перезапустить backend

---

## 📊 Структура интерьера

```javascript
{
  id: "uuid",
  imageBase64: "...",
  analysis: { roomType, style, colors },
  furniture: [{ name, dimensions, color }],
  published: true,
  views: 42,
  likes: 15
}
```

---

## 🎛️ Параметры мебели

```javascript
{
  name: "Sofa",
  color: "#8C1D18",
  material: "fabric",
  dimensions: {
    width: 200,    // см (слева направо)
    depth: 90,     // см (спереди назад)
    height: 80     // см (снизу вверх)
  }
}
```

---

## 📝 Примеры

### Загрузить и анализировать

```typescript
// 1. Загрузить
const uploadResult = await uploadService.upload(file);

// 2. Анализировать
const analysis = await aiService.analyzeInterior(
  uploadResult.imageBase64
);

// 3. Создать интерьер
const interior = await interiorService.create(
  uploadResult.imageBase64,
  analysis,
  []
);

// 4. Опубликовать
await interiorService.publish(interior.id);
```

---

## 🔒 Безопасность

⚠️ **НИКОГДА:**
- Не коммитьте `.env`
- Не публикуйте API ключи
- Не загружайте `.env` в git

✅ **ВСЕГДА:**
- Используйте `.env.local` для локального развития
- Используйте секреты в production
- Валидируйте входные данные

---

## 📦 Зависимости

### Frontend (главные)
- next, react, typescript
- tailwindcss, framer-motion
- zustand, axios

### Backend (главные)
- express, cors
- @google-cloud/generative-ai
- multer, uuid

---

## ✅ Чеклист готовности

- [ ] Node 18+ установлен
- [ ] Google Gemini API ключ получен
- [ ] `backend/.env` настроен
- [ ] `npm install` выполнен
- [ ] `npm run dev` запущен
- [ ] http://localhost:3000 открывается
- [ ] Можно загрузить изображение
- [ ] AI анализирует интерьер
- [ ] Можно добавить мебель
- [ ] Интерьер можно опубликовать

---

## 🚀 Команды

```bash
# Установка
npm install

# Разработка (оба сервера)
npm run dev

# Сборка
npm run build

# Запуск (production)
npm start

# Только frontend
cd frontend && npm run dev

# Только backend  
cd backend && npm run dev
```

---

## 🔗 Ссылки

- **Gemini API:** https://ai.google.dev/
- **Get API Key:** https://ai.google.dev/
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind:** https://tailwindcss.com/docs

---

## 📞 Поддержка

Если что-то не работает:

1. Проверьте логи в консоли (F12)
2. Проверьте backend логи
3. Убедитесь что `.env` корректен
4. Перезагрузите сервер
5. Очистите кэш (`npm cache clean --force`)

---

**Готово к разработке! 🎉**
