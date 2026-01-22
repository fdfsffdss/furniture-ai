import express from 'express';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validatePublishRequest } from '../middleware/validation.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../../data');
const dataFile = join(dataDir, 'interiors.json');

const router = express.Router();

// Инициализация файла данных
function initializeData() {
  try {
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }
    if (!existsSync(dataFile)) {
      writeFileSync(dataFile, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('❌ Ошибка инициализации данных:', error.message);
  }
}

function loadInteriors() {
  try {
    initializeData();
    const content = readFileSync(dataFile, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('❌ Ошибка загрузки интерьеров:', error.message);
    return [];
  }
}

function saveInteriors(data) {
  try {
    initializeData();
    writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('❌ Ошибка сохранения интерьеров:', error.message);
    throw error;
  }
}

/**
 * GET /api/interiors
 * Получить все опубликованные интерьеры
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const interiors = loadInteriors().filter(i => i.published);
    res.status(200).json({ interiors });
  })
);

/**
 * GET /api/interiors/:id
 * Получить конкретный интерьер
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: 'INVALID_ID',
        message: 'ID интерьера обязателен'
      });
    }

    const interiors = loadInteriors();
    const interior = interiors.find(i => i.id === id);

    if (!interior) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Интерьер не найден'
      });
    }

    res.status(200).json(interior);
  })
);

/**
 * POST /api/interiors
 * Создать новый интерьер
 */
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { imageBase64, analysis, furniture, title } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({
        error: 'INVALID_IMAGE',
        message: 'Изображение обязательно'
      });
    }

    const interior = {
      id: uuidv4(),
      imageBase64,
      title: (title || 'Новый интерьер').slice(0, 100),
      analysis: analysis || {},
      furniture: Array.isArray(furniture) ? furniture : [],
      published: false,
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
    };

    const interiors = loadInteriors();
    interiors.push(interior);
    saveInteriors(interiors);

    res.status(201).json(interior);
  })
);

/**
 * PUT /api/interiors/:id/publish
 * Опубликовать интерьер
 */
router.put(
  '/:id/publish',
  validatePublishRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: 'INVALID_ID',
        message: 'ID интерьера обязателен'
      });
    }

    const interiors = loadInteriors();
    const interior = interiors.find(i => i.id === id);

    if (!interior) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Интерьер не найден'
      });
    }

    interior.published = true;
    interior.title = (title || interior.title).slice(0, 100);
    interior.publishedAt = new Date().toISOString();
    saveInteriors(interiors);

    res.status(200).json(interior);
  })
);

/**
 * PUT /api/interiors/:id/furniture
 * Добавить мебель в интерьер
 */
router.put(
  '/:id/furniture',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { furniture } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: 'INVALID_ID',
        message: 'ID интерьера обязателен'
      });
    }

    if (!furniture || typeof furniture !== 'object') {
      return res.status(400).json({
        error: 'INVALID_FURNITURE',
        message: 'Данные мебели обязательны'
      });
    }

    const interiors = loadInteriors();
    const interior = interiors.find(i => i.id === id);

    if (!interior) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Интерьер не найден'
      });
    }

    const newFurniture = {
      id: uuidv4(),
      name: (furniture.name || 'Мебель').slice(0, 100),
      ...furniture,
      addedAt: new Date().toISOString(),
    };

    if (!Array.isArray(interior.furniture)) {
      interior.furniture = [];
    }

    interior.furniture.push(newFurniture);
    saveInteriors(interiors);

    res.status(200).json(interior);
  })
);

/**
 * POST /api/interiors/:id/view
 * Увеличить счётчик просмотров
 */
router.post(
  '/:id/view',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: 'INVALID_ID',
        message: 'ID интерьера обязателен'
      });
    }

    const interiors = loadInteriors();
    const interior = interiors.find(i => i.id === id);

    if (!interior) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Интерьер не найден'
      });
    }

    interior.views = (interior.views || 0) + 1;
    saveInteriors(interiors);

    res.status(200).json({ views: interior.views });
  })
);

/**
 * POST /api/interiors/:id/like
 * Лайк интерьера
 */
router.post(
  '/:id/like',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: 'INVALID_ID',
        message: 'ID интерьера обязателен'
      });
    }

    const interiors = loadInteriors();
    const interior = interiors.find(i => i.id === id);

    if (!interior) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Интерьер не найден'
      });
    }

    interior.likes = (interior.likes || 0) + 1;
    saveInteriors(interiors);

    res.status(200).json({ likes: interior.likes });
  })
);

export default router;
