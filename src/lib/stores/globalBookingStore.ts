import { create } from 'zustand';
import { Room } from '@/lib/types';

interface GlobalBookingState {
  activeRoom: Room | null;
  isBookingOpen: boolean;
  openBooking: (room: Room) => void;
  closeBooking: () => void;
}

export const useGlobalBookingStore = create<GlobalBookingState>((set) => ({
  activeRoom: null,
  isBookingOpen: false,
  openBooking: (room) => set({ activeRoom: room, isBookingOpen: true }),
  closeBooking: () => set({ activeRoom: null, isBookingOpen: false }),
}));
