import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`📤 Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.status}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Handle specific error codes
    if (error.response?.status === 429) {
      console.warn('⏱️ Rate limit exceeded');
    }
    if (error.response?.status === 503) {
      console.warn('⚠️ Service temporarily unavailable');
    }

    return Promise.reject(error);
  }
);

export const aiService = {
  // Анализ интерьера по изображению
  analyzeInterior: async (imageBase64: string) => {
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      throw new Error('Изображение должно быть строкой Base64');
    }
    const { data } = await api.post('/api/ai/analyze', { imageBase64 });
    return data;
  },

  // Диалог с AI консультантом
  chat: async (messages: Array<{ role: string; content: string; image?: string }>, interiorContext?: any) => {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Сообщения должны быть непустым массивом');
    }
    const { data } = await api.post('/api/ai/chat', { messages, interiorContext });
    return data;
  },

  // Генерация предложений мебели
  generateFurnitureProposals: async (
    roomType: string,
    style: string,
    roomDimensions?: any
  ) => {
    if (!roomType || !style) {
      throw new Error('roomType и style обязательны');
    }
    const { data } = await api.post('/api/ai/furniture-proposals', {
      roomType,
      style,
      roomDimensions: roomDimensions || {},
    });
    return data;
  },

  // Подбор мебели для интерьера
  suggestFurniture: async (interiorDescription: string, userPreference?: string) => {
    if (!interiorDescription) {
      throw new Error('Описание интерьера обязательно');
    }
    const { data } = await api.post('/api/ai/suggest-furniture', {
      interiorDescription,
      userPreference: userPreference || '',
    });
    return data;
  },

  // Измерение размеров на фото
  measureDimensions: async (imageBase64: string, userRequest?: string) => {
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      throw new Error('Изображение должно быть строкой Base64');
    }
    const { data } = await api.post('/api/ai/measure', {
      imageBase64,
      userRequest: userRequest || 'Определи размеры этого помещения',
    });
    return data;
  },

  // Добавить мебель на фото (image-to-image) с опциональными параметрами
  addFurnitureToPhoto: async (imageBase64: string, furnitureDescription: string, options?: { roomSize?: string; furnitureSize?: string; style?: string }) => {
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      throw new Error('Изображение обязательно');
    }
    if (!furnitureDescription || typeof furnitureDescription !== 'string') {
      throw new Error('Описание мебели обязательно');
    }
    const { data } = await api.post('/api/ai/add-furniture', {
      imageBase64,
      furnitureDescription,
      roomSize: options?.roomSize || undefined,
      furnitureSize: options?.furnitureSize || undefined,
      style: options?.style || undefined,
    });
    return data;
  },

  // Универсальная обработка фото с произвольным промптом (image-to-image)
  processPhotoWithPrompt: async (imageBase64: string, prompt: string) => {
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      throw new Error('Изображение обязательно');
    }
    if (!prompt || typeof prompt !== 'string' || prompt.length < 5) {
      throw new Error('Промпт обязателен (минимум 5 символов)');
    }
    const { data } = await api.post('/api/ai/process-photo', {
      imageBase64,
      prompt,
    });
    return data;
  },
};

export const interiorService = {
  // Получить все опубликованные интерьеры
  getPublished: async () => {
    const { data } = await api.get('/api/interiors');
    return data;
  },

  // Получить конкретный интерьер по ID
  getById: async (id: string) => {
    if (!id || typeof id !== 'string') {
      throw new Error('ID интерьера обязателен');
    }
    const { data } = await api.get(`/api/interiors/${id}`);
    return data;
  },

  // Создать новый интерьер
  create: async (imageBase64: string, analysis?: any, furniture?: any[], title?: string) => {
    if (!imageBase64) {
      throw new Error('Изображение обязательно');
    }
    const { data } = await api.post('/api/interiors', {
      imageBase64,
      analysis: analysis || {},
      furniture: furniture || [],
      title: title || 'Новый интерьер',
    });
    return data;
  },

  // Опубликовать интерьер
  publish: async (id: string, title?: string) => {
    if (!id) {
      throw new Error('ID интерьера обязателен');
    }
    const { data } = await api.put(`/api/interiors/${id}/publish`, {
      interiorData: {},
      title: title || 'Мой интерьер',
    });
    return data;
  },

  // Добавить мебель в интерьер
  addFurniture: async (id: string, furniture: any) => {
    if (!id) {
      throw new Error('ID интерьера обязателен');
    }
    if (!furniture || typeof furniture !== 'object') {
      throw new Error('Мебель должна быть объектом');
    }
    const { data } = await api.put(`/api/interiors/${id}/furniture`, { furniture });
    return data;
  },

  // Увеличить счётчик просмотров
  addView: async (id: string) => {
    if (!id) {
      throw new Error('ID интерьера обязателен');
    }
    const { data } = await api.post(`/api/interiors/${id}/view`);
    return data;
  },

  // Добавить лайк
  like: async (id: string) => {
    if (!id) {
      throw new Error('ID интерьера обязателен');
    }
    const { data } = await api.post(`/api/interiors/${id}/like`);
    return data;
  },
};

export const uploadService = {
  // Загрузить изображение интерьера
  upload: async (file: File) => {
    if (!file) {
      throw new Error('Файл обязателен');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Недопустимый тип файла: ${file.type}`);
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Размер файла не должен превышать 10MB');
    }

    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};

export default api;
