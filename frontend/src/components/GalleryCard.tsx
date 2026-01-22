'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface GalleryCardProps {
  id: string;
  imageBase64: string;
  views: number;
  likes: number;
  furniture: any[];
}

export function GalleryCard({ id, imageBase64, views, likes, furniture }: GalleryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-dark-bg border border-dark-border rounded-xl overflow-hidden shadow-soft hover:shadow-premium transition"
    >
      <Link href={`/interior/${id}`}>
        <div className="relative w-full h-64 bg-dark-hover overflow-hidden cursor-pointer">
          <img
            src={`data:image/jpeg;base64,${imageBase64}`}
            alt="Interior"
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-60"></div>
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex gap-4 text-gray-400">
            <span className="flex items-center gap-1">
              👁️ {views}
            </span>
            <span className="flex items-center gap-1">
              ❤️ {likes}
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          {furniture.length} предметов мебели
        </div>

        <Link
          href={`/interior/${id}`}
          className="block w-full py-2 bg-primary-main hover:bg-primary-light text-white text-center font-semibold rounded transition"
        >
          Открыть
        </Link>
      </div>
    </motion.div>
  );
}
