'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden">
        {/* Background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark to-dark-bg opacity-30 blur-3xl -z-10"></div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold text-white">
            DESIGNYX - Твой AI Консультант по Интерьеру
          </h1>
          <p className="text-2xl text-gray-300">
            Виртуальный дизайнер интерьера на базе Google Gemini для идеальной расстановки мебели
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <Link
            href="/upload"
            className="px-8 py-4 bg-primary-main hover:bg-primary-light text-white text-lg font-bold rounded-lg transition transform hover:scale-105 shadow-premium"
          >
            📸 Загрузить интерьер
          </Link>
          <Link
            href="/gallery"
            className="px-8 py-4 border-2 border-primary-main hover:bg-primary-main hover:bg-opacity-10 text-white text-lg font-bold rounded-lg transition"
          >
            🏛️ Галерея интерьеров
          </Link>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mt-20"
        >
          {[
            { icon: '📷', title: 'Загрузка фото', desc: 'Просто загрузите фото вашего интерьера' },
            { icon: '🤖', title: 'AI анализ', desc: 'Gemini проанализирует стиль и пространство' },
            { icon: '🛋️', title: 'Мебель в интерьер', desc: 'Смотрите, как мебель выглядит в реальности' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="p-6 bg-dark-hover border border-dark-border rounded-xl"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto space-y-12">
        <h2 className="text-4xl font-bold text-center text-white mb-12">Возможности</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: '💬 AI Консультант',
              desc: 'Диалог с AI для советов по расстановке мебели и дизайну',
            },
            {
              title: '🎨 Кастомизация',
              desc: 'Изменяйте цвет, материал и размеры мебели в реальном времени',
            },
            {
              title: '📐 Точные размеры',
              desc: 'Вводите ширину, глубину, высоту для реалистичного масштабирования',
            },
            {
              title: '📤 Опубликовать',
              desc: 'Делитесь своими интерьерами и добавляйте мебель в чужие проекты',
            },
          ].map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="p-6 bg-dark-hover border border-dark-border rounded-xl"
            >
              <h3 className="text-2xl font-bold text-white mb-3">{benefit.title}</h3>
              <p className="text-gray-300">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
