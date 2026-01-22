import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBTxtMqtrJfqw5NW3oMs7aiSJda4Xu7fkQ';
console.log('🔑 API Key:', apiKey.substring(0, 10) + '...');

try {
  const client = new GoogleGenerativeAI(apiKey);
  
  // Попытка получить модель
  console.log('\n📌 Инициализирую модель gemini-pro...');
  const model = client.getGenerativeModel({ 
    model: 'gemini-pro',
    generationConfig: {
      maxOutputTokens: 100,
      temperature: 0.7,
    }
  });
  console.log('✓ Модель инициализирована');

  // Попытка простого запроса
  console.log('\n📌 Отправляю простой запрос...');
  const result = await model.generateContent('Привет! Как дела?');
  console.log('✓ Ответ получен:', result.response.text());
  
} catch (error) {
  console.error('❌ Ошибка:', error.message);
  if (error.status) console.error('Status:', error.status);
  if (error.error) console.error('Error details:', error.error);
}
