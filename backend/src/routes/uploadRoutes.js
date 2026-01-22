import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MIN_FILE_SIZE = 100 * 1024; // 100KB

// Конфигурация multer для загрузки файлов в памяти
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!file) {
      return cb(new Error('Файл не предоставлен'));
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error(`Недопустимый тип файла: ${file.mimetype}`));
    }

    cb(null, true);
  },
});

/**
 * POST /api/upload
 * Загрузка изображения интерьера
 */
router.post(
  '/',
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        error: 'NO_FILE',
        message: 'Файл не загружен'
      });
    }

    // Validate file size
    if (req.file.size < MIN_FILE_SIZE) {
      return res.status(400).json({
        error: 'FILE_TOO_SMALL',
        message: `Размер файла должен быть не менее ${MIN_FILE_SIZE / 1024}KB`
      });
    }

    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(413).json({
        error: 'FILE_TOO_LARGE',
        message: `Размер файла не должен превышать ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      });
    }

    // Convert to base64
    const imageBase64 = req.file.buffer.toString('base64');

    if (!imageBase64 || imageBase64.length === 0) {
      return res.status(500).json({
        error: 'ENCODING_ERROR',
        message: 'Ошибка при кодировании файла'
      });
    }

    const fileId = uuidv4();

    res.status(200).json({
      success: true,
      fileId,
      mimeType: req.file.mimetype,
      size: req.file.size,
      imageBase64,
      uploadedAt: new Date().toISOString(),
    });
  })
);

// Error handler for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'FILE_TOO_LARGE',
        message: `Максимальный размер файла ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      });
    }
    if (error.code === 'LIMIT_PART_COUNT') {
      return res.status(400).json({
        error: 'TOO_MANY_PARTS',
        message: 'Слишком много частей в запросе'
      });
    }
  }

  if (error) {
    return res.status(400).json({
      error: 'UPLOAD_ERROR',
      message: error.message || 'Ошибка при загрузке файла'
    });
  }

  next();
});

export default router;
