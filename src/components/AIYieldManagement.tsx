import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useRooms, useUpdateRoom } from '@/hooks/useRooms';
import { useBookings } from '@/hooks/useBookings';
import { useWeatherStore } from '@/lib/stores/weatherStore';
import { Sparkles, TrendingUp, CloudSun, Check, Loader2, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const AIYieldManagement = () => {
  const { data: rooms = [] } = useRooms();
  const { data: bookings = [] } = useBookings('admin');
  const updateRoom = useUpdateRoom();
  const { condition } = useWeatherStore();

  const [autopilot, setAutopilot] = useState(true);
  const [weatherFactor, setWeatherFactor] = useState(true);
  const [demandMultiplier, setDemandMultiplier] = useState<number[]>([1.1]); // Default 1.1x base target margin
  const [isSyncing, setIsSyncing] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);

  // Calculate live occupancy rate
  const occupiedCount = bookings.filter((b: any) => b.status === 'CONFIRMED' || b.status === 'PENDING').length;
  const occupancyRate = rooms.length > 0 ? (occupiedCount / rooms.length) * 100 : 0;

  // Calculate simulated rates for comparison
  const getSimulatedPrice = (room: any) => {
    if (!autopilot) return room.price;

    let multiplier = demandMultiplier[0];

    // Add occupancy boost
    if (occupancyRate > 75) multiplier += 0.15; // High demand markup
    else if (occupancyRate > 50) multiplier += 0.08;
    else if (occupancyRate < 25) multiplier -= 0.05; // Discount to fill rooms

    // Weather impact boost (cozy staycation weather: rainy or night)
    if (weatherFactor) {
      if (condition === 'rainy') multiplier += 0.10; // Rain premium
      else if (condition === 'night') multiplier += 0.05; // Late booking premium
    }

    return Math.round(room.price * multiplier);
  };

  // Compile data for chart comparison
  const chartData = rooms.map(room => ({
    name: room.name.split(' ')[0], // Short room name
    'Standard Rate': Math.round(room.originalPrice || room.price * 0.9), // Base standard rate
    'AI Optimized Rate': getSimulatedPrice(room),
  }));

  // Generate dynamic contextual suggestions
  useEffect(() => {
    const newAlerts: string[] = [];
    if (occupancyRate > 50) {
      newAlerts.push(`High occupancy detected (${Math.round(occupancyRate)}%). Recommending +8% - +15% pricing markups across all suites.`);
    } else {
      newAlerts.push(`Occupancy is currently low (${Math.round(occupancyRate)}%). Suggesting 5% promotional discounts on Standard Rooms to drive bookings.`);
    }

    if (condition === 'rainy' && weatherFactor) {
      newAlerts.push('Rainy weather active. Staycation demand is rising; automatic +10% premium applied to Deluxe rooms.');
    }

    const deluxeKing = rooms.find(r => r.id === 'room-deluxe-king');
    if (deluxeKing && autopilot) {
      const suggested = getSimulatedPrice(deluxeKing);
      if (suggested > deluxeKing.price) {
        newAlerts.push(`Deluxe King Room has high conversion rate. Suggesting rate bump from ₹${deluxeKing.price} to ₹${suggested}.`);
      }
    }

    setAlerts(newAlerts.slice(0, 3));
  }, [autopilot, weatherFactor, demandMultiplier, occupancyRate, condition, rooms]);

  const handleSyncRates = async () => {
    setIsSyncing(true);
    try {
      for (const room of rooms) {
        const optimizedPrice = getSimulatedPrice(room);
        if (optimizedPrice !== room.price) {
          await updateRoom.mutateAsync({
            id: room.id,
            data: {
              ...room,
              price: optimizedPrice,
              originalPrice: room.originalPrice || room.price,
            },
          });
        }
      }
    } catch (error) {
      console.error('Failed to sync AI optimized rates:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl justify-between flex-wrap">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-gold flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="bg-gradient-gold bg-clip-text text-transparent font-bold">AI Yield Management</span>
              <p className="text-xs text-muted-foreground font-light mt-0.5">Real-time occupancy & dynamic pricing simulation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              Occupancy: {Math.round(occupancyRate)}%
            </Badge>
            {condition && (
              <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20 capitalize gap-1">
                <CloudSun className="h-3 w-3" />
                {condition} Weather
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Simulation Controls */}
          <div className="space-y-6 lg:border-r lg:border-border/30 lg:pr-6">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Optimization Controls
            </h3>
            
            {/* Autopilot Switch */}
            <div className="flex items-center justify-between p-3 glass rounded-xl border border-border/20">
              <div>
                <p className="text-sm font-semibold">Autopilot Pricing</p>
                <p className="text-xs text-muted-foreground">Auto-optimizes rates using AI logic</p>
              </div>
              <Switch checked={autopilot} onCheckedChange={setAutopilot} />
            </div>

            {/* Weather Influence */}
            <div className="flex items-center justify-between p-3 glass rounded-xl border border-border/20">
              <div>
                <p className="text-sm font-semibold">Weather Intelligence</p>
                <p className="text-xs text-muted-foreground">Adjust markup based on real-time weather</p>
              </div>
              <Switch checked={weatherFactor} onCheckedChange={setWeatherFactor} disabled={!autopilot} />
            </div>

            {/* Demand Margin Target */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Base Margin Target</span>
                <span className="text-primary font-bold">{demandMultiplier[0].toFixed(2)}x</span>
              </div>
              <Slider
                value={demandMultiplier}
                onValueChange={setDemandMultiplier}
                min={0.8}
                max={1.5}
                step={0.05}
                disabled={!autopilot}
                className="py-2"
              />
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Fine-tune target margins. AI will simulate prices around this baseline depending on demand factors.
              </p>
            </div>

            {/* Action Sync */}
            <Button
              onClick={handleSyncRates}
              disabled={isSyncing || rooms.length === 0}
              className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold py-6 rounded-xl shadow-glow gap-2"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Synchronizing Rates...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Sync Optimized Rates
                </>
              )}
            </Button>
          </div>

          {/* Chart Preview */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              Rate Simulation (Base vs. Optimized)
            </h3>
            
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
                  <Bar dataKey="Standard Rate" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="AI Optimized Rate" fill="hsl(45, 95%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Dynamic AI Insights log */}
            {alerts.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/20">
                <p className="text-xs font-semibold text-primary flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" />
                  AI Intelligence Log
                </p>
                <div className="space-y-1">
                  {alerts.map((alert, i) => (
                    <p key={i} className="text-[11px] text-muted-foreground leading-snug">
                      ✦ {alert}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
