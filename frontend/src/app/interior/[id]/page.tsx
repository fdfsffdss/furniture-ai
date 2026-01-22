'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { interiorService } from '../../lib/api';
import { ChatConsultant } from '../../components/ChatConsultant';
import toast from 'react-hot-toast';

export default function InteriorDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [interior, setInterior] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    loadInterior();
  }, [id]);

  const loadInterior = async () => {
    try {
      setIsLoading(true);
      const data = await interiorService.getById(id);
      setInterior(data);
      // Увеличить счётчик просмотров
      await interiorService.addView(id);
    } catch (error) {
      toast.error('Интерьер не найден');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await interiorService.like(id);
      setIsLiked(true);
      setInterior((prev: any) => ({
        ...prev,
        likes: (prev.likes || 0) + 1,
      }));
      toast.success('Лайк добавлен!');
    } catch (error) {
      toast.error('Ошибка при добавлении лайка');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary-main border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!interior) {
    return (
      <div className="text-center py-12">
        <p className="text-2xl text-gray-400">Интерьер не найден</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Image */}
        <div className="lg:col-span-2 space-y-6">
          <img
            src={`data:image/jpeg;base64,${interior.imageBase64}`}
            alt="Interior"
            className="w-full rounded-xl shadow-premium"
          />

          <div className="flex gap-4">
            <button
              onClick={handleLike}
              disabled={isLiked}
              className="flex-1 py-3 bg-primary-main hover:bg-primary-light disabled:opacity-50 text-white font-bold rounded-lg transition"
            >
              ❤️ Лайк ({interior.likes || 0})
            </button>
            <button className="flex-1 py-3 border-2 border-primary-main hover:bg-primary-main hover:bg-opacity-10 text-white font-bold rounded-lg transition">
              📤 Поделиться
            </button>
          </div>

          {/* Furniture */}
          {interior.furniture && interior.furniture.length > 0 && (
            <div className="bg-dark-hover border border-dark-border rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-white">Мебель в интерьере</h3>
              <div className="grid grid-cols-2 gap-4">
                {interior.furniture.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="bg-dark-bg border border-dark-border rounded-lg p-3 space-y-2"
                  >
                    <p className="font-semibold text-white">{item.name}</p>
                    {item.dimensions && (
                      <div className="text-xs text-gray-400 space-y-1">
                        <p>📏 {item.dimensions.width}x{item.dimensions.depth}x{item.dimensions.height} см</p>
                        <p>🎨 {item.color}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info */}
          <div className="bg-dark-hover border border-dark-border rounded-xl p-6 space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-main">{interior.views || 0}</p>
              <p className="text-gray-400 text-sm">Просмотров</p>
            </div>
            <hr className="border-dark-border" />
            <div>
              <h3 className="text-lg font-bold text-white mb-3">Характеристики</h3>
              <div className="space-y-2 text-sm">
                {interior.analysis && Object.entries(interior.analysis).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-400 capitalize">{key}:</span>
                    <span className="text-white font-semibold">
                      {Array.isArray(value) ? value.slice(0, 2).join(', ') : String(value).substring(0, 20)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Consultant */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Консультант</h3>
            <ChatConsultant interiorContext={interior.analysis} />
          </div>

          {/* Add Furniture */}
          <button className="w-full py-3 bg-primary-main hover:bg-primary-light text-white font-bold rounded-lg transition">
            ➕ Добавить мебель
          </button>
        </div>
      </div>
    </div>
  );
}
