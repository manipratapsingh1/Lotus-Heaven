import { useEffect } from 'react';
import { Cloud, CloudRain, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWeatherStore, WeatherCondition } from '@/lib/stores/weatherStore';
import { Card } from '@/components/ui/card';

/**
 * Uses the FREE Open-Meteo API (no API key required, no cost).
 * Docs: https://open-meteo.com/en/docs
 * Falls back to time-of-day simulation if the API is unreachable.
 */
async function fetchRealWeather(): Promise<{ temp: number; condition: WeatherCondition } | null> {
  try {
    // Get user's rough location from browser (permission-free fallback to IP)
    const geoRes = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
    const geo = await geoRes.json();
    const lat = geo.latitude || 28.6139; // Default: New Delhi
    const lon = geo.longitude || 77.2090;

    // Open-Meteo: completely free, no API key needed
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const data = await res.json();

    const temp = Math.round(data.current?.temperature_2m ?? 25);
    const code = data.current?.weather_code ?? 0;

    // WMO weather codes → our conditions
    let condition: WeatherCondition = 'sunny';
    if (code >= 51) condition = 'rainy';       // Drizzle, rain, thunderstorm
    else if (code >= 2) condition = 'cloudy';   // Partly cloudy / Overcast
    // Night check
    const hour = new Date().getHours();
    if (hour < 6 || hour >= 21) condition = 'night';

    return { temp, condition };
  } catch {
    return null; // Fallback to local simulation
  }
}

function getLocalWeather(): { temp: number; condition: WeatherCondition } {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return { temp: 24, condition: 'sunny' };
  if (hour >= 12 && hour < 18) return { temp: 28, condition: 'cloudy' };
  if (hour >= 18 && hour < 22) return { temp: 22, condition: 'rainy' };
  return { temp: 18, condition: 'night' };
}

export const WeatherWidget = () => {
  const { condition, temperature, setCondition, setTheme, setTemperature } = useWeatherStore();

  useEffect(() => {
    const load = async () => {
      const real = await fetchRealWeather();
      const { temp, condition: cond } = real || getLocalWeather();

      try {
        setCondition(cond);
        setTemperature(temp);
        setTheme(cond === 'rainy' ? 'rainy' : cond === 'night' ? 'night' : 'sunny');
      } catch {
        // Store not ready yet
      }
    };
    load();
  }, [setCondition, setTheme, setTemperature]);

  const getIcon = (cond: WeatherCondition) => {
    switch (cond) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-400" />;
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-400" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-400" />;
      case 'night':
        return <Moon className="h-8 w-8 text-indigo-300" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="glass p-4 flex items-center gap-3">
        <motion.div
          animate={{ rotate: condition === 'sunny' ? 360 : 0 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {getIcon(condition)}
        </motion.div>
        <div>
          <p className="text-2xl font-bold">{temperature}°C</p>
          <p className="text-xs text-muted-foreground capitalize">{condition}</p>
        </div>
      </Card>
    </motion.div>
  );
};
