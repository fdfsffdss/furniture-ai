'use client';

import { useState } from 'react';
import { ImageUpload } from '../../components/ImageUpload';
import { ChatConsultant } from '../../components/ChatConsultant';
import { FurnitureEditor } from '../../components/FurnitureEditor';
import { useInteriorStore } from '../../store/useStore';
import { aiService, interiorService } from '../../lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function UploadPage() {
  const { currentInterior, setCurrentInterior, furniture, addFurniture } = useInteriorStore();
  const [step, setStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

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

              <button
                onClick={handleAddFurniture}
                className="w-full mt-6 py-3 bg-primary-main hover:bg-primary-light text-white font-bold rounded-lg transition"
              >
                ➕ Добавить мебель
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
