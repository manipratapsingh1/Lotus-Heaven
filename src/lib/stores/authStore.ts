import { create } from 'zustand';
import { authApi } from '../api-client';

interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: string;
  verified: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

let checkAuthPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    checkAuthPromise = null;
    const result = await authApi.login({ email, password });
    set({
      user: result.user,
      isAuthenticated: true,
    });
  },

  register: async (email: string, password: string, fullName?: string) => {
    checkAuthPromise = null;
    const result = await authApi.register({ email, password, fullName });
    set({
      user: result.user,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    checkAuthPromise = null;
    try {
      await authApi.logout();
    } catch {
      // Clear state even if API call fails
    }
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    if (checkAuthPromise) return checkAuthPromise;

    checkAuthPromise = (async () => {
      try {
        const user = await authApi.getProfile();
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    })();

    return checkAuthPromise;
  },

  updateUser: (data: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },
}));
