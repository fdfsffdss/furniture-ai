'use client';

import { useEffect, useState } from 'react';
import { ChatConsultant } from '@/components/ChatConsultant';
import { aiService } from '@/lib/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ShowroomPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [roomType, setRoomType] = useState('Living Room');
  const [style, setStyle] = useState('Modern');
  const [isLoading, setIsLoading] = useState(false);

  const loadProposals = async () => {
    try {
      setIsLoading(true);
      toast.loading('Генерация предложений...');
      const data = await aiService.generateFurnitureProposals(roomType, style, {});
      setProposals(data.proposals || []);
      toast.success('Предложения загружены!');
    } catch (error) {
      toast.error('Ошибка при генерации');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, [roomType, style]);

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <h1 className="text-4xl font-bold text-center">AI Шоурум мебели</h1>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <div>
          <label className="block text-sm font-semibold mb-3">Тип помещения</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full bg-dark-hover border border-dark-border rounded-lg px-4 py-3 text-white focus:border-primary-main outline-none"
          >
            <option>Living Room</option>
            <option>Bedroom</option>
            <option>Kitchen</option>
            <option>Office</option>
            <option>Bathroom</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3">Стиль</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full bg-dark-hover border border-dark-border rounded-lg px-4 py-3 text-white focus:border-primary-main outline-none"
          >
            <option>Modern</option>
            <option>Classic</option>
            <option>Minimalist</option>
            <option>Bohemian</option>
            <option>Industrial</option>
            <option>Scandinavian</option>
          </select>
        </div>
      </motion.div>

      {/* Proposals Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary-main border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400">Генерация рекомендаций...</p>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {proposals.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-dark-hover border border-dark-border rounded-xl p-6 space-y-4 hover:border-primary-main transition"
            >
              <h3 className="text-xl font-bold text-white">{item.name}</h3>
              <p className="text-gray-300 text-sm">{item.description}</p>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-gray-400">Ширина</span>
                  <p className="font-bold text-white">{item.dimensions?.width} см</p>
                </div>
                <div>
                  <span className="text-gray-400">Глубина</span>
                  <p className="font-bold text-white">{item.dimensions?.depth} см</p>
                </div>
                <div>
                  <span className="text-gray-400">Высота</span>
                  <p className="font-bold text-white">{item.dimensions?.height} см</p>
                </div>
              </div>

              <div className="pt-3 border-t border-dark-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Цвет:</span>
                  <span className="text-white font-semibold">{item.color}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Стиль:</span>
                  <span className="text-white font-semibold">{item.style}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Цена:</span>
                  <span className="text-primary-main font-bold">{item.price_range}</span>
                </div>
              </div>

              <button className="w-full py-2 bg-primary-main hover:bg-primary-light text-white font-semibold rounded transition">
                Добавить в проект
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Consultant */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Нужна помощь?</h2>
        <ChatConsultant
          interiorContext={{
            roomType,
            style,
          }}
        />
      </div>
    </div>
  );
}
