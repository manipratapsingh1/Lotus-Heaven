import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { bookingsApi } from '@/lib/api-client';

interface RealBooking {
  guestName: string;
  room: string;
  time: string;
}

export const SocialProofNotification = () => {
  const [currentBooking, setCurrentBooking] = useState<RealBooking | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [bookings, setBookings] = useState<RealBooking[]>([]);

  // Fetch real recent bookings once on mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingsApi.getAll();
        const list = Array.isArray(data) ? data : (data.data ?? []);
        if (list.length > 0) {
          const recent = list.slice(0, 5).map((b: any) => ({
            guestName: b.guestName || 'A Guest',
            room: b.room?.name || 'a Suite',
            time: getTimeAgo(b.createdAt),
          }));
          setBookings(recent);
        }
      } catch {
        // No bookings or not authenticated — don't show fake notifications
      }
    };
    fetchBookings();
  }, []);

  // Only show notifications if we have real bookings
  useEffect(() => {
    if (bookings.length === 0) return;

    let currentIndex = 0;

    const showNotification = () => {
      setCurrentBooking(bookings[currentIndex % bookings.length]);
      setIsVisible(true);
      currentIndex++;

      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    const initialTimeout = setTimeout(showNotification, 15000);
    const interval = setInterval(showNotification, 45000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [bookings]);

  if (bookings.length === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && currentBooking && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-6 left-6 z-50 max-w-xs"
        >
          <div className="glass-card rounded-2xl p-4 shadow-glow border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0 shadow-glow">
                <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">
                  {currentBooking.guestName} booked
                </p>
                <p className="text-primary font-medium text-sm truncate">
                  {currentBooking.room}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {currentBooking.time}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-gold"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} minutes ago`;
  if (diffHrs < 24) return `${diffHrs} hours ago`;
  return `${diffDays} days ago`;
}
