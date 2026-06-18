import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  coverImage: string;
  collaborators: { name: string; avatar: string }[];
  status: 'planning' | 'active' | 'completed';
  activities: TripActivity[];
  createdAt: string;
}

export interface TripActivity {
  id: string;
  day: number;
  time: string;
  title: string;
  category: 'sightseeing' | 'food' | 'transport' | 'hotel' | 'adventure' | 'rest' | 'shopping';
  location: string;
  cost: number;
  notes: string;
  votes: { up: number; down: number };
  completed: boolean;
}

interface TripState {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'createdAt' | 'activities'>) => void;
  updateTrip: (id: string, data: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  addActivity: (tripId: string, activity: Omit<TripActivity, 'id' | 'votes' | 'completed'>) => void;
  updateActivity: (tripId: string, activityId: string, data: Partial<TripActivity>) => void;
  deleteActivity: (tripId: string, activityId: string) => void;
  voteActivity: (tripId: string, activityId: string, direction: 'up' | 'down') => void;
  toggleActivityComplete: (tripId: string, activityId: string) => void;
}

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      trips: [],
      addTrip: (trip) =>
        set((state) => ({
          trips: [
            ...state.trips,
            { ...trip, id: `trip-${Date.now()}`, createdAt: new Date().toISOString(), activities: [] },
          ],
        })),
      updateTrip: (id, data) =>
        set((state) => ({
          trips: state.trips.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),
      deleteTrip: (id) =>
        set((state) => ({ trips: state.trips.filter((t) => t.id !== id) })),
      addActivity: (tripId, activity) =>
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id === tripId
              ? { ...t, activities: [...t.activities, { ...activity, id: `act-${Date.now()}`, votes: { up: 0, down: 0 }, completed: false }] }
              : t
          ),
        })),
      updateActivity: (tripId, activityId, data) =>
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id === tripId
              ? { ...t, activities: t.activities.map((a) => (a.id === activityId ? { ...a, ...data } : a)) }
              : t
          ),
        })),
      deleteActivity: (tripId, activityId) =>
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id === tripId
              ? { ...t, activities: t.activities.filter((a) => a.id !== activityId) }
              : t
          ),
        })),
      voteActivity: (tripId, activityId, direction) =>
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id === tripId
              ? {
                  ...t,
                  activities: t.activities.map((a) =>
                    a.id === activityId
                      ? { ...a, votes: { ...a.votes, [direction]: a.votes[direction] + 1 } }
                      : a
                  ),
                }
              : t
          ),
        })),
      toggleActivityComplete: (tripId, activityId) =>
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id === tripId
              ? { ...t, activities: t.activities.map((a) => (a.id === activityId ? { ...a, completed: !a.completed } : a)) }
              : t
          ),
        })),
    }),
    { name: 'lotus-trips' }
  )
);
