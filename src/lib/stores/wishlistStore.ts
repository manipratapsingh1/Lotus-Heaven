import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  favorites: string[];
  priceAlerts: string[];
  addFavorite: (roomId: string) => void;
  removeFavorite: (roomId: string) => void;
  isFavorite: (roomId: string) => boolean;
  toggleFavorite: (roomId: string) => void;
  togglePriceAlert: (roomId: string) => void;
  hasPriceAlert: (roomId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      favorites: [],
      priceAlerts: [],
      addFavorite: (roomId) =>
        set((state) => ({
          favorites: [...state.favorites, roomId],
        })),
      removeFavorite: (roomId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== roomId),
          priceAlerts: state.priceAlerts.filter((id) => id !== roomId),
        })),
      isFavorite: (roomId) => get().favorites.includes(roomId),
      toggleFavorite: (roomId) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(roomId)) {
          removeFavorite(roomId);
        } else {
          addFavorite(roomId);
        }
      },
      togglePriceAlert: (roomId) =>
        set((state) => ({
          priceAlerts: state.priceAlerts.includes(roomId)
            ? state.priceAlerts.filter((id) => id !== roomId)
            : [...state.priceAlerts, roomId],
        })),
      hasPriceAlert: (roomId) => get().priceAlerts.includes(roomId),
    }),
    {
      name: 'lotus-wishlist',
    }
  )
);
