import { create } from 'zustand';

interface InteriorStore {
  currentInterior: any;
  setCurrentInterior: (interior: any) => void;
  furniture: any[];
  addFurniture: (item: any) => void;
  removeFurniture: (id: string) => void;
  updateFurniture: (id: string, updates: any) => void;
}

export const useInteriorStore = create<InteriorStore>((set) => ({
  currentInterior: null,
  setCurrentInterior: (interior) => set({ currentInterior: interior }),

  furniture: [],
  addFurniture: (item) =>
    set((state) => ({
      furniture: [...state.furniture, { ...item, id: Date.now().toString() }],
    })),

  removeFurniture: (id) =>
    set((state) => ({
      furniture: state.furniture.filter((f) => f.id !== id),
    })),

  updateFurniture: (id, updates) =>
    set((state) => ({
      furniture: state.furniture.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),
}));

interface ChatStore {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  clear: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (role, content) =>
    set((state) => ({
      messages: [...state.messages, { role, content }],
    })),
  clear: () => set({ messages: [] }),
}));
