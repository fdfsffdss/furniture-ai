# 📱 Гайд по развертыванию (Vercel + Railway)

## ✅ Что нужно перед деплоем

1. GitHub аккаунт (репозиторий проекта)
2. Accounts на:
   - [Vercel](https://vercel.com)
   - [Railway](https://railway.app)
3. Gemini API ключ из Google

---

## 📌 STEP 1: Подготовка GitHub репозитория

### 1.1 Инициализируем репозиторий
```bash
cd c:\gemini\furniture-ai-site

# Если еще нет .git
git init
git add .
git commit -m "Initial commit"

# Создаем репозиторий на GitHub и подключаем
git remote add origin https://github.com/YOUR_USERNAME/furniture-ai.git
git branch -M main
git push -u origin main
```

### 1.2 Убедимся в файлах конфигурации

**Backend** (`backend/src/index.js`):
- ✅ Поддерживает `PORT` переменную окружения
- ✅ Поддерживает `FRONTEND_URL` для CORS

**Frontend** (`frontend/next.config.js`):
```javascript
// Убедитесь, что есть поддержка API URL
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  }
}
```

---

## 🚀 STEP 2: Развернуть Backend на Railway

### 2.1 Подготовка backend

Создайте файл **`backend/.env.example`**:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### 2.2 Развертывание на Railway

1. Перейдите на [railway.app](https://railway.app)
2. **New Project → GitHub Repo**
3. Выберите ваш репозиторий
4. Railway автоматически обнаружит Node.js проект
5. **Variables** → добавьте:
   - `GOOGLE_API_KEY`: ваш Gemini ключ (начинается с AIza...)
   - `NODE_ENV`: production
   - `FRONTEND_URL`: оставьте пока пусто (обновим после Vercel)

### 2.3 Настройка маршрута

Railway автоматически:
- Найдет `backend/package.json`
- Установит зависимости
- Запустит `npm start`

**Ваш backend URL**: `https://your-project.railway.app` (появится в Dashboard)

---

## 🎨 STEP 3: Развернуть Frontend на Vercel

### 3.1 Подготовка frontend

Создайте **`frontend/.env.local`** для production:
```env
NEXT_PUBLIC_API_URL=https://your-project.railway.app
```

### 3.2 Развертывание на Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. **Add New → Project**
3. Выберите ваш GitHub репозиторий
4. **Configure project**:
   - **Root Directory**: `frontend`
   - **Build Command**: `next build`
   - **Start Command**: `next start`

### 3.3 Добавить переменные окружения

В Vercel Dashboard:
```
Environment Variables:
  NEXT_PUBLIC_API_URL = https://your-project.railway.app
```

### 3.4 Развернуть
Нажмите **Deploy** → Vercel автоматически:
- Скачает код
- Выполнит `npm install && npm run build`
- Развернет на CDN

**Ваш frontend URL**: `https://your-vercel-app.vercel.app`

---

## 🔗 STEP 4: Обновить Backend с Frontend URL

Теперь, когда у вас есть Vercel URL:

1. Вернитесь в Railway Dashboard
2. Перейдите в **Variables**
3. Обновите `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
4. Railway автоматически перезагрузится

---

## ✨ STEP 5: Тестирование

### Frontend
```bash
# Откройте браузер
https://your-vercel-app.vercel.app
```

### Backend API
```bash
# Проверьте здоровье
curl https://your-project.railway.app/health

# Или через фронтенд:
# Откройте DevTools → Network → отправьте запрос к AI
```

---

## 🐛 Решение проблем

### "Failed to fetch" в фронтенде
- [ ] Проверьте `NEXT_PUBLIC_API_URL` в Vercel
- [ ] Убедитесь, что backend работает: `curl YOUR_RAILWAY_URL`
- [ ] Проверьте CORS в `backend/src/index.js` (должен позволять Vercel domain)

### Backend не запускается
- [ ] Проверьте Railway Logs: Dashboard → Logs
- [ ] Убедитесь, что `GOOGLE_API_KEY` установлен
- [ ] Проверьте, что все npm зависимости указаны

### 500 ошибки от Gemini
- [ ] Проверьте, что API ключ действителен
- [ ] Убедитесь, что Gemini API включен в Google Cloud
- [ ] Проверьте квоты API

---

## 📊 Мониторинг

### Railway
- **Logs**: всегда видны в Dashboard
- **Metrics**: CPU, Memory, Network

### Vercel
- **Analytics**: встроены
- **Logs**: в Deployment Details

---

## 🔄 CI/CD (автоматический деплой)

После push в main:
1. GitHub уведомляет Vercel и Railway
2. Они автоматически:
   - Скачивают код
   - Выполняют build
   - Развертывают новую версию

Это магия Git-based деплоя! ✨

---

## 📈 Что дальше?

1. **Мониторинг**: Настройте уведомления об ошибках
2. **Domain**: Подключите свой домен (на Railway и Vercel)
3. **SSL**: Уже включен (https://)
4. **Backups**: Если добавите БД, настройте backup

---

## 💰 Стоимость

- **Vercel**: $0 (бесплатный tier)
- **Railway**: $5/месяц (бесплатные кредиты)
- **Google Gemini API**: Зависит от usage (начните с бесплатного tier)

**Итого**: ~$0-5/месяц при низком трафике

---

**🎉 Готово! Ваше приложение live!**
