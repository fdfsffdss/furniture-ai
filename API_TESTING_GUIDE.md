# 📚 API ПРИМЕРЫ И ТЕСТИРОВАНИЕ

## 1. Полный workflow тестирования

### Шаг 1: Проверка backend статуса

```bash
# Check health
curl -s http://localhost:3001/health | jq

# Response:
# {
#   "status": "ok",
#   "timestamp": "2026-01-21T12:00:00.000Z",
#   "environment": "development"
# }
```

### Шаг 2: Получить статус API

```bash
curl -s http://localhost:3001/ | jq

# Response:
{
  "status": "✅ Backend работает",
  "api": "FurniAI - Мебельный AI-сервис",
  "version": "1.0.0",
  "environment": "development",
  "endpoints": {
    "health": "GET /health",
    "analyze": "POST /api/ai/analyze",
    "chat": "POST /api/ai/chat",
    "furniture_proposals": "POST /api/ai/furniture-proposals",
    "suggest_furniture": "POST /api/ai/suggest-furniture",
    "interiors": "GET /api/interiors",
    "interior_detail": "GET /api/interiors/:id",
    "publish": "PUT /api/interiors/:id/publish",
    "add_furniture": "PUT /api/interiors/:id/furniture",
    "upload": "POST /api/upload"
  }
}
```

---

## 2. IMAGE UPLOAD & ANALYSIS

### Загрузить изображение

```bash
curl -X POST http://localhost:3001/api/upload \
  -F "file=@/path/to/interior.jpg"

# Response:
{
  "success": true,
  "fileId": "550e8400-e29b-41d4-a716-446655440000",
  "mimeType": "image/jpeg",
  "size": 2048576,
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
  "uploadedAt": "2026-01-21T12:00:00.000Z"
}
```

### Анализировать интерьер

```bash
IMAGE_BASE64="data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."

curl -X POST http://localhost:3001/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d "{\"imageBase64\": \"$IMAGE_BASE64\"}"

# Response:
{
  "roomType": "Living Room",
  "style": "Modern",
  "colors": ["white", "gray", "beige"],
  "lighting": "Natural",
  "condition": "Well-furnished",
  "squareMeters": 35,
  "recommendations": [
    "Add wall art for visual interest",
    "Consider accent lighting",
    "Plants would enhance the space"
  ],
  "furnitureNeeds": ["Coffee table", "Area rug", "Side table"]
}
```

---

## 3. FURNITURE PROPOSALS

### Получить предложения мебели

```bash
curl -X POST http://localhost:3001/api/ai/furniture-proposals \
  -H "Content-Type: application/json" \
  -d '{
    "roomType": "Living Room",
    "style": "Modern",
    "roomDimensions": {
      "width": 5,
      "length": 7,
      "height": 2.8
    }
  }'

# Response:
{
  "proposals": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Contemporary Sectional Sofa",
      "description": "Modern L-shaped sectional with clean lines",
      "style": "Modern",
      "color": "#4A4A4A",
      "dimensions": {
        "width_cm": 260,
        "depth_cm": 95,
        "height_cm": 75
      },
      "price_range": "$1200-$1800",
      "placement": "Along the longest wall",
      "reasoning": "Perfect for modern living rooms, provides ample seating"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Minimalist Coffee Table",
      "description": "Glass top with steel frame",
      "style": "Modern",
      "color": "#2C2C2C",
      "dimensions": {
        "width_cm": 120,
        "depth_cm": 60,
        "height_cm": 45
      },
      "price_range": "$300-$500",
      "placement": "Center of seating area",
      "reasoning": "Matches modern aesthetic, doesn't clutter space"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "Floating Wall Shelves",
      "description": "Walnut wood floating shelves set of 3",
      "style": "Modern",
      "color": "#8B6F47",
      "dimensions": {
        "width_cm": 80,
        "depth_cm": 25,
        "height_cm": 15
      },
      "price_range": "$200-$400",
      "placement": "Above the sideboard",
      "reasoning": "Adds storage without taking floor space"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440004",
      "name": "Modern Area Rug",
      "description": "Geometric pattern wool rug",
      "style": "Modern",
      "color": "#D3D3D3",
      "dimensions": {
        "width_cm": 200,
        "depth_cm": 250,
        "height_cm": 1
      },
      "price_range": "$400-$800",
      "placement": "Under sofa and coffee table",
      "reasoning": "Defines the seating area, adds texture and warmth"
    }
  ]
}
```

---

## 4. AI CHAT CONSULTANT

### Первое сообщение

```bash
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "How should I arrange furniture in my living room?"
      }
    ],
    "interiorContext": {
      "roomType": "Living Room",
      "style": "Modern",
      "squareMeters": 35,
      "colors": ["white", "gray"]
    }
  }'

# Response:
{
  "message": "Для модного интерьера 35м² рекомендую: диван вдоль длинной стены, журнальный столик в центре, полки на стене. Это создаст удобную зону для отдыха и визуально откроет пространство."
}
```

### Multi-turn conversation

```bash
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "How should I arrange furniture in my living room?"
      },
      {
        "role": "assistant",
        "content": "Для модного интерьера 35м² рекомендую: диван вдоль длинной стены, журнальный столик в центре, полки на стене."
      },
      {
        "role": "user",
        "content": "What about lighting?"
      }
    ],
    "interiorContext": {
      "roomType": "Living Room",
      "style": "Modern",
      "squareMeters": 35
    }
  }'

# Response:
{
  "message": "Добавьте потолочный светильник для основного освещения, настольные лампы на полках и LED ленту за телевизором. Так создадите многоуровневое освещение, которое одновременно функционально и красиво."
}
```

---

## 5. SUGGEST FURNITURE

### Подобрать мебель по описанию

```bash
curl -X POST http://localhost:3001/api/ai/suggest-furniture \
  -H "Content-Type: application/json" \
  -d '{
    "interiorDescription": "Modern living room with white walls, gray sofa, and natural lighting. 35 square meters. Minimalist style. Has wooden parquet flooring.",
    "userPreference": "I want Scandinavian style furniture. Budget around $2000"
  }'

# Response:
{
  "suggestion": "Based on your modern interior and Scandinavian preferences, I recommend light wood furniture with clean lines and natural materials. This will complement your existing gray sofa beautifully.",
  "furniture": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "name": "Scandinavian Dining Table",
      "description": "Solid oak table with minimalist design",
      "matchScore": 92,
      "reason": "Perfect match for Scandinavian style with wooden flooring",
      "dimensions": {
        "width_cm": 120,
        "depth_cm": 75,
        "height_cm": 75
      },
      "color": "#D2B48C",
      "estimatedPrice": "$600-$800"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440011",
      "name": "Natural Linen Armchair",
      "description": "Light linen upholstery on wooden frame",
      "matchScore": 88,
      "reason": "Complements gray sofa, authentic Scandinavian material",
      "dimensions": {
        "width_cm": 75,
        "depth_cm": 85,
        "height_cm": 80
      },
      "color": "#F5F5DC",
      "estimatedPrice": "$400-$600"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440012",
      "name": "Birch Wood Bookshelf",
      "description": "Simple modular shelving system",
      "matchScore": 85,
      "reason": "Scandinavian essential, adds storage without clutter",
      "dimensions": {
        "width_cm": 90,
        "depth_cm": 30,
        "height_cm": 180
      },
      "color": "#C19A6B",
      "estimatedPrice": "$300-$400"
    }
  ]
}
```

---

## 6. INTERIOR MANAGEMENT

### Создать интерьер (черновик)

```bash
curl -X POST http://localhost:3001/api/interiors \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "data:image/jpeg;base64,...",
    "analysis": {
      "roomType": "Living Room",
      "style": "Modern",
      "colors": ["white", "gray"],
      "lighting": "Natural",
      "squareMeters": 35
    },
    "furniture": [],
    "title": "My Modern Living Room"
  }'

# Response:
{
  "id": "550e8400-e29b-41d4-a716-446655440100",
  "imageBase64": "data:image/jpeg;base64,...",
  "title": "My Modern Living Room",
  "analysis": { ... },
  "furniture": [],
  "published": false,
  "createdAt": "2026-01-21T12:00:00.000Z",
  "views": 0,
  "likes": 0
}
```

### Получить конкретный интерьер

```bash
INTERIOR_ID="550e8400-e29b-41d4-a716-446655440100"

curl -s http://localhost:3001/api/interiors/$INTERIOR_ID | jq

# Response:
{
  "id": "550e8400-e29b-41d4-a716-446655440100",
  "title": "My Modern Living Room",
  "published": false,
  "analysis": { ... },
  "furniture": [...],
  "views": 0,
  "likes": 0
  ...
}
```

### Добавить мебель в интерьер

```bash
INTERIOR_ID="550e8400-e29b-41d4-a716-446655440100"

curl -X PUT http://localhost:3001/api/interiors/$INTERIOR_ID/furniture \
  -H "Content-Type: application/json" \
  -d '{
    "furniture": {
      "name": "3-seater Sofa",
      "color": "#4A4A4A",
      "dimensions": {
        "width_cm": 200,
        "depth_cm": 95,
        "height_cm": 75
      },
      "price_range": "$800-$1200"
    }
  }'

# Response:
{
  "id": "550e8400-e29b-41d4-a716-446655440100",
  "title": "My Modern Living Room",
  "furniture": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440101",
      "name": "3-seater Sofa",
      "color": "#4A4A4A",
      "dimensions": { ... },
      "addedAt": "2026-01-21T12:05:00.000Z"
    }
  ],
  ...
}
```

### Опубликовать интерьер

```bash
INTERIOR_ID="550e8400-e29b-41d4-a716-446655440100"

curl -X PUT http://localhost:3001/api/interiors/$INTERIOR_ID/publish \
  -H "Content-Type: application/json" \
  -d '{
    "interiorData": {},
    "title": "My Modern Living Room - Final"
  }'

# Response:
{
  "id": "550e8400-e29b-41d4-a716-446655440100",
  "title": "My Modern Living Room - Final",
  "published": true,
  "publishedAt": "2026-01-21T12:10:00.000Z",
  ...
}
```

### Получить все опубликованные интерьеры

```bash
curl -s http://localhost:3001/api/interiors | jq '.interiors | length'

# Response: 5
```

### Добавить просмотр

```bash
INTERIOR_ID="550e8400-e29b-41d4-a716-446655440100"

curl -X POST http://localhost:3001/api/interiors/$INTERIOR_ID/view

# Response:
{
  "views": 1
}
```

### Добавить лайк

```bash
INTERIOR_ID="550e8400-e29b-41d4-a716-446655440100"

curl -X POST http://localhost:3001/api/interiors/$INTERIOR_ID/like

# Response:
{
  "likes": 1
}
```

---

## 7. ERROR SCENARIOS

### Missing required field

```bash
curl -X POST http://localhost:3001/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{}'

# Response: 400
{
  "error": "IMAGE_REQUIRED",
  "message": "Изображение не предоставлено",
  "timestamp": "2026-01-21T12:00:00.000Z"
}
```

### Invalid file size

```bash
# File > 10MB

curl -X POST http://localhost:3001/api/upload \
  -F "file=@huge_file.jpg"

# Response: 413
{
  "error": "FILE_TOO_LARGE",
  "message": "Максимальный размер файла 10MB"
}
```

### Rate limit exceeded

```bash
# Send 31 requests in 60 seconds

curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [...]}'

# Response: 429
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Слишком много запросов. Попробуйте позже.",
  "retryAfter": 45
}
```

### Gemini API error

```bash
# If Gemini API is down

curl -X POST http://localhost:3001/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"imageBase64": "..."}'

# Response: 503
{
  "error": "GEMINI_API_ERROR",
  "message": "Сервис AI временно недоступен",
  "timestamp": "2026-01-21T12:00:00.000Z"
}
```

### Interior not found

```bash
INTERIOR_ID="00000000-0000-0000-0000-000000000000"

curl -s http://localhost:3001/api/interiors/$INTERIOR_ID

# Response: 404
{
  "error": "NOT_FOUND",
  "message": "Интерьер не найден",
  "timestamp": "2026-01-21T12:00:00.000Z"
}
```

---

## 8. TESTING WITH POSTMAN

### Import this collection

```json
{
  "info": {
    "name": "FurniAI API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:3001/health"
      }
    },
    {
      "name": "Analyze Interior",
      "request": {
        "method": "POST",
        "url": "http://localhost:3001/api/ai/analyze",
        "body": {
          "mode": "raw",
          "raw": "{\"imageBase64\": \"data:image/jpeg;base64,...\"}"
        }
      }
    }
  ]
}
```

---

## 9. PERFORMANCE BENCHMARKS

### Expected response times

```
GET /health                      ~10ms
POST /api/upload (1MB image)     ~500ms
POST /api/ai/analyze             ~2-5s (Gemini API)
POST /api/ai/chat                ~1-3s (Gemini API)
POST /api/ai/furniture-proposals  ~2-4s (Gemini API)
GET /api/interiors               ~50ms
POST /api/interiors              ~100ms
```

### Retry behavior

```
Request timeout (> 30s)           → Retry
Gemini API error (503)            → Retry 3x with backoff
Network error                      → Retry 3x with backoff
Invalid JSON from Gemini          → Retry 3x with backoff
```

---

## 10. PRODUCTION DEPLOYMENT

### Environment setup

```bash
# Backend .env
GEMINI_API_KEY=AIzaSyBTxtMqtrJfqw5NW3oMs7aiSJda4Xu7fkQ
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://furniai.example.com

# Frontend .env.production.local
NEXT_PUBLIC_API_URL=https://api.example.com
```

### Systemd service (Linux)

```ini
[Unit]
Description=FurniAI Backend
After=network.target

[Service]
Type=simple
User=furniaiuser
WorkingDirectory=/home/furniaiuser/furniture-ai-site/backend
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Nginx reverse proxy

```nginx
upstream furniai_backend {
    server localhost:3001;
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://furniai_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

