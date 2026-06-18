import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Thermometer, Eye, Droplets, AlertTriangle, Shirt, Umbrella, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { destinations } from '@/lib/destinationData';

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  visibility: string;
  icon: typeof Sun;
  forecast: { day: string; temp: number; icon: typeof Sun }[];
  packingSuggestions: string[];
  activities: string[];
  alerts: { level: 'low' | 'medium' | 'high'; message: string }[];
}

function getWeatherForDestination(destName: string): WeatherData {
  const dest = destinations.find(d => d.name.toLowerCase() === destName.toLowerCase());
  const month = new Date().getMonth() + 1;
  const season = month >= 3 && month <= 5 ? 'spring' : month >= 6 && month <= 8 ? 'summer' : month >= 9 && month <= 11 ? 'autumn' : 'winter';
  
  const weatherStr = dest?.weather?.[season] || '25°C, Pleasant';
  const temp = parseInt(weatherStr) || 25;
  const condition = weatherStr.split(',')[1]?.trim() || 'Pleasant';
  
  const icon = condition.toLowerCase().includes('rain') ? CloudRain : condition.toLowerCase().includes('snow') ? Snowflake : condition.toLowerCase().includes('cold') ? Wind : temp > 30 ? Sun : Cloud;
  
  const baseForecast = [
    { day: 'Mon', temp: temp - 1, icon },
    { day: 'Tue', temp: temp + 1, icon: Sun },
    { day: 'Wed', temp: temp, icon },
    { day: 'Thu', temp: temp + 2, icon: Sun },
    { day: 'Fri', temp: temp - 2, icon: Cloud },
  ];
  
  const packingSuggestions = temp < 10
    ? ['Heavy jacket', 'Thermal wear', 'Warm boots', 'Gloves & hat', 'Hand warmers']
    : temp < 20
    ? ['Light jacket', 'Layers', 'Comfortable shoes', 'Scarf', 'Umbrella']
    : temp < 30
    ? ['Light clothing', 'Sunglasses', 'Sunscreen', 'Hat', 'Comfortable sandals']
    : ['Breathable fabrics', 'High SPF sunscreen', 'Water bottle', 'UV hat', 'Light shoes'];

  const activities = temp < 10
    ? ['Indoor museums', 'Hot springs', 'Skiing', 'Cozy café hopping', 'Theater shows']
    : temp < 20
    ? ['Walking tours', 'Hiking', 'Photography', 'Wine tasting', 'Cycling']
    : temp < 30
    ? ['Beach day', 'Sightseeing', 'Water sports', 'Markets', 'Outdoor dining']
    : ['Swimming', 'Early morning temples', 'Indoor attractions', 'Sunset cruises', 'Night markets'];

  const alerts: WeatherData['alerts'] = [];
  if (condition.toLowerCase().includes('rain')) alerts.push({ level: 'medium', message: 'Rain expected — carry waterproof gear' });
  if (temp > 38) alerts.push({ level: 'high', message: 'Extreme heat — stay hydrated and avoid midday sun' });
  if (condition.toLowerCase().includes('snow')) alerts.push({ level: 'medium', message: 'Snow conditions — check road closures' });
  if (dest?.bestMonths && !dest.bestMonths.includes(month)) alerts.push({ level: 'low', message: 'Not the ideal season — consider visiting during peak months for better weather' });

  return { temp, condition, humidity: 40 + Math.round(Math.random() * 40), wind: 5 + Math.round(Math.random() * 20), visibility: 'Good', icon, forecast: baseForecast, packingSuggestions, activities, alerts };
}

export const WeatherIntelligence = ({ destination }: { destination?: string }) => {
  const [selectedDest, setSelectedDest] = useState(destination || 'Bali');
  const weather = getWeatherForDestination(selectedDest);
  const WeatherIcon = weather.icon;

  return (
    <Card className="glass-card border-border/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-primary" />
          Weather Intelligence
        </CardTitle>
        <select className="w-48 mt-2 px-3 py-1.5 border border-input rounded-lg bg-background text-sm" value={selectedDest} onChange={(e) => setSelectedDest(e.target.value)}>
          {destinations.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
        </select>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Weather */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}
              className="h-16 w-16 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-glow">
              <WeatherIcon className="h-8 w-8 text-primary-foreground" />
            </motion.div>
            <div>
              <p className="text-4xl font-bold text-foreground">{weather.temp}°C</p>
              <p className="text-sm text-muted-foreground">{weather.condition}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><Droplets className="h-4 w-4 text-blue-400 mx-auto mb-1" /><p className="text-xs text-muted-foreground">Humidity</p><p className="text-sm font-bold">{weather.humidity}%</p></div>
            <div><Wind className="h-4 w-4 text-cyan-400 mx-auto mb-1" /><p className="text-xs text-muted-foreground">Wind</p><p className="text-sm font-bold">{weather.wind}km/h</p></div>
            <div><Eye className="h-4 w-4 text-green-400 mx-auto mb-1" /><p className="text-xs text-muted-foreground">Visibility</p><p className="text-sm font-bold">{weather.visibility}</p></div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">5-Day Forecast</h4>
          <div className="grid grid-cols-5 gap-2">
            {weather.forecast.map((day) => (
              <div key={day.day} className="text-center p-2 glass rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">{day.day}</p>
                <day.icon className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-sm font-bold">{day.temp}°</p>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {weather.alerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-amber-400" />Travel Alerts</h4>
            {weather.alerts.map((alert, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl text-sm ${alert.level === 'high' ? 'bg-destructive/10 border border-destructive/30' : alert.level === 'medium' ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-blue-500/10 border border-blue-500/30'}`}>
                <AlertTriangle className={`h-4 w-4 flex-shrink-0 ${alert.level === 'high' ? 'text-destructive' : alert.level === 'medium' ? 'text-amber-400' : 'text-blue-400'}`} />
                <span className="text-foreground/80">{alert.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Packing Suggestions */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Shirt className="h-4 w-4 text-primary" />Packing Suggestions</h4>
          <div className="flex flex-wrap gap-2">{weather.packingSuggestions.map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}</div>
        </div>

        {/* Activity Recommendations */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Sun className="h-4 w-4 text-primary" />Recommended Activities</h4>
          <div className="flex flex-wrap gap-2">{weather.activities.map((a) => <Badge key={a} variant="outline" className="text-xs border-primary/30 text-primary">{a}</Badge>)}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherIntelligence;
