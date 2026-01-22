'use client';

import { useState, useRef } from 'react';
import { uploadService, aiService } from '../lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface ImageUploadProps {
  onImageSelect: (imageBase64: string, analysis: any) => void;
  isLoading?: boolean;
}

export function ImageUpload({ onImageSelect, isLoading = false }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  const MIN_FILE_SIZE = 50 * 1024; // 50KB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  const validateFile = (file: File): string | null => {
    if (!file) {
      return 'Файл не выбран';
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return `❌ Недопустимый формат. Поддерживаются: JPG, PNG, WebP`;
    }

    if (file.size < MIN_FILE_SIZE) {
      return `❌ Размер файла слишком мал (минимум ${(MIN_FILE_SIZE / 1024).toFixed(0)}KB)`;
    }

    if (file.size > MAX_FILE_SIZE) {
      return `❌ Размер файла слишком велик (максимум ${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)}MB)`;
    }

    return null;
  };

  const handleFile = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    try {
      // Показать preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      const toastId = toast.loading('📤 Загружаю изображение...');
      setIsAnalyzing(true);
      setUploadProgress(30);

      // Загрузить файл
      const uploadResult = await uploadService.upload(file);
      const imageBase64 = uploadResult.imageBase64;
      setUploadProgress(60);

      toast.loading('🔍 Анализирую интерьер с помощью AI...\nЭто может занять 10-30 секунд', { id: toastId });

      // Анализировать интерьер через Gemini API
      const analysis = await aiService.analyzeInterior(imageBase64);
      setUploadProgress(90);

      if (!analysis.roomType || !analysis.style) {
        throw new Error('Анализ не вернул полные данные');
      }

      setUploadProgress(100);
      toast.success('✅ Интерьер проанализирован!\n🏠 Комната: ' + analysis.roomType + '\n🎨 Стиль: ' + analysis.style, { id: toastId, duration: 3 });
      
      setTimeout(() => {
        onImageSelect(imageBase64, analysis);
      }, 500);
    } catch (error: any) {
      console.error('❌ Ошибка обработки изображения:', error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Ошибка при обработке изображения. Попробуйте снова.';

      toast.error('❌ ' + errorMessage);
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      handleFile(file);
    } else {
      toast.error('❌ Перетащите один файл изображения');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-6">
      {/* Preview */}
      {previewImage && !isAnalyzing && (
        <div className="rounded-2xl overflow-hidden border-2 border-[#6B0F1A] bg-dark-main">
          <div className="relative w-full h-96">
            <Image
              src={previewImage}
              alt="Preview"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="p-4 bg-dark-hover">
            <button
              onClick={() => {
                setPreviewImage(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="w-full py-2 px-4 bg-[#6B0F1A] hover:bg-[#8C1D18] text-white rounded-lg font-semibold transition"
            >
              🔄 Выбрать другое фото
            </button>
          </div>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClickUpload}
        className={`w-full p-12 border-2 border-dashed rounded-2xl transition cursor-pointer ${
          isDragging
            ? 'border-[#6B0F1A] bg-[#6B0F1A] bg-opacity-20 scale-105'
            : 'border-[#6B0F1A] hover:border-[#8C1D18] hover:bg-dark-hover'
        } ${isAnalyzing ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
      >
        <label className="flex flex-col items-center justify-center cursor-pointer">
          <div className={`transition-transform mb-4 ${isAnalyzing ? 'animate-pulse' : 'hover:scale-110'}`}>
            {isAnalyzing ? (
              <svg className="w-16 h-16 text-[#6B0F1A] animate-spin" fill="none" stroke="currentColor">
                <circle cx="24" cy="24" r="20" strokeWidth={2} className="opacity-25" />
                <path strokeLinecap="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-16 h-16 text-[#6B0F1A]" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>

          <h3 className="text-xl font-semibold text-white mb-2">
            {isAnalyzing ? '⏳ Анализирую с помощью AI...' : '📸 Загрузите фото интерьера'}
          </h3>
          
          <p className="text-gray-400 text-center mb-4 text-sm">
            {isAnalyzing
              ? 'Gemini анализирует комнату, стиль, цвета и рекомендации...'
              : 'Перетащите фото интерьера сюда или нажмите для выбора'}
          </p>

          {uploadProgress > 0 && (
            <div className="w-full max-w-xs mb-6">
              <div className="bg-[#2a2a2a] rounded-full h-3 overflow-hidden border border-[#6B0F1A]">
                <div
                  className="bg-gradient-to-r from-[#6B0F1A] via-[#8C1D18] to-[#6B0F1A] h-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2 text-center font-semibold">{uploadProgress}%</p>
              {uploadProgress === 30 && <p className="text-xs text-gray-500 mt-1 text-center">Загрузка...</p>}
              {uploadProgress === 60 && <p className="text-xs text-gray-500 mt-1 text-center">Отправка в Gemini AI...</p>}
              {uploadProgress === 90 && <p className="text-xs text-gray-500 mt-1 text-center">Обработка результатов...</p>}
            </div>
          )}

          <div className="text-xs text-gray-500 text-center bg-dark-hover rounded-lg p-3 w-full">
            <p className="mb-2">✅ Поддерживаемые форматы: JPG, PNG, WebP</p>
            <p>📊 Максимальный размер: 20MB</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileInput}
            disabled={isAnalyzing}
            className="hidden"
          />
        </label>
      </div>

      {/* Info */}
      <div className="bg-dark-hover rounded-lg p-4 border border-[#6B0F1A] border-opacity-30">
        <p className="text-gray-300 text-sm">
          💡 <span className="font-semibold">Что происходит:</span> Ваше фото будет проанализировано с помощью AI Gemini для определения типа комнаты, стиля, цветовой схемы, освещения и рекомендаций по мебели.
        </p>
      </div>
    </div>
  );
}
