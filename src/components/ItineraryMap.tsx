import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TripActivity } from '@/lib/stores/tripStore';
import { MapPin, Compass, Navigation, DollarSign, Clock, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ItineraryMapProps {
  activities: TripActivity[];
  currency: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  sightseeing: '🏛️',
  food: '🍽️',
  transport: '🚗',
  hotel: '🏨',
  adventure: '🧗',
  rest: '😴',
  shopping: '🛍️',
};

export const ItineraryMap = ({ activities, currency }: ItineraryMapProps) => {
  const [hoveredActivityId, setHoveredActivityId] = useState<string | null>(null);
  const [activePinId, setActivePinId] = useState<string | null>(null);

  // Sort activities chronologically to ensure route flow is correct
  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => a.time.localeCompare(b.time));
  }, [activities]);

  // Compute stable coordinates along a smooth path
  const pins = useMemo(() => {
    const total = sortedActivities.length;
    return sortedActivities.map((act, index) => {
      if (total === 1) {
        return { ...act, x: 250, y: 250, index };
      }

      // Generate a stable hash from id & title
      let hash = 0;
      const str = act.id + act.title;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }

      // Space X evenly from left (50) to right (450)
      const step = 380 / (total - 1 || 1);
      const baseX = 60 + index * step;

      // Create a wave shape for Y coordinates
      const angle = (index / (total - 1 || 1)) * Math.PI * 1.3;
      const baseY = 250 + Math.sin(angle) * 110;

      // Deviate deterministically by +/- 25px
      const devX = (hash % 24) - 12;
      const devY = ((hash >> 2) % 24) - 12;

      const x = Math.max(50, Math.min(450, baseX + devX));
      const y = Math.max(50, Math.min(450, baseY + devY));

      return {
        ...act,
        x,
        y,
        index,
      };
    });
  }, [sortedActivities]);

  // Construct SVG route path string (smooth Bezier curve if more than 2 points, otherwise line)
  const pathD = useMemo(() => {
    if (pins.length < 2) return '';
    return pins.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }, [pins]);

  const activeActivity = useMemo(() => {
    return pins.find((p) => p.id === (hoveredActivityId || activePinId));
  }, [pins, hoveredActivityId, activePinId]);

  if (activities.length === 0) {
    return (
      <Card className="glass-card border border-primary/20 h-[450px] flex items-center justify-center text-center p-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.03),transparent_70%)]" />
        <div className="relative z-10 space-y-4">
          <div className="h-16 w-16 mx-auto rounded-full bg-gradient-gold/10 flex items-center justify-center border border-primary/20">
            <Compass className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <h4 className="text-lg font-bold luxury-text">Interactive Itinerary Map</h4>
          <p className="text-sm text-muted-foreground max-w-[280px]">
            No activities scheduled for this day yet. Add activities to plot your premium travel route.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card border border-primary/20 p-4 h-[450px] relative overflow-hidden flex flex-col justify-between">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05),transparent_75%)] pointer-events-none" />

      {/* Map Header Overlay */}
      <div className="flex items-center justify-between z-10 relative pointer-events-none">
        <div>
          <h4 className="text-sm font-semibold luxury-text tracking-wider uppercase flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-primary animate-spin-slow" /> Itinerary Route Map
          </h4>
          <p className="text-xs text-muted-foreground">{activities.length} Waypoints plotted</p>
        </div>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 uppercase text-[10px] tracking-widest font-mono">
          Interactive SVG v1.0
        </Badge>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative flex-1 w-full min-h-[300px] mt-2 select-none">
        <svg viewBox="0 0 500 500" className="w-full h-full">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5E6CA" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#AA7C11" />
            </linearGradient>
            
            <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </radialGradient>

            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(212, 175, 55, 0.04)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="url(#grid)" rx="8" />

          {/* Topographical Curves / Contours */}
          <path d="M 60,180 Q 180,60 350,120 T 480,280" fill="none" stroke="rgba(212, 175, 55, 0.04)" strokeWidth="1.5" />
          <path d="M -20,380 Q 120,280 280,420 T 520,380" fill="none" stroke="rgba(212, 175, 55, 0.04)" strokeWidth="1.5" />
          <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(212, 175, 55, 0.02)" strokeWidth="1" />
          <circle cx="80" cy="80" r="110" fill="none" stroke="rgba(212, 175, 55, 0.015)" strokeWidth="1" />
          <circle cx="420" cy="420" r="80" fill="none" stroke="rgba(212, 175, 55, 0.02)" strokeWidth="1" />

          {/* Latitude & Longitude Labels (Decorative) */}
          <text x="10" y="490" fill="rgba(212, 175, 55, 0.15)" fontSize="9" fontFamily="monospace">LAT 13.0827° N</text>
          <text x="400" y="20" fill="rgba(212, 175, 55, 0.15)" fontSize="9" fontFamily="monospace" textAnchor="end">LNG 80.2707° E</text>

          {/* Compass Rose Drawing */}
          <g transform="translate(450, 80) scale(0.6)">
            <circle cx="0" cy="0" r="24" fill="none" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="1" />
            <line x1="0" y1="-30" x2="0" y2="30" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="1" />
            <line x1="-30" y1="0" x2="30" y2="0" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="1" />
            <polygon points="0,-35 4,-10 0,0 -4,-10" fill="url(#goldGrad)" />
            <polygon points="0,35 4,10 0,0 -4,10" fill="rgba(212, 175, 55, 0.5)" />
            <polygon points="35,0 10,-4 0,0 10,4" fill="url(#goldGrad)" />
            <polygon points="-35,0 -10,-4 0,0 -10,4" fill="rgba(212, 175, 55, 0.5)" />
            <text x="0" y="-39" fill="rgba(212, 175, 55, 0.7)" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">N</text>
          </g>

          {/* Connecting Routes with animations */}
          {pins.length >= 2 && (
            <>
              {/* Shadow line underneath for contrast */}
              <path
                d={pathD}
                fill="none"
                stroke="black"
                strokeOpacity="0.4"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Golden dashed marching line */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="url(#goldGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="10, 8"
                animate={{ strokeDashoffset: [0, -100] }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              />
            </>
          )}

          {/* Render Route Waypoint Pins */}
          {pins.map((pin) => {
            const isHovered = hoveredActivityId === pin.id;
            const isActive = activePinId === pin.id;
            const isHighlighted = isHovered || isActive;

            return (
              <g
                key={pin.id}
                onMouseEnter={() => setHoveredActivityId(pin.id)}
                onMouseLeave={() => setHoveredActivityId(null)}
                onClick={() => setActivePinId(activePinId === pin.id ? null : pin.id)}
                className="cursor-pointer pointer-events-auto"
              >
                {/* Outer Glow */}
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r={isHighlighted ? 24 : 14}
                  fill="url(#glowGrad)"
                  opacity={isHighlighted ? 0.8 : 0.4}
                />

                {/* Animated pulsing ring */}
                {isHighlighted && (
                  <motion.circle
                    cx={pin.x}
                    cy={pin.y}
                    r={20}
                    stroke="url(#goldGrad)"
                    strokeWidth="1"
                    fill="none"
                    animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.8, 0, 0.8] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  />
                )}

                {/* Pin Circle */}
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r={10}
                  fill={isHighlighted ? 'url(#goldGrad)' : 'rgba(30, 30, 30, 0.9)'}
                  stroke={isHighlighted ? '#ffffff' : 'url(#goldGrad)'}
                  strokeWidth="1.5"
                />

                {/* Sequence Number */}
                <text
                  x={pin.x}
                  y={pin.y + 3}
                  textAnchor="middle"
                  fill={isHighlighted ? 'rgba(0,0,0,0.85)' : '#D4AF37'}
                  fontSize="9.5"
                  fontWeight="bold"
                >
                  {pin.index + 1}
                </text>

                {/* Hover Tooltip Position Anchor */}
              </g>
            );
          })}
        </svg>

        {/* Floating HTML Card Tooltip using absolute position relative to SVG */}
        <AnimatePresence>
          {activeActivity && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                // Find pin and locate tooltip centered above/below it
                left: `${((activeActivity as any).x / 500) * 100}%`,
                top: `${((activeActivity as any).y / 500) * 100 - 15}%`,
                transform: 'translate(-50%, -100%)',
              }}
              className="z-50 min-w-[200px] max-w-[240px] pointer-events-none"
            >
              <div className="glass-card border border-primary/40 p-3 shadow-glow rounded-xl bg-background/95 backdrop-blur-md space-y-2 text-xs relative">
                {/* Tiny arrow */}
                <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b border-primary/40 bg-background/95 backdrop-blur-md" />

                <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
                  <span className="font-semibold text-foreground truncate mr-2">
                    {CATEGORY_ICONS[activeActivity.category] || '📍'} {activeActivity.title}
                  </span>
                  <Badge className="bg-gradient-gold text-[9px] px-1 py-0 text-primary-foreground font-bold font-mono">
                    #{ (activeActivity as any).index + 1 }
                  </Badge>
                </div>

                <div className="space-y-1 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-primary" />
                    <span>{activeActivity.time}</span>
                  </div>
                  {activeActivity.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                      <span className="truncate">{activeActivity.location}</span>
                    </div>
                  )}
                  {activeActivity.cost > 0 && (
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-3 w-3 text-primary" />
                      <span className="font-semibold text-foreground">
                        {currency}{activeActivity.cost}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Bottom Scale bar */}
      <div className="flex items-end justify-between text-[9px] text-muted-foreground/60 font-mono mt-1 relative z-10 select-none pointer-events-none">
        <div className="flex flex-col gap-0.5">
          <div className="w-16 h-1 bg-gradient-to-r from-primary/60 to-transparent border-l border-r border-primary/60" />
          <span>Scale: ~0.5 km</span>
        </div>
        <span>Click pin to keep info card open</span>
      </div>
    </Card>
  );
};
