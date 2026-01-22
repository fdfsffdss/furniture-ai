import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBTxtMqtrJfqw5NW3oMs7aiSJda4Xu7fkQ';

try {
  console.log('📌 Запрашиваю список доступных моделей...\n');
  
  // Попробуем fetch напрямую
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  );
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  console.log('✅ Доступные модели:');
  console.log('─'.repeat(50));
  
  if (data.models && data.models.length > 0) {
    data.models.forEach((m, idx) => {
      console.log(`${idx + 1}. ${m.name.replace('models/', '')}`);
      if (m.supportedGenerationMethods) {
        console.log(`   Методы: ${m.supportedGenerationMethods.join(', ')}`);
      }
    });
  } else {
    console.log('Нет доступных моделей');
  }
  
} catch (error) {
  console.error('❌ Ошибка:', error.message);
}
