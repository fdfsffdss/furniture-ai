import express from 'express';
import {
  analyzeInterior,
  consultantChat,
  generateFurnitureProposals,
  suggestFurnitureFor,
  measureDimensionsFromPhoto,
} from '../services/geminiService.js';
import {
  validateImageUpload,
  validateChatMessages,
  validateFurnitureRequest,
} from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * POST /api/ai/analyze
 * Анализ загруженного интерьера
 */
router.post(
  '/analyze',
  validateImageUpload,
  asyncHandler(async (req, res) => {
    const analysis = await analyzeInterior(req.cleanBase64);
    res.status(200).json(analysis);
  })
);

/**
 * POST /api/ai/chat
 * AI консультант
 */
router.post(
  '/chat',
  validateChatMessages,
  asyncHandler(async (req, res) => {
    const { messages, interiorContext } = req.body;
    const response = await consultantChat(messages, interiorContext || {});
    res.status(200).json({ message: response });
  })
);

/**
 * POST /api/ai/furniture-proposals
 * Генерация предложений мебели
 */
router.post(
  '/furniture-proposals',
  asyncHandler(async (req, res) => {
    const { roomType, style, roomDimensions } = req.body;

    if (!roomType || typeof roomType !== 'string' || roomType.trim().length === 0) {
      return res.status(400).json({
        error: 'INVALID_ROOM_TYPE',
        message: 'roomType обязателен'
      });
    }

    if (!style || typeof style !== 'string' || style.trim().length === 0) {
      return res.status(400).json({
        error: 'INVALID_STYLE',
        message: 'style обязателен'
      });
    }

    const proposals = await generateFurnitureProposals(
      roomType.trim(),
      style.trim(),
      roomDimensions || {}
    );
    res.status(200).json({ proposals });
  })
);

/**
 * POST /api/ai/suggest-furniture
 * Подбор подходящей мебели
 */
router.post(
  '/suggest-furniture',
  asyncHandler(async (req, res) => {
    const { interiorDescription, userPreference } = req.body;

    if (!interiorDescription || typeof interiorDescription !== 'string') {
      return res.status(400).json({
        error: 'INVALID_DESCRIPTION',
        message: 'interiorDescription обязателен'
      });
    }

    const suggestions = await suggestFurnitureFor(
      interiorDescription.trim(),
      (userPreference || '').trim()
    );
    res.status(200).json(suggestions);
  })
);

/**
 * POST /api/ai/measure
 * Измерение размеров на фото
 */
router.post(
  '/measure',
  validateImageUpload,
  asyncHandler(async (req, res) => {
    const { userRequest = 'Определи размеры этого помещения' } = req.body;
    const measurements = await measureDimensionsFromPhoto(req.cleanBase64, userRequest);
    res.status(200).json({ measurements });
  })
);

export default router;
