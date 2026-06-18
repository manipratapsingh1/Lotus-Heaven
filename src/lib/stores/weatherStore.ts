import { create } from 'zustand';

export type WeatherCondition = 'sunny' | 'rainy' | 'cloudy' | 'night';

interface WeatherState {
  condition: WeatherCondition;
  temperature: number;
  location: string;
  theme: 'sunny' | 'rainy' | 'night';
  setCondition: (condition: WeatherCondition) => void;
  setTemperature: (temperature: number) => void;
  setTheme: (theme: 'sunny' | 'rainy' | 'night') => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  condition: 'sunny',
  temperature: 24,
  location: 'Lotus Heaven Hotel',
  theme: 'sunny',
  setCondition: (condition) => set({ condition }),
  setTemperature: (temperature) => set({ temperature }),
  setTheme: (theme) => set({ theme }),
}));
