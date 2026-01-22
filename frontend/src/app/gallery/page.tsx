'use client';

import { useEffect, useState } from 'react';
import { interiorService } from '@/lib/api';
import { GalleryCard } from '@/components/GalleryCard';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function GalleryPage() {
  const [interiors, setInteriors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInteriors();
  }, []);

  const loadInteriors = async () => {
    try {
      setIsLoading(true);
      const data = await interiorService.getPublished();
      setInteriors(data.interiors || []);
    } catch (error) {
      toast.error('Ошибка при загрузке галереи');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-center">Галерея интерьеров</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary-main border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400">Загрузка интерьеров...</p>
          </div>
        </div>
      ) : interiors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-2xl text-gray-400 mb-6">Галерея пуста</p>
          <a
            href="/upload"
            className="inline-block px-6 py-3 bg-primary-main hover:bg-primary-light text-white font-bold rounded-lg transition"
          >
            Создать первый интерьер
          </a>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {interiors.map((interior, i) => (
            <motion.div
              key={interior.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GalleryCard
                id={interior.id}
                imageBase64={interior.imageBase64}
                views={interior.views || 0}
                likes={interior.likes || 0}
                furniture={interior.furniture || []}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
