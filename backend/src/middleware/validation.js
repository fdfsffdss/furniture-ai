/**
 * Validation middleware for request data
 */

export const validateImageUpload = (req, res, next) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({
      error: 'IMAGE_REQUIRED',
      message: 'Изображение не предоставлено'
    });
  }

  // Check if it's a valid base64 string
  if (typeof imageBase64 !== 'string' || imageBase64.length < 100) {
    return res.status(400).json({
      error: 'INVALID_IMAGE',
      message: 'Некорректное изображение'
    });
  }

  // Remove data URL prefix if present
  let cleanBase64 = imageBase64;
  if (imageBase64.includes(',')) {
    cleanBase64 = imageBase64.split(',')[1];
  }

  // Validate base64 format
  if (!/^[A-Za-z0-9+/=]+$/.test(cleanBase64)) {
    return res.status(400).json({
      error: 'INVALID_BASE64',
      message: 'Некорректный формат Base64'
    });
  }

  req.cleanBase64 = cleanBase64;
  next();
};

export const validateChatMessages = (req, res, next) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({
      error: 'INVALID_MESSAGES',
      message: 'Сообщения должны быть массивом'
    });
  }

  if (messages.length === 0) {
    return res.status(400).json({
      error: 'EMPTY_MESSAGES',
      message: 'Массив сообщений пуст'
    });
  }

  // Validate each message
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (!msg.role || !msg.content) {
      return res.status(400).json({
        error: 'INVALID_MESSAGE_STRUCTURE',
        message: `Сообщение ${i} имеет неправильную структуру`
      });
    }

    if (msg.role !== 'user' && msg.role !== 'assistant') {
      return res.status(400).json({
        error: 'INVALID_ROLE',
        message: `Неизвестная роль в сообщении ${i}: ${msg.role}`
      });
    }

    if (typeof msg.content !== 'string' || msg.content.trim().length === 0) {
      return res.status(400).json({
        error: 'EMPTY_CONTENT',
        message: `Содержание сообщения ${i} пусто`
      });
    }
  }

  next();
};

export const validateFurnitureRequest = (req, res, next) => {
  const { description, roomContext } = req.body;

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return res.status(400).json({
      error: 'INVALID_DESCRIPTION',
      message: 'Описание мебели обязательно'
    });
  }

  if (description.length > 1000) {
    return res.status(400).json({
      error: 'DESCRIPTION_TOO_LONG',
      message: 'Описание не должно превышать 1000 символов'
    });
  }

  next();
};

export const validatePublishRequest = (req, res, next) => {
  const { interiorData, title } = req.body;

  if (!interiorData) {
    return res.status(400).json({
      error: 'INTERIOR_REQUIRED',
      message: 'Данные интерьера обязательны'
    });
  }

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      error: 'TITLE_REQUIRED',
      message: 'Название интерьера обязательно'
    });
  }

  if (title.length > 100) {
    return res.status(400).json({
      error: 'TITLE_TOO_LONG',
      message: 'Название не должно превышать 100 символов'
    });
  }

  next();
};
