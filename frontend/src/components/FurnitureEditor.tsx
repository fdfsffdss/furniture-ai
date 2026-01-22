'use client';

import { useInteriorStore } from '../store/useStore';
import { motion } from 'framer-motion';

interface FurnitureEditorProps {
  furniture: any[];
}

export function FurnitureEditor({ furniture }: FurnitureEditorProps) {
  const { updateFurniture, removeFurniture } = useInteriorStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {furniture.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-bg border border-dark-border rounded-xl p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-white">{item.name}</h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400">Ширина (см)</label>
              <input
                type="number"
                value={item.dimensions?.width || 0}
                onChange={(e) =>
                  updateFurniture(item.id, {
                    dimensions: { ...item.dimensions, width: e.target.value },
                  })
                }
                className="w-full mt-1 bg-dark-hover border border-dark-border rounded px-2 py-1 text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Глубина (см)</label>
              <input
                type="number"
                value={item.dimensions?.depth || 0}
                onChange={(e) =>
                  updateFurniture(item.id, {
                    dimensions: { ...item.dimensions, depth: e.target.value },
                  })
                }
                className="w-full mt-1 bg-dark-hover border border-dark-border rounded px-2 py-1 text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Высота (см)</label>
              <input
                type="number"
                value={item.dimensions?.height || 0}
                onChange={(e) =>
                  updateFurniture(item.id, {
                    dimensions: { ...item.dimensions, height: e.target.value },
                  })
                }
                className="w-full mt-1 bg-dark-hover border border-dark-border rounded px-2 py-1 text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400">Цвет</label>
              <div className="flex gap-2 mt-2">
                {['#8C1D18', '#333333', '#D4AF37', '#FFFFFF'].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateFurniture(item.id, { color })}
                    className={`w-8 h-8 rounded border-2 ${
                      item.color === color ? 'border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400">Материал</label>
              <select
                value={item.material || 'wood'}
                onChange={(e) => updateFurniture(item.id, { material: e.target.value })}
                className="w-full mt-1 bg-dark-hover border border-dark-border rounded px-2 py-1 text-white text-sm"
              >
                <option value="wood">Дерево</option>
                <option value="fabric">Ткань</option>
                <option value="leather">Кожа</option>
                <option value="metal">Металл</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => removeFurniture(item.id)}
            className="w-full py-2 bg-red-900 hover:bg-red-800 text-white text-sm rounded font-semibold transition"
          >
            Удалить
          </button>
        </motion.div>
      ))}
    </div>
  );
}
