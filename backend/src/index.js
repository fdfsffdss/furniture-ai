import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initGemini } from './services/geminiService.js';
import aiRoutes from './routes/aiRoutes.js';
import interiorRoutes from './routes/interiorRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { rateLimiter, requestLogger, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Инициализировать Gemini при запуске
try {
  initGemini();
  console.log('🚀 Gemini инициализирован успешно');
} catch (error) {
  console.error('❌ Ошибка инициализации Gemini:', error.message);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Security and logging middleware
app.use(requestLogger);
app.use(rateLimiter);

// Serve Next.js frontend (если существует)
const frontendBuildPath = path.join(__dirname, '../../frontend/.next/standalone');
const publicPath = path.join(__dirname, '../../frontend/public');

// Проверяем существует ли Next.js build
try {
  if (NODE_ENV === 'production') {
    // Используем Next.js standalone build
    app.use(express.static(frontendBuildPath));
    app.use(express.static(publicPath));
    console.log('📦 Frontend build найден, serving статические файлы');
  } else {
    // Для development режима
    console.log('🔄 Используется локальный Next.js dev server (http://localhost:3000)');
  }
} catch (error) {
  console.warn('⚠️ Frontend build не найден:', error.message);
}

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/interiors', interiorRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// Status endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: '✅ Backend работает',
    api: 'FurniAI - Мебельный AI-сервис',
    version: '1.0.0',
    environment: NODE_ENV,
    endpoints: {
      health: 'GET /health',
      analyze: 'POST /api/ai/analyze',
      chat: 'POST /api/ai/chat',
      furniture_proposals: 'POST /api/ai/furniture-proposals',
      suggest_furniture: 'POST /api/ai/suggest-furniture',
      interiors: 'GET /api/interiors',
      interior_detail: 'GET /api/interiors/:id',
      publish: 'PUT /api/interiors/:id/publish',
      add_furniture: 'PUT /api/interiors/:id/furniture',
      upload: 'POST /api/upload'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: 'Маршрут не найден',
    path: req.path
  });
});

// Error handler (должен быть последним)
app.use(errorHandler);

// Запуск сервера
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Backend запущен на http://localhost:${PORT}`);
  console.log(`📁 API endpoints:`);
  console.log(`   GET    /health`);
  console.log(`   GET    /`);
  console.log(`   POST   /api/ai/analyze`);
  console.log(`   POST   /api/ai/chat`);
  console.log(`   POST   /api/ai/furniture-proposals`);
  console.log(`   POST   /api/ai/suggest-furniture`);
  console.log(`   GET    /api/interiors`);
  console.log(`   GET    /api/interiors/:id`);
  console.log(`   POST   /api/interiors`);
  console.log(`   PUT    /api/interiors/:id/publish`);
  console.log(`   PUT    /api/interiors/:id/furniture`);
  console.log(`   POST   /api/interiors/:id/view`);
  console.log(`   POST   /api/interiors/:id/like`);
  console.log(`   POST   /api/upload\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⏹️ SIGTERM получен, закрываю сервер...');
  server.close(() => {
    console.log('✅ Сервер закрыт');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⏹️ SIGINT получен, закрываю сервер...');
  server.close(() => {
    console.log('✅ Сервер закрыт');
    process.exit(0);
  });
});

// Unhandled error handler
process.on('uncaughtException', (error) => {
  console.error('❌ Необработанное исключение:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Необработанное отклонение Promise:', reason);
});
