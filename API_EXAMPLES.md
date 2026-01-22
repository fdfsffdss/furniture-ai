# 📋 Примеры API запросов

## Инструменты для тестирования
- **curl** - командная строка
- **Postman** - графический интерфейс
- **VS Code REST Client** - расширение для VS Code

---

## 🤖 AI Endpoints

### 1. Анализ интерьера

#### Curl
```bash
curl -X POST http://localhost:3001/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }'
```

#### JavaScript/Fetch
```javascript
const response = await fetch('http://localhost:3001/api/ai/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageBase64: imageData // base64 string
  })
});

const analysis = await response.json();
console.log(analysis);
// Вывод:
// {
//   "roomType": "Living Room",
//   "style": "Modern",
//   "colors": ["white", "gray", "wood"],
//   "lighting": "Natural light",
//   "furnishing": "Well-furnished",
//   "recommendations": ["Add more plants", "Better lighting"],
//   "furnitureNeeds": ["Coffee table", "Shelves"]
// }
```

#### Postman
1. Выберите **POST**
2. URL: `http://localhost:3001/api/ai/analyze`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "imageBase64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB..."
}
```

---

### 2. AI Консультант - Чат

#### Curl
```bash
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Какую мебель добавить в маленькую гостиную?"
      }
    ],
    "interiorContext": {
      "roomType": "Living Room",
      "style": "Modern",
      "colors": ["white", "gray"]
    }
  }'
```

#### JavaScript
```javascript
async function chatWithConsultant() {
  const response = await fetch('http://localhost:3001/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        {
          role: 'user',
          content: 'Что можно улучшить в этом интерьере?'
        }
      ],
      interiorContext: {
        roomType: 'Living Room',
        style: 'Modern'
      }
    })
  });

  const data = await response.json();
  console.log('AI ответ:', data.message);
}

chatWithConsultant();
```

---

### 3. Генерация предложений мебели

#### Curl
```bash
curl -X POST http://localhost:3001/api/ai/furniture-proposals \
  -H "Content-Type: application/json" \
  -d '{
    "roomType": "Living Room",
    "style": "Modern",
    "dimensions": {
      "width": 400,
      "depth": 300,
      "height": 250
    }
  }'
```

#### JavaScript
```javascript
const furnitureResponse = await fetch(
  'http://localhost:3001/api/ai/furniture-proposals',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roomType: 'Living Room',
      style: 'Scandinavian',
      dimensions: {
        width: 400,
        depth: 300
      }
    })
  }
);

const furnitureData = await furnitureResponse.json();
console.log('Предложенная мебель:', furnitureData.proposals);
// [
//   {
//     "name": "Modern Sofa",
//     "description": "3-seater sofa",
//     "style": "Modern",
//     "color": "#333333",
//     "dimensions": { "width": 200, "depth": 90, "height": 80 },
//     "price_range": "$800-$1200",
//     "placement": "Against main wall"
//   },
//   ...
// ]
```

---

### 4. Предложение мебели для интерьера

#### Curl
```bash
curl -X POST http://localhost:3001/api/ai/suggest-furniture \
  -H "Content-Type: application/json" \
  -d '{
    "interiorDescription": "Светлая гостиная с деревянным полом",
    "userPreference": "Хочу добавить кофейный стол и полки"
  }'
```

#### JavaScript
```javascript
const suggestions = await fetch(
  'http://localhost:3001/api/ai/suggest-furniture',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      interiorDescription: 'Modern bright living room with wooden floors',
      userPreference: 'Need storage and coffee table'
    })
  }
);

const result = await suggestions.json();
console.log('Рекомендации:', result.furniture);
```

---

## 🖼️ Endpoints интерьеров

### 1. Получить все опубликованные интерьеры

#### Curl
```bash
curl http://localhost:3001/api/interiors
```

#### JavaScript
```javascript
const interiors = await fetch('http://localhost:3001/api/interiors');
const data = await interiors.json();
console.log(data.interiors);
```

---

### 2. Создать новый интерьер

#### Curl
```bash
curl -X POST http://localhost:3001/api/interiors \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "iVBORw0KGgoAAAANSUhE...",
    "analysis": {
      "roomType": "Living Room",
      "style": "Modern"
    },
    "furniture": []
  }'
```

#### JavaScript
```javascript
const newInterior = await fetch('http://localhost:3001/api/interiors', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageBase64: imageData,
    analysis: analysisResult,
    furniture: []
  })
});

const created = await newInterior.json();
console.log('ID интерьера:', created.id);
```

---

### 3. Опубликовать интерьер

#### Curl
```bash
curl -X PUT http://localhost:3001/api/interiors/uuid-here/publish \
  -H "Content-Type: application/json"
```

#### JavaScript
```javascript
const published = await fetch(
  'http://localhost:3001/api/interiors/550e8400-e29b-41d4-a716-446655440000/publish',
  { method: 'PUT' }
);

console.log('Опубликовано:', (await published.json()).published);
```

---

### 4. Добавить мебель в интерьер

#### Curl
```bash
curl -X PUT http://localhost:3001/api/interiors/uuid-here/furniture \
  -H "Content-Type: application/json" \
  -d '{
    "furniture": {
      "name": "Modern Sofa",
      "color": "#333333",
      "material": "fabric",
      "dimensions": {
        "width": 200,
        "depth": 90,
        "height": 80
      }
    }
  }'
```

---

### 5. Добавить просмотр

#### Curl
```bash
curl -X POST http://localhost:3001/api/interiors/uuid-here/view
```

---

### 6. Добавить лайк

#### Curl
```bash
curl -X POST http://localhost:3001/api/interiors/uuid-here/like
```

---

## 📤 Upload endpoint

### Загрузить изображение

#### Curl
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "file=@/path/to/image.jpg"
```

#### JavaScript
```javascript
const formData = new FormData();
formData.append('file', imageFile); // File объект из input type="file"

const upload = await fetch('http://localhost:3001/api/upload', {
  method: 'POST',
  body: formData
});

const result = await upload.json();
console.log('Загруженное изображение:', result.imageBase64);
```

#### HTML Form
```html
<form id="uploadForm">
  <input type="file" name="file" accept="image/*" required />
  <button type="submit">Загрузить</button>
</form>

<script>
  document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    console.log('Base64:', data.imageBase64);
  });
</script>
```

---

## 🧪 Полный workflow пример

```javascript
// 1. Загрузить изображение
const uploadRes = await fetch('http://localhost:3001/api/upload', {
  method: 'POST',
  body: formData
});
const uploadData = await uploadRes.json();

// 2. Анализировать интерьер
const analysisRes = await fetch('http://localhost:3001/api/ai/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ imageBase64: uploadData.imageBase64 })
});
const analysis = await analysisRes.json();

// 3. Создать интерьер
const interiorRes = await fetch('http://localhost:3001/api/interiors', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageBase64: uploadData.imageBase64,
    analysis: analysis,
    furniture: []
  })
});
const interior = await interiorRes.json();

// 4. Генерировать мебель
const furnitureRes = await fetch(
  'http://localhost:3001/api/ai/furniture-proposals',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roomType: analysis.roomType,
      style: analysis.style
    })
  }
);
const proposals = await furnitureRes.json();

// 5. Добавить мебель в интерьер
for (const furniture of proposals.proposals.slice(0, 2)) {
  await fetch(`http://localhost:3001/api/interiors/${interior.id}/furniture`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ furniture })
  });
}

// 6. Опубликовать
await fetch(`http://localhost:3001/api/interiors/${interior.id}/publish`, {
  method: 'PUT'
});

console.log('Интерьер готов: http://localhost:3000/interior/' + interior.id);
```

---

## 🐛 Тестирование с ошибками

### Неверный API ключ
```bash
curl -X POST http://localhost:3001/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"imageBase64": "invalid"}'
# Ответ: 500 Error with Gemini API message
```

### Пустое изображение
```bash
curl -X POST http://localhost:3001/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"imageBase64": ""}'
# Ответ: 400 Bad Request
```

### Несуществующий интерьер
```bash
curl http://localhost:3001/api/interiors/invalid-id
# Ответ: 404 Interior not found
```

---

## 📊 Примеры ответов

### Успешный анализ
```json
{
  "roomType": "Living Room",
  "style": "Scandinavian",
  "colors": ["white", "light wood", "light gray"],
  "lighting": "Bright natural light from windows",
  "furnishing": "Well-furnished with modern minimalist pieces",
  "recommendations": [
    "Add indoor plants for more warmth",
    "Consider warmer lighting for evenings",
    "Add textured pillows for comfort"
  ],
  "furnitureNeeds": ["Area rug", "Floor lamp", "Wall art"]
}
```

### Ошибка
```json
{
  "error": "Invalid image format or size exceeds limit"
}
```

---

## 🔗 Полезные ссылки

- Gemini API Docs: https://ai.google.dev/docs
- API Reference: https://ai.google.dev/reference/rest
- Постman для тестирования: https://www.postman.com/
