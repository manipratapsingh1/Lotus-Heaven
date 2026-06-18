import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Expense {
  id: string;
  tripId: string;
  category: 'hotel' | 'food' | 'transport' | 'activity' | 'shopping' | 'other';
  title: string;
  amount: number;
  currency: string;
  date: string;
  notes: string;
  paidBy: string;
  splitWith: string[];
}

interface ExpenseState {
  expenses: Expense[];
  budgets: Record<string, number>; // tripId -> budget
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, data: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  setBudget: (tripId: string, amount: number) => void;
  getExpensesByTrip: (tripId: string) => Expense[];
  getTotalByTrip: (tripId: string) => number;
  getCategoryBreakdown: (tripId: string) => Record<string, number>;
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: [],
      budgets: {},
      addExpense: (expense) =>
        set((state) => ({
          expenses: [...state.expenses, { ...expense, id: `exp-${Date.now()}` }],
        })),
      updateExpense: (id, data) =>
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),
      deleteExpense: (id) =>
        set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),
      setBudget: (tripId, amount) =>
        set((state) => ({ budgets: { ...state.budgets, [tripId]: amount } })),
      getExpensesByTrip: (tripId) => get().expenses.filter((e) => e.tripId === tripId),
      getTotalByTrip: (tripId) =>
        get().expenses.filter((e) => e.tripId === tripId).reduce((sum, e) => sum + e.amount, 0),
      getCategoryBreakdown: (tripId) => {
        const filtered = get().expenses.filter((e) => e.tripId === tripId);
        return filtered.reduce((acc, e) => {
          acc[e.category] = (acc[e.category] || 0) + e.amount;
          return acc;
        }, {} as Record<string, number>);
      },
    }),
    { name: 'lotus-expenses' }
  )
);

// Helpers
export const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  hotel: { label: 'Hotel', color: '#8B5CF6', icon: '🏨' },
  food: { label: 'Food & Drinks', color: '#F59E0B', icon: '🍽️' },
  transport: { label: 'Transport', color: '#3B82F6', icon: '🚗' },
  activity: { label: 'Activities', color: '#10B981', icon: '🎯' },
  shopping: { label: 'Shopping', color: '#EC4899', icon: '🛍️' },
  other: { label: 'Other', color: '#6B7280', icon: '📦' },
};
