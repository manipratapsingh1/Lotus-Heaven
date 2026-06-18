import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, Clock } from 'lucide-react';

interface LiveAvailabilityProps {
  roomId: string;
}

export const LiveAvailability = ({ roomId }: LiveAvailabilityProps) => {
  const [viewCount, setViewCount] = useState(Math.floor(Math.random() * 20) + 10);
  const [recentBookings, setRecentBookings] = useState(Math.floor(Math.random() * 5) + 1);
  const [availableRooms, setAvailableRooms] = useState(Math.floor(Math.random() * 8) + 2);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live updates
      setViewCount(prev => Math.max(5, prev + Math.floor(Math.random() * 3) - 1));
      if (Math.random() > 0.7) {
        setRecentBookings(prev => prev + 1);
        setAvailableRooms(prev => Math.max(1, prev - 1));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="glass border-accent/20">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Live Activity</span>
            </div>
            <Badge variant="secondary" className="animate-pulse">
              <div className="h-2 w-2 bg-accent rounded-full mr-2" />
              Live
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <motion.div 
              key={viewCount}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-accent">
                <TrendingUp className="h-5 w-5" />
                {viewCount}
              </div>
              <p className="text-xs text-muted-foreground">Viewing Now</p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={recentBookings}
                initial={{ scale: 1.1, color: '#10b981' }}
                animate={{ scale: 1, color: 'inherit' }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                  <CheckCircle className="h-5 w-5" />
                  {recentBookings}
                </div>
                <p className="text-xs text-muted-foreground">Booked Today</p>
              </motion.div>
            </AnimatePresence>

            <motion.div
              key={availableRooms}
              animate={{
                color: availableRooms <= 3 ? '#ef4444' : 'inherit'
              }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                <Clock className="h-5 w-5" />
                {availableRooms}
              </div>
              <p className="text-xs text-muted-foreground">Rooms Left</p>
            </motion.div>
          </div>

          {availableRooms <= 3 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/10 border border-destructive/20 rounded-lg p-2 text-center"
            >
              <p className="text-xs text-destructive font-medium">
                ⚡ High demand! Only {availableRooms} rooms remaining
              </p>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
