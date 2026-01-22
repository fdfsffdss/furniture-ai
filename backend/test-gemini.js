import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBTxtMqtrJfqw5NW3oMs7aiSJda4Xu7fkQ';

console.log('Testing Gemini API...');
console.log('API Key:', apiKey.substring(0, 10) + '...');

try {
  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  console.log('✅ Client initialized');

  const response = await model.generateContent('Hello, respond with "OK" only');
  const text = response.response.text();
  
  console.log('✅ API Response:', text);
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Full error:', error);
}
