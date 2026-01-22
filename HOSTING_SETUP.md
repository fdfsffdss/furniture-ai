# 🌍 Hosting Configuration Guide

## 📋 Для Vercel (Frontend)

### Что куда идет на Vercel:

```
Publish Directory (Output Directory):  .next
Build Command:                         npm run build
Install Command:                       npm install
Root Directory:                        frontend
Start Command:                         npm start
```

### Environment Variables на Vercel:

```
NEXT_PUBLIC_API_URL = https://your-railway-backend.railway.app
```

### Настройка в Vercel Dashboard:

1. **Project Settings → Build & Development**
   - Framework: Next.js ✓
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

2. **Project Settings → Environment Variables**
   - Add: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend.railway.app` (добавьте после создания backend)
   - Scope: Production, Preview, Development

3. **Deployments**
   - Auto-deploy on push to main: ✓

---

## 🚂 Для Railway (Backend)

### Что куда идет на Railway:

```
Root Directory:  backend
Build Command:   npm install
Start Command:   npm start
Port:           3000 (или $PORT переменная)
```

### Environment Variables на Railway:

```
PORT                = 3000
NODE_ENV            = production
GOOGLE_API_KEY      = sk-...ваш ключ...
FRONTEND_URL        = https://your-vercel-app.vercel.app
```

### Настройка в Railway Dashboard:

1. **Settings → Environment**
   - Add Variable:
     ```
     PORT = 3000
     NODE_ENV = production
     GOOGLE_API_KEY = sk-xxx...
     FRONTEND_URL = https://your-vercel-app.vercel.app
     ```

2. **Settings → Build**
   - Root Directory: `backend` ✓
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Settings → Networking**
   - Railway автоматически выдаст URL типа:
     `https://furniture-ai-prod.railway.app`

---

## ✅ Пошаговая развёртывание

### STEP 1: Railway (Backend)

1. Зайти на [railway.app](https://railway.app)
2. **New Project → GitHub Repo**
3. Выбрать `fdfsffdss/furniture-ai`
4. Выбрать только `backend/` как root directory
5. **Deploy**: Railway сам найдет package.json в backend
6. В **Variables** добавить:
   - `GOOGLE_API_KEY` = ваш ключ из Google
   - `NODE_ENV` = production
   - `FRONTEND_URL` = оставить пока пусто
7. **Copy Public URL** (будет выглядеть как `https://furniture-ai-prod.railway.app`)

### STEP 2: Vercel (Frontend)

1. Зайти на [vercel.com](https://vercel.com)
2. **Add New → Project → Import Git Repository**
3. Выбрать `furniture-ai` репозиторий
4. **Framework Preset**: Next.js (автоматически выберется)
5. **Root Directory**: `frontend`
6. **Build & Output Settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
7. **Environment Variables**:
   - Add `NEXT_PUBLIC_API_URL` = Railway URL из STEP 1
8. **Deploy!**

### STEP 3: Обновить Backend URL в Frontend

1. В Vercel Dashboard скопировать **Production URL** (например: `https://furniture-ai-prod.vercel.app`)
2. В Railway Dashboard → Variables:
   - Обновить `FRONTEND_URL` = ваш Vercel URL
3. Railway автоматически перезагрузится

---

## 🔗 Финальные URLs

После развёртывания вы получите:

- **Frontend (Vercel)**: `https://furniture-ai-prod.vercel.app` ← откройте это!
- **Backend (Railway)**: `https://furniture-ai-prod.railway.app/health` ← проверьте это

---

## 📁 Структура для хостинга

```
furniture-ai/
├── frontend/                    ← Deploy to Vercel
│   ├── package.json
│   ├── next.config.js
│   ├── vercel.json
│   ├── .env.example
│   ├── src/
│   └── .next/                   (создается при build)
│
├── backend/                     ← Deploy to Railway
│   ├── package.json
│   ├── railway.toml
│   ├── .env.example
│   ├── src/
│   └── node_modules/            (создается при npm install)
│
└── package.json                 (для root)
```

---

## 🚨 Важные моменты

### Для Vercel:
- ✅ Next.js 14 поддерживается полностью
- ✅ Automatic deployments при push в main
- ✅ Preview deployments для PR
- ❌ Не нужен special config, только `.env` переменные

### Для Railway:
- ✅ Node.js 20 поддерживается
- ✅ Автоматический restart при ошибке
- ✅ Logs видны в реал-тайме
- ❌ Не нужен специальный config помимо railway.toml

---

## 🔐 Безопасность

### Gemini API Key:
- ❌ НИКОГДА не добавляйте в GitHub
- ✅ Добавляйте ТОЛЬКО в Railway Variables
- ✅ Используйте `.env.example` как шаблон

### FRONTEND_URL на Backend:
- ✅ Нужен для CORS
- ✅ Позволяет только вашему фронтенду вызывать API

---

## 💰 Стоимость

| Сервис | Бесплатный Tier | Цена |
|--------|-----------------|------|
| **Vercel** | 100 deployments/день | Free forever |
| **Railway** | $5/месяц кредитов | Pay-as-you-go |
| **Google Gemini** | 60 запросов/минуту | Free tier |
| **Итого** | ✅ Практически бесплатно | ~$0-5/месяц |

---

## 📊 После Deploy - Что проверить

```bash
# Фронтенд загружается?
curl https://your-vercel-app.vercel.app

# Бэкенд работает?
curl https://your-railway-app.railway.app/health

# API вызывается из фронта?
# Открыть DevTools → Network → отправить запрос
```

---

**🎉 Готово! Ваше приложение live на интернете!**
