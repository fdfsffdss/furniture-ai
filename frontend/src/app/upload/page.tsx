'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ChatConsultant } from '@/components/ChatConsultant';
import { FurnitureEditor } from '@/components/FurnitureEditor';
import { useInteriorStore } from '@/store/useStore';
import { aiService, interiorService } from '@/lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function UploadPage() {
  const { currentInterior, setCurrentInterior, furniture, addFurniture } = useInteriorStore();
  const [step, setStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [furniturePrompt, setFurniturePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [roomSize, setRoomSize] = useState('');
  const [furnitureSize, setFurnitureSize] = useState('');
  const [style, setStyle] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [promptType, setPromptType] = useState<'furniture' | 'custom'>('furniture');

  // Генерация нового изображения с мебелью
  const handleGenerateWithFurniture = async () => {
    if (!currentInterior?.imageBase64 || !furniturePrompt) {
      toast.error('Укажите, какую мебель добавить!');
      return;
    }
    setIsGenerating(true);
    toast.loading('Генерирую новое изображение с мебелью...');
    try {
      const result = await aiService.addFurnitureToPhoto(currentInterior.imageBase64, furniturePrompt, {
        roomSize,
        furnitureSize,
        style,
      });
      if (result?.imageBase64) {
        setCurrentInterior({ ...currentInterior, imageBase64: result.imageBase64 });
        toast.success('Новое изображение с мебелью готово!');
      } else {
        toast.error('Не удалось получить новое изображение');
      }
    } catch (error) {
      toast.error('Ошибка генерации изображения');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Обработка фото с произвольным промптом
  const handleProcessWithCustomPrompt = async () => {
    if (!currentInterior?.imageBase64 || !customPrompt) {
      toast.error('Укажите, что изменить на фото!');
      return;
    }
    setIsGenerating(true);
    toast.loading('Обрабатываю фото...');
    try {
      const result = await aiService.processPhotoWithPrompt(currentInterior.imageBase64, customPrompt);
      if (result?.imageBase64) {
        setCurrentInterior({ ...currentInterior, imageBase64: result.imageBase64 });
        toast.success('Фото обновлено!');
        setCustomPrompt('');
      } else {
        toast.error('Не удалось обновить фото');
      }
    } catch (error) {
      toast.error('Ошибка обработки фото');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageSelect = async (imageBase64: string, analysis: any) => {
    setCurrentInterior({ imageBase64, analysis });
    setStep(2);
  };

  const handleAddFurniture = async () => {
    if (!currentInterior) return;

    try {
      toast.loading('Генерация предложений мебели...');

      const proposals = await aiService.generateFurnitureProposals(
        currentInterior.analysis?.roomType || 'Living Room',
        currentInterior.analysis?.style || 'Modern',
        currentInterior.analysis?.dimensions || {}
      );

      if (proposals?.proposals?.length > 0) {
        const item = proposals.proposals[0];
        addFurniture(item);
        toast.success('Мебель добавлена!');
      }
    } catch (error) {
      toast.error('Ошибка при добавлении мебели');
      console.error(error);
    }
  };

  const handlePublish = async () => {
    if (!currentInterior) return;

    try {
      setIsCreating(true);
      toast.loading('Сохранение интерьера...');

      const interior = await interiorService.create(
        currentInterior.imageBase64,
        currentInterior.analysis,
        furniture
      );

      // Опубликовать
      await interiorService.publish(interior.id);

      toast.success('Интерьер опубликован! 🎉');
      setTimeout(() => {
        window.location.href = `/interior/${interior.id}`;
      }, 1000);
    } catch (error) {
      toast.error('Ошибка при публикации');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <h1 className="text-4xl font-bold text-center">Создайте свой интерьер</h1>

      {/* Step Indicator */}
      <div className="flex justify-center gap-4">
        {[1, 2, 3].map((s) => (
          <motion.div
            key={s}
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
              s <= step
                ? 'bg-primary-main text-white'
                : 'bg-dark-hover border border-dark-border text-gray-500'
            }`}
            animate={{ scale: s === step ? 1.1 : 1 }}
          >
            {s}
          </motion.div>
        ))}
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <ImageUpload onImageSelect={handleImageSelect} />
        </motion.div>
      )}


      {/* Step 2: Edit */}
      {step === 2 && currentInterior && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <h3 className="text-xl font-semibold mb-4">Анализ интерьера</h3>
              <div className="space-y-3 bg-dark-hover p-6 rounded-xl border border-dark-border">
                {Object.entries(currentInterior.analysis || {}).map(([key, value]: [string, any]) => (
                  <div key={key} className="text-sm">
                    <span className="text-gray-400 capitalize">{key}:</span>
                    <p className="text-white font-semibold">
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                {/* Toggle between furniture and custom prompt */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setPromptType('furniture')}
                    className={`flex-1 py-2 px-3 rounded font-semibold transition ${
                      promptType === 'furniture'
                        ? 'bg-primary-main text-white'
                        : 'bg-dark-hover text-gray-400 border border-dark-border hover:text-white'
                    }`}
                    disabled={isGenerating}
                  >
                    🪑 Добавить мебель
                  </button>
                  <button
                    onClick={() => setPromptType('custom')}
                    className={`flex-1 py-2 px-3 rounded font-semibold transition ${
                      promptType === 'custom'
                        ? 'bg-primary-main text-white'
                        : 'bg-dark-hover text-gray-400 border border-dark-border hover:text-white'
                    }`}
                    disabled={isGenerating}
                  >
                    ✨ Другое изменение
                  </button>
                </div>

                {/* Furniture mode */}
                {promptType === 'furniture' && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded border border-dark-border bg-dark-hover text-white text-sm"
                      placeholder="Что добавить? (например, modern sofa and coffee table)"
                      value={furniturePrompt}
                      onChange={e => setFurniturePrompt(e.target.value)}
                      disabled={isGenerating}
                    />
                    
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded border border-dark-border bg-dark-hover text-white text-sm"
                      placeholder="Размер комнаты (опционально, например: 5x4m)"
                      value={roomSize}
                      onChange={e => setRoomSize(e.target.value)}
                      disabled={isGenerating}
                    />
                    
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded border border-dark-border bg-dark-hover text-white text-sm"
                      placeholder="Размер мебели (опционально, например: 2m wide sofa)"
                      value={furnitureSize}
                      onChange={e => setFurnitureSize(e.target.value)}
                      disabled={isGenerating}
                    />
                    
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded border border-dark-border bg-dark-hover text-white text-sm"
                      placeholder="Стиль дизайна (опционально, например: modern minimalist)"
                      value={style}
                      onChange={e => setStyle(e.target.value)}
                      disabled={isGenerating}
                    />
                    
                    <button
                      onClick={handleGenerateWithFurniture}
                      className="w-full py-3 bg-primary-main hover:bg-primary-light text-white font-bold rounded-lg transition mt-2 disabled:opacity-50"
                      disabled={isGenerating || !furniturePrompt}
                    >
                      {isGenerating ? 'Генерирую...' : '🎨 Сгенерировать с мебелью'}
                    </button>
                  </div>
                )}

                {/* Custom prompt mode */}
                {promptType === 'custom' && (
                  <div className="space-y-2">
                    <textarea
                      className="w-full px-3 py-2 rounded border border-dark-border bg-dark-hover text-white text-sm min-h-24 resize-none"
                      placeholder="Опишите, что вы хотите изменить на фото (например: 'Измени цвет стен с белого на светло-серый', 'Добавь картины на стену', 'Измени освещение на теплый свет')"
                      value={customPrompt}
                      onChange={e => setCustomPrompt(e.target.value)}
                      disabled={isGenerating}
                    />
                    
                    <button
                      onClick={handleProcessWithCustomPrompt}
                      className="w-full py-3 bg-primary-main hover:bg-primary-light text-white font-bold rounded-lg transition mt-2 disabled:opacity-50"
                      disabled={isGenerating || !customPrompt || customPrompt.length < 5}
                    >
                      {isGenerating ? 'Обрабатываю...' : '✨ Применить изменения'}
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleAddFurniture}
                className="w-full mt-4 py-3 bg-primary-main hover:bg-primary-light text-white font-bold rounded-lg transition"
              >
                ➕ Добавить мебель (текстом)
              </button>

              <button
                onClick={() => setStep(3)}
                className="w-full mt-3 py-3 border-2 border-primary-main hover:bg-primary-main hover:bg-opacity-10 text-white font-bold rounded-lg transition"
              >
                Далее →
              </button>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Редактор мебели</h3>
              <div className="bg-dark-hover p-6 rounded-xl border border-dark-border">
                <img
                  src={`data:image/jpeg;base64,${currentInterior.imageBase64}`}
                  alt="Interior preview"
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 3: Finalize */}
      {step === 3 && currentInterior && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Добавленная мебель</h3>
              <FurnitureEditor furniture={furniture} />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">AI Консультант</h3>
                <ChatConsultant interiorContext={currentInterior.analysis} />
              </div>

              <button
                onClick={handlePublish}
                disabled={isCreating}
                className="w-full py-4 bg-primary-main hover:bg-primary-light disabled:opacity-50 text-white font-bold rounded-lg transition text-lg"
              >
                📤 Опубликовать интерьер
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
