/**
 * Универсальная функция обработки фото с произвольным промптом (image-to-image)
 * @param {string} imageBase64 - исходное фото (base64)
 * @param {string} prompt - описание изменений (на англ. или русском)
 * @returns {Promise<string>} - новое изображение (base64)
 */
export async function processPhotoWithPrompt(imageBase64, prompt) {
  try {
    console.log('🖼️ Обрабатываю фото с промптом через Gemini...');
    const currentModel = getModel();

    const enhancedPrompt = `${prompt}

Generate a photorealistic, beautiful, aesthetically pleasing image that matches the request. 
Make sure all proportions are correct and changes blend naturally with the existing scene. 
The result should look like a professional rendering.
Return ONLY the new image as base64, no text.`;

    const response = await retryWithBackoff(async () => {
      return await currentModel.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageBase64,
                },
              },
              { text: enhancedPrompt },
            ],
          },
        ],
      });
    });

    // Gemini может вернуть base64 или ссылку, парсим ответ
    const text = response.response.text();
    // Попробуем найти base64-строку в ответе
    const base64Match = text.match(/[A-Za-z0-9+/=]{100,}/);
    if (base64Match) {
      return base64Match[0];
    }
    throw new Error('Gemini не вернул изображение');
  } catch (error) {
    console.error('❌ Ошибка обработки фото:', error.message);
    throw error;
  }
}

/**
 * Добавить мебель на фото с помощью Gemini (image-to-image)
 * @param {string} imageBase64 - исходное фото (base64)
 * @param {string} furnitureDescription - описание мебели (на англ. или русском)
 * @param {object} options - опциональные параметры (размеры, стиль и т.д.)
 * @returns {Promise<string>} - новое изображение (base64)
 */
export async function addFurnitureToPhoto(imageBase64, furnitureDescription, options = {}) {
  try {
    console.log('🪑 Генерирую изображение с добавленной мебелью через Gemini...');
    
    // Построить детальный промпт с размерами и стилем
    let prompt = `Add the following furniture to this room photo: ${furnitureDescription}.`;
    
    if (options.roomSize) {
      prompt += ` Room size: ${options.roomSize}.`;
    }
    
    if (options.furnitureSize) {
      prompt += ` Furniture dimensions: ${options.furnitureSize}.`;
    }
    
    if (options.style) {
      prompt += ` Style: ${options.style}.`;
    }

    return await processPhotoWithPrompt(imageBase64, prompt);
  } catch (error) {
    console.error('❌ Ошибка генерации изображения с мебелью:', error.message);
    throw error;
  }
}
import { GoogleGenerativeAI } from '@google/generative-ai';

let client = null;
let model = null;

// Configuration constants
const CONFIG = {
  MODEL: 'gemini-2.5-flash',
  MAX_TOKENS: 2048,
  TEMPERATURE: 0.7,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
  TIMEOUT_MS: 30000,
};

/**
 * Инициализировать Gemini клиент
 */
export function initGemini() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY не установлен в .env файле');
  }

  try {
    client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = client.getGenerativeModel({ 
      model: CONFIG.MODEL,
      generationConfig: {
        maxOutputTokens: CONFIG.MAX_TOKENS,
        temperature: CONFIG.TEMPERATURE,
      }
    });
    console.log('✅ Gemini AI инициализирован успешно');
  } catch (error) {
    console.error('❌ Ошибка инициализации Gemini:', error.message);
    throw error;
  }
}

/**
 * Получить модель (ленивая инициализация)
 */
function getModel() {
  if (!model) {
    initGemini();
  }
  return model;
}

/**
 * Retry wrapper для API запросов
 */
async function retryWithBackoff(fn, retries = CONFIG.RETRY_ATTEMPTS) {
  for (let i = 0; i < retries; i++) {
    try {
      return await Promise.race([
        fn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), CONFIG.TIMEOUT_MS)
        )
      ]);
    } catch (error) {
      if (i === retries - 1) throw error;
      console.warn(`⚠️ Retry ${i + 1}/${retries} после ошибки: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY_MS * (i + 1)));
    }
  }
}

/**
 * Парсить JSON из ответа Gemini
 */
function parseJSONResponse(text) {
  let jsonStr = text.trim();
  
  // Try to extract JSON array
  let startIdx = jsonStr.indexOf('[');
  let endIdx = -1;
  
  if (startIdx !== -1) {
    // Find matching closing bracket
    let depth = 0;
    for (let i = startIdx; i < jsonStr.length; i++) {
      if (jsonStr[i] === '[' || jsonStr[i] === '{') depth++;
      if (jsonStr[i] === ']' || jsonStr[i] === '}') depth--;
      if (depth === 0) {
        endIdx = i + 1;
        break;
      }
    }
    if (endIdx > startIdx) {
      jsonStr = jsonStr.substring(startIdx, endIdx);
    }
  } else {
    // Try to extract JSON object
    startIdx = jsonStr.indexOf('{');
    if (startIdx !== -1) {
      let depth = 0;
      for (let i = startIdx; i < jsonStr.length; i++) {
        if (jsonStr[i] === '[' || jsonStr[i] === '{') depth++;
        if (jsonStr[i] === ']' || jsonStr[i] === '}') depth--;
        if (depth === 0) {
          endIdx = i + 1;
          break;
        }
      }
      if (endIdx > startIdx) {
        jsonStr = jsonStr.substring(startIdx, endIdx);
      }
    }
  }

  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    throw new Error(`Ошибка парсинга JSON: ${error.message}`);
  }
}

/**
 * Анализ интерьера по изображению с определением размеров
 */
export async function analyzeInterior(imageBase64) {
  try {
    console.log('🔍 Анализирую интерьер и размеры...');
    const currentModel = getModel();

    const response = await retryWithBackoff(async () => {
      return await currentModel.generateContent({
        contents: [{
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              text: `Analyze this interior image thoroughly. Respond with ONLY valid JSON (no markdown):
{
  "roomType": "string (e.g., Living Room, Bedroom)",
  "style": "string (e.g., Modern, Minimalist, Classic)",
  "colors": ["array of main colors"],
  "lighting": "string (Natural/Artificial/Mixed)",
  "condition": "string (Well-furnished/Sparse/Empty)",
  "squareMeters": "number or null if unknown - estimate based on visible elements",
  "estimatedDimensions": {
    "length": "number in meters or null - estimate from proportions",
    "width": "number in meters or null - estimate from proportions", 
    "ceilingHeight": "number in meters or null - standard is 2.5-3m"
  },
  "measurementMethod": "string - explain how you estimated dimensions (e.g., 'Based on door width, standard is 90cm')",
  "recommendations": ["practical suggestions"],
  "furnitureNeeds": ["what furniture is missing"]
}`,
            },
          ],
        }],
      });
    });

    const text = response.response.text();
    const result = parseJSONResponse(text);

    // Validate response structure
    if (!result.roomType || !result.style) {
      throw new Error('Неполный ответ от AI');
    }

    console.log('✅ Анализ интерьера завершен');
    console.log('📐 Определенные размеры:', result.estimatedDimensions);
    return result;
  } catch (error) {
    console.error('❌ Ошибка анализа интерьера:', error.message);
    throw error;
  }
}

/**
 * AI консультант – диалоговый режим с поддержкой фото
 */
export async function consultantChat(messages, interiorContext) {
  try {
    console.log('💬 Консультант обрабатывает запрос...');
    const currentModel = getModel();

    if (!messages || messages.length === 0) {
      throw new Error('Сообщения не предоставлены');
    }

    // Limit message history to avoid token overflow
    const recentMessages = messages.slice(-10);

    // Get the last user message
    const lastUserMessage = recentMessages[recentMessages.length - 1];
    if (!lastUserMessage || lastUserMessage.role !== 'user') {
      throw new Error('Последнее сообщение должно быть от пользователя');
    }

    const systemPrompt = `Ты эксперт по дизайну интерьера с математическими навыками.
Контекст помещения: ${JSON.stringify(interiorContext || {})}.

ПРАВИЛА:
1. Отвечай на русском языке, кратко (1-3 предложения)
2. ЕСЛИ пользователь загрузит фото комнаты - анализируй его для определения размеров
3. ЕСЛИ пользователь просит измерить что-то - используй визуальный анализ фото для расчетов
4. Предоставляй размеры в см: ширина x глубина x высота
5. При анализе фото смотри на пропорции мебели, дверей, окон как ориентиры
6. Если размеры неясны - приведи примерные диапазоны с пояснением
7. Помогай с расстановкой мебели, декором и дизайном
8. Вычисляй площадь помещения если даны размеры (площадь = длина × ширина м²)

ПРИМЕРЫ РАСЧЕТОВ:
- Если на фото видна стандартная дверь (обычно 90см ширина) - используй как масштаб
- Высота потолков в типовых домах: 2.5-3м
- Стандартный размер окна: 120-150см ширина

Когда просят измерить или рассчитать - всегда давай цифры и объяснение метода`;

    // Build conversation history with proper format
    const contents = [];
    
    // Add system prompt as first message
    contents.push({
      role: 'user',
      parts: [{ text: systemPrompt }]
    });
    
    contents.push({
      role: 'model',
      parts: [{ text: 'Понял. Я готов помочь с дизайном интерьера. Что я могу для вас сделать?' }]
    });

    // Add previous messages to history (excluding the last one)
    for (let i = 0; i < recentMessages.length - 1; i++) {
      const msg = recentMessages[i];
      const role = msg.role === 'user' ? 'user' : 'model';
      
      const parts = [];
      
      // Add image if present
      if (msg.image && msg.role === 'user') {
        // Extract base64 data
        const base64Data = msg.image.split(',')[1] || msg.image;
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data,
          },
        });
      }
      
      // Add text content
      parts.push({ text: msg.content });
      
      contents.push({
        role: role,
        parts: parts
      });
    }
    
    // Add last user message with potential image
    const lastUserParts = [];
    
    if (lastUserMessage.image && lastUserMessage.role === 'user') {
      const base64Data = lastUserMessage.image.split(',')[1] || lastUserMessage.image;
      lastUserParts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data,
        },
      });
    }
    
    lastUserParts.push({ text: lastUserMessage.content });
    
    contents.push({
      role: 'user',
      parts: lastUserParts
    });

    console.log(`📝 История из ${contents.length} сообщений${lastUserMessage.image ? ' (с фото)' : ''}`);

    const response = await retryWithBackoff(async () => {
      return await currentModel.generateContent({
        contents: contents,
      });
    });

    const answer = response.response.text().trim();

    if (!answer) {
      throw new Error('Пустой ответ от AI');
    }

    console.log('✅ Получен ответ консультанта');
    return answer;
  } catch (error) {
    console.error('❌ Ошибка консультанта:', error.message);
    throw error;
  }
}

/**
 * Генерация предложений по мебели с размерами
 */
export async function generateFurnitureProposals(roomType, style, roomDimensions) {
  try {
    console.log(`🛋️ Генерирую предложения мебели для ${roomType} в стиле ${style}...`);
    const currentModel = getModel();

    if (!roomType || !style) {
      throw new Error('roomType и style обязательны');
    }

    const prompt = `You are a professional interior designer. Suggest exactly 3 furniture pieces for a ${roomType} in ${style} style.
Room dimensions if provided: ${JSON.stringify(roomDimensions || {})}.

For each piece provide in this exact format (one piece per section, separated by "---"):

PIECE 1
Name: [furniture name]
Description: [one sentence about this piece]
Color: [color hex like #FF6B6B or color name]
Width: [number in cm]
Depth: [number in cm]
Height: [number in cm]
Price: [price range]
Placement: [where to place it]
Reason: [why it works]

---

PIECE 2
[same format]

---

PIECE 3
[same format]`;

    const response = await retryWithBackoff(async () => {
      return await currentModel.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }],
        }],
      });
    });

    const text = response.response.text();
    console.log('📝 Raw response:', text.substring(0, 200));
    
    // Parse structured response instead of JSON
    const pieces = text.split('---').filter(p => p.trim());
    const proposals = [];

    for (let i = 0; i < Math.min(pieces.length, 3); i++) {
      const piece = pieces[i];
      const lines = piece.split('\n').filter(l => l.trim());
      
      const proposal = {
        id: `furniture_${i + 1}`,
        name: extractField(lines, 'Name') || `Furniture ${i + 1}`,
        description: extractField(lines, 'Description') || '',
        style: style,
        color: extractField(lines, 'Color') || '#888888',
        dimensions: {
          width_cm: parseInt(extractField(lines, 'Width')) || 80,
          depth_cm: parseInt(extractField(lines, 'Depth')) || 80,
          height_cm: parseInt(extractField(lines, 'Height')) || 80,
        },
        price_range: extractField(lines, 'Price') || 'Contact for price',
        placement: extractField(lines, 'Placement') || 'Flexible',
        reasoning: extractField(lines, 'Reason') || '',
      };
      
      proposals.push(proposal);
    }

    console.log(`✅ Сгенерировано ${proposals.length} предложений мебели`);
    return proposals;
  } catch (error) {
    console.error('❌ Ошибка генерации мебели:', error.message);
    throw error;
  }
}

function extractField(lines, fieldName) {
  const line = lines.find(l => l.startsWith(`${fieldName}:`));
  if (line) {
    return line.substring(fieldName.length + 1).trim();
  }
  return null;
}

/**
 * Подбор мебели с рекомендациями стиля
 */
export async function suggestFurnitureFor(interiorDescription, userPreference) {
  try {
    console.log('🔎 Подбираю подходящую мебель...');
    const currentModel = getModel();

    if (!interiorDescription || typeof interiorDescription !== 'string') {
      throw new Error('Описание интерьера обязательно');
    }

    const prompt = `You are an interior design expert. Based on this interior: "${interiorDescription.slice(0, 200)}"
${userPreference ? `and user preference: "${userPreference.slice(0, 100)}"` : ''}

Suggest 2-3 matching furniture pieces. For each piece use this format (separated by "---"):

PIECE 1
Name: [furniture name]
Description: [one sentence description]
Match Score: [0-100 how well it matches]
Reason: [why it matches the interior]
Width: [cm]
Depth: [cm]
Height: [cm]
Color: [hex color or name]
Price: [price range]

---

PIECE 2
[same format]

Also provide a brief overall suggestion at the beginning.`;

    const response = await retryWithBackoff(async () => {
      return await currentModel.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }],
        }],
      });
    });

    const text = response.response.text();
    
    // Extract overall suggestion (everything before first PIECE)
    const suggestionMatch = text.match(/^(.*?)(?=PIECE 1|PIECE 2|$)/s);
    const suggestion = suggestionMatch ? suggestionMatch[1].trim() : 'Check the furniture suggestions below';
    
    // Parse furniture pieces
    const pieces = text.split('---').slice(1).filter(p => p.trim());
    const furniture = [];

    for (let i = 0; i < Math.min(pieces.length, 3); i++) {
      const piece = pieces[i];
      const lines = piece.split('\n').filter(l => l.trim());
      
      const item = {
        id: `suggestion_${i + 1}`,
        name: extractField(lines, 'Name') || `Furniture ${i + 1}`,
        description: extractField(lines, 'Description') || '',
        matchScore: parseInt(extractField(lines, 'Match Score')) || 75,
        reason: extractField(lines, 'Reason') || '',
        dimensions: {
          width_cm: parseInt(extractField(lines, 'Width')) || 80,
          depth_cm: parseInt(extractField(lines, 'Depth')) || 80,
          height_cm: parseInt(extractField(lines, 'Height')) || 80,
        },
        color: extractField(lines, 'Color') || '#888888',
        estimatedPrice: extractField(lines, 'Price') || 'Contact for price',
      };
      
      furniture.push(item);
    }

    console.log('✅ Подбор мебели завершен');
    return {
      suggestion,
      furniture,
    };
  } catch (error) {
    console.error('❌ Ошибка подбора мебели:', error.message);
    throw error;
  }
}

/**
 * Измерение размеров по фото когда пользователь просит
 */
export async function measureDimensionsFromPhoto(imageBase64, userRequest) {
  try {
    console.log('📏 Измеряю размеры на фото...');
    const currentModel = getModel();

    const response = await retryWithBackoff(async () => {
      return await currentModel.generateContent({
        contents: [{
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              text: `Пользователь просит: "${userRequest}"

Проанализируй изображение и определи размеры. Используй визуальные ориентиры (двери ~90см, окна, стандартные мебель и человек как масштаб).

Ответь на русском языке в формате:

ОСНОВНЫЕ РАЗМЕРЫ:
- Примерная длина комнаты: X метров (основание: [описание])
- Примерная ширина комнаты: X метров (основание: [описание])
- Высота потолков: X метров (основание: [описание])
- Общая площадь: X м² (= длина × ширина)

РАЗМЕРЫ ВИДИМЫХ ОБЪЕКТОВ:
[Для каждого объекта в комнате]:
- [Объект]: примерно X см (ширина) × Y см (глубина) × Z см (высота)

МЕТОДОЛОГИЯ:
[Объясни как ты определил размеры, какие использовал масштабы и ориентиры]

УВЕРЕННОСТЬ:
[Высокая/Средняя/Низкая] - укажи почему`,
            },
          ],
        }],
      });
    });

    const answer = response.response.text().trim();
    console.log('✅ Размеры определены');
    return answer;
  } catch (error) {
    console.error('❌ Ошибка измерения размеров:', error.message);
    throw error;
  }
}