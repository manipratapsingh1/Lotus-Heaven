import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'explorer' | 'budgeter' | 'social' | 'adventurer' | 'gourmet' | 'luxury';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
}

export interface TravelMemory {
  id: string;
  tripName: string;
  destination: string;
  dates: string;
  coverImage: string;
  totalSpent: number;
  currency: string;
  placesVisited: string[];
  photos: string[];
  aiSummary: string;
  rating: number;
  createdAt: string;
}

interface AchievementState {
  achievements: Achievement[];
  memories: TravelMemory[];
  stats: {
    totalTrips: number;
    countriesVisited: string[];
    totalSpent: number;
    nightsAway: number;
  };
  addMemory: (memory: Omit<TravelMemory, 'id' | 'createdAt'>) => void;
  deleteMemory: (id: string) => void;
  unlockAchievement: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
  incrementStat: (stat: 'totalTrips' | 'totalSpent' | 'nightsAway', value: number) => void;
  addCountry: (country: string) => void;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-first-trip', title: 'First Adventure', description: 'Complete your first trip', icon: '🎒', category: 'explorer', tier: 'bronze', unlocked: false, progress: 0, target: 1 },
  { id: 'ach-3-trips', title: 'Seasoned Traveler', description: 'Complete 3 trips', icon: '✈️', category: 'explorer', tier: 'silver', unlocked: false, progress: 0, target: 3 },
  { id: 'ach-10-trips', title: 'Globe Trotter', description: 'Complete 10 trips', icon: '🌍', category: 'explorer', tier: 'gold', unlocked: false, progress: 0, target: 10 },
  { id: 'ach-budget-master', title: 'Budget Master', description: 'Complete a trip under budget', icon: '💰', category: 'budgeter', tier: 'bronze', unlocked: false, progress: 0, target: 1 },
  { id: 'ach-saver', title: 'Smart Saver', description: 'Save 20% on 3 trips', icon: '🏦', category: 'budgeter', tier: 'silver', unlocked: false, progress: 0, target: 3 },
  { id: 'ach-explorer', title: 'Explorer', description: 'Visit 3 different countries', icon: '🗺️', category: 'explorer', tier: 'silver', unlocked: false, progress: 0, target: 3 },
  { id: 'ach-world-explorer', title: 'World Explorer', description: 'Visit 10 countries', icon: '🏆', category: 'explorer', tier: 'platinum', unlocked: false, progress: 0, target: 10 },
  { id: 'ach-adventure', title: 'Adventure Seeker', description: 'Try 5 adventure activities', icon: '🧗', category: 'adventurer', tier: 'silver', unlocked: false, progress: 0, target: 5 },
  { id: 'ach-foodie', title: 'Foodie', description: 'Try 10 food experiences', icon: '🍜', category: 'gourmet', tier: 'silver', unlocked: false, progress: 0, target: 10 },
  { id: 'ach-luxury', title: 'Luxury Traveler', description: 'Book a premium suite', icon: '👑', category: 'luxury', tier: 'gold', unlocked: false, progress: 0, target: 1 },
  { id: 'ach-planner', title: 'Master Planner', description: 'Create 5 detailed itineraries', icon: '📋', category: 'social', tier: 'silver', unlocked: false, progress: 0, target: 5 },
  { id: 'ach-memory-keeper', title: 'Memory Keeper', description: 'Save 3 travel memories', icon: '📸', category: 'social', tier: 'bronze', unlocked: false, progress: 0, target: 3 },
];

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set) => ({
      achievements: DEFAULT_ACHIEVEMENTS,
      memories: [],
      stats: {
        totalTrips: 0,
        countriesVisited: [],
        totalSpent: 0,
        nightsAway: 0,
      },
      addMemory: (memory) =>
        set((state) => ({
          memories: [
            ...state.memories,
            { ...memory, id: `mem-${Date.now()}`, createdAt: new Date().toISOString() },
          ],
        })),
      deleteMemory: (id) =>
        set((state) => ({ memories: state.memories.filter((m) => m.id !== id) })),
      unlockAchievement: (id) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
          ),
        })),
      updateProgress: (id, progress) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id ? { ...a, progress: Math.min(progress, a.target), unlocked: progress >= a.target ? true : a.unlocked, unlockedAt: progress >= a.target ? new Date().toISOString() : a.unlockedAt } : a
          ),
        })),
      incrementStat: (stat, value) =>
        set((state) => ({
          stats: { ...state.stats, [stat]: (state.stats[stat] as number) + value },
        })),
      addCountry: (country) =>
        set((state) => ({
          stats: {
            ...state.stats,
            countriesVisited: state.stats.countriesVisited.includes(country)
              ? state.stats.countriesVisited
              : [...state.stats.countriesVisited, country],
          },
        })),
    }),
    { name: 'lotus-achievements' }
  )
);

export const TIER_COLORS: Record<string, string> = {
  bronze: 'from-amber-700 to-amber-500',
  silver: 'from-slate-400 to-slate-300',
  gold: 'from-yellow-500 to-amber-400',
  platinum: 'from-violet-500 to-purple-400',
};
