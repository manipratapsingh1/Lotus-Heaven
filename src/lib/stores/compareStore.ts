import { create } from 'zustand';
import { Room } from '@/lib/types';

interface CompareState {
  compareList: Room[];
  addToCompare: (room: Room) => void;
  removeFromCompare: (roomId: string) => void;
  isInCompare: (roomId: string) => boolean;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareState>()((set, get) => ({
  compareList: [],
  addToCompare: (room) =>
    set((state) => {
      if (state.compareList.length >= 3) return state;
      if (state.compareList.find((r) => r.id === room.id)) return state;
      return { compareList: [...state.compareList, room] };
    }),
  removeFromCompare: (roomId) =>
    set((state) => ({
      compareList: state.compareList.filter((r) => r.id !== roomId),
    })),
  isInCompare: (roomId) => get().compareList.some((r) => r.id === roomId),
  clearCompare: () => set({ compareList: [] }),
}));
