'use client';

import { useState, useRef, useEffect } from 'react';
import { aiService } from '../lib/api';
import toast from 'react-hot-toast';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

interface ChatConsultantProps {
  interiorContext?: {
    roomType?: string;
    style?: string;
    colors?: string[];
    lighting?: string;
    [key: string]: any;
  };
}

export function ChatConsultant({ interiorContext }: ChatConsultantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        '👋 Привет! Я ваш AI-консультант по дизайну интерьера. Чем я могу вам помочь? Расскажите о вашем пространстве, загрузите фото интерьера, и я дам вам практичные советы по расстановке мебели.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const MAX_FILE_SIZE = 20 * 1024 * 1024;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('❌ Поддерживаются только JPG, PNG, WebP');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('❌ Размер файла слишком велик (макс 20MB)');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setAttachedImage(base64);
        toast.success('📸 Фото добавлено в сообщение');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Ошибка при загрузке файла');
    }

    // Reset input
    e.currentTarget.value = '';
  };

  const handleRemoveAttachment = () => {
    setAttachedImage(null);
  };

  const handleSendMessage = async () => {
    if ((!input.trim() && !attachedImage) || isLoading) {
      return;
    }

    const userMessage = input.trim() || (attachedImage ? '📸 Помоги проанализировать это фото интерьера' : '');
    const userImage = attachedImage;
    
    // Проверяем, просит ли пользователь измерить размеры
    const measurementKeywords = ['размер', 'измер', 'сколько', 'метр', 'сантиметр', 'см', 'м2', 'площадь', 'длина', 'ширина', 'высота'];
    const isMeasurementRequest = measurementKeywords.some(keyword => userMessage.toLowerCase().includes(keyword));
    
    setInput('');
    setAttachedImage(null);
    setIsLoading(true);

    try {
      // Используем callback чтобы получить актуальный state
      const newMessages = await new Promise<ChatMessage[]>((resolve) => {
        setMessages((prev) => {
          const newMsg: ChatMessage = { role: 'user' as const, content: userMessage };
          if (userImage) newMsg.image = userImage;
          const updated = [...prev, newMsg];
          console.log('📝 Добавлено user сообщение, всего:', updated.length);
          resolve(updated);
          return updated;
        });
      });

      console.log('📤 Отправляю сообщения:', newMessages);
      
      let assistantResponse = '';

      // Если есть фото И просит измерить размеры - используем специальный эндпоинт
      if (userImage && isMeasurementRequest) {
        console.log('📏 Обнаружен запрос на измерение размеров с фото');
        toast.loading('📏 Измеряю размеры...');
        
        try {
          const measureResult = await aiService.measureDimensions(userImage, userMessage);
          assistantResponse = measureResult.measurements;
          toast.dismiss();
          toast.success('📐 Размеры определены!');
        } catch (measureError) {
          console.log('⚠️ Ошибка измерения, использую обычный чат:', measureError);
          const response = await aiService.chat(newMessages, interiorContext || {});
          assistantResponse = response.message;
        }
      } else {
        // Обычный чат
        const response = await aiService.chat(newMessages, interiorContext || {});
        assistantResponse = response.message;
      }
      
      console.log('📥 Получен ответ:', assistantResponse);

      if (!assistantResponse || typeof assistantResponse !== 'string') {
        throw new Error(`Некорректный ответ от сервера`);
      }

      // Добавить ответ AI в UI
      setMessages((prev) => {
        const updated = [...prev, { role: 'assistant' as const, content: assistantResponse }];
        console.log('✅ Ответ добавлен. Всего сообщений:', updated.length);
        return updated;
      });
    } catch (error: any) {
      console.error('❌ Ошибка чата:', error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Ошибка при получении ответа. Попробуйте снова.';

      toast.error(errorMessage);

      // Удалить последнее user сообщение при ошибке
      setMessages((prev) => {
        const updated = prev.slice(0, -1);
        console.log('🔄 Сообщение удалено при ошибке. Осталось:', updated.length);
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-96 flex flex-col bg-[#121212] border border-[#6B0F1A] rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6B0F1A] to-[#8C1D18] px-6 py-4 border-b border-[#6B0F1A]">
        <h3 className="text-white font-bold text-lg">🤖 AI Консультант</h3>
      </div>

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#121212]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs ${
                msg.role === 'user'
                  ? 'bg-[#6B0F1A] text-white shadow-md'
                  : 'bg-[#1a1a1a] text-gray-100 border border-[#8C1D18]'
              }`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Attached"
                  className="w-full rounded-t-lg object-cover max-h-48"
                />
              )}
              <p className={`text-sm leading-relaxed ${msg.image ? 'px-4 py-2' : 'px-4 py-3 rounded-lg'}`}>{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1a1a1a] border border-[#8C1D18] px-4 py-3 rounded-lg">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-[#6B0F1A] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#8C1D18] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-[#6B0F1A] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attached image preview */}
      {attachedImage && (
        <div className="px-4 pt-2 pb-0 bg-[#1a1a1a] border-t border-[#6B0F1A]">
          <div className="relative inline-block">
            <img
              src={attachedImage}
              alt="Attached preview"
              className="h-20 rounded-lg object-cover border border-[#6B0F1A]"
            />
            <button
              onClick={handleRemoveAttachment}
              className="absolute -top-2 -right-2 bg-[#6B0F1A] hover:bg-[#8C1D18] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition"
              title="Удалить фото"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-[#6B0F1A] p-4 flex gap-2 bg-[#1a1a1a]">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          title="Прикрепить фото интерьера"
          className="px-4 py-2 bg-[#2a2a2a] border border-[#6B0F1A] hover:bg-[#3a3a3a] disabled:opacity-50 text-white rounded-lg transition transform hover:scale-105 flex items-center justify-center"
        >
          📎
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введите ваш вопрос или загрузите фото..."
          disabled={isLoading}
          className="flex-1 bg-[#2a2a2a] border border-[#6B0F1A] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#8C1D18] transition disabled:opacity-50"
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || (!input.trim() && !attachedImage)}
          className="px-6 py-2 bg-[#6B0F1A] hover:bg-[#8C1D18] disabled:opacity-50 text-white font-semibold rounded-lg transition transform hover:scale-105"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
