# ✅ Deployment Checklist (Верл + Railway)

## Перед деплоем

- [ ] GitHub аккаунт создан
- [ ] Код загружен в GitHub репозиторий
- [ ] Gemini API ключ получен (https://makersuite.google.com/app/apikey)

## Backend (Railway)

- [ ] Создан Railway аккаунт (https://railway.app)
- [ ] Backend код готов (проверить `backend/package.json`)
- [ ] `backend/railway.toml` создан ✅
- [ ] `.env.example` подготовлен ✅
- [ ] Переменные в Railway Dashboard:
  - [ ] `GOOGLE_API_KEY` = ваш ключ
  - [ ] `NODE_ENV` = production
  - [ ] `FRONTEND_URL` = будет добавлена после Vercel

## Frontend (Vercel)

- [ ] Создан Vercel аккаунт (https://vercel.com)
- [ ] Frontend код готов (Next.js в `frontend/`)
- [ ] `frontend/vercel.json` создан ✅
- [ ] `frontend/next.config.js` обновлен ✅
- [ ] Переменные в Vercel Dashboard:
  - [ ] `NEXT_PUBLIC_API_URL` = Railway URL

## После деплоя

- [ ] Открыть Vercel URL и проверить загрузку
- [ ] Обновить `FRONTEND_URL` в Railway
- [ ] Проверить API вызовы (DevTools → Network)
- [ ] Тестировать основные функции:
  - [ ] Upload изображения
  - [ ] Запрос к AI Consultant
  - [ ] Gallery загрузка
  - [ ] Респонсивность на мобильных

## Дополнительно (опционально)

- [ ] Добавить собственный домен (cloudflare, namecheap)
- [ ] Настроить GitHub Actions для CI/CD
- [ ] Мониторинг ошибок (Sentry)
- [ ] Analytics (Vercel встроил)

---

**💾 Файлы готовы к деплою:**
- ✅ `DEPLOYMENT_GUIDE.md` — полная инструкция
- ✅ `backend/railway.toml` — конфиг для Railway
- ✅ `frontend/vercel.json` — конфиг для Vercel
- ✅ `backend/.env.example` — переменные backend
- ✅ `frontend/.env.example` — переменные frontend

**🚀 Следуйте `DEPLOYMENT_GUIDE.md` пошагово!**
