import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Trash2, CalendarDays, DollarSign, Star, MapPin, Sparkles } from 'lucide-react';
import { bookingsApi } from '@/lib/api-client';

interface Notification {
  id: string;
  type: 'booking' | 'review' | 'trip' | 'system' | 'achievement';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  icon: string;
}

const ICON_MAP: Record<string, typeof Bell> = {
  booking: CalendarDays,
  review: Star,
  trip: MapPin,
  system: Bell,
  achievement: Sparkles,
};

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Generate real notifications from booking data
  const loadNotifications = useCallback(async () => {
    try {
      const data = await bookingsApi.getAll();
      const bookings = Array.isArray(data) ? data : data?.data || [];
      const notifs: Notification[] = [];

      bookings.forEach((b: any) => {
        if (b.status === 'CONFIRMED') {
          notifs.push({
            id: `notif-confirm-${b.id}`,
            type: 'booking',
            title: 'Booking Confirmed',
            message: `Your booking for ${b.room?.name || 'a room'} has been confirmed.`,
            createdAt: b.updatedAt || b.createdAt,
            read: false,
            icon: 'booking',
          });
        }
        // Check-in reminder: if check-in is within 3 days
        if (b.checkIn) {
          const checkIn = new Date(b.checkIn);
          const now = new Date();
          const daysUntil = Math.ceil((checkIn.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (daysUntil > 0 && daysUntil <= 3) {
            notifs.push({
              id: `notif-checkin-${b.id}`,
              type: 'booking',
              title: 'Check-in Reminder',
              message: `Your stay at ${b.room?.name || 'the hotel'} starts in ${daysUntil} day${daysUntil > 1 ? 's' : ''}.`,
              createdAt: new Date().toISOString(),
              read: false,
              icon: 'booking',
            });
          }
        }
      });

      // Only show if there are real events, limit to most recent 10
      setNotifications(notifs.slice(0, 10));
    } catch {
      // Not logged in or no bookings — show no notifications (correct behavior)
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-primary/10 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-12 w-80 z-50"
          >
            <Card className="glass-card border-primary/20 shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    Notifications
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="text-xs">{unreadCount} new</Badge>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                        title="Mark all read"
                      >
                        <Check className="h-4 w-4 text-primary" />
                      </button>
                    )}
                    <button onClick={() => setIsOpen(false)}>
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="max-h-72 overflow-y-auto space-y-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No notifications yet</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Book a room to get started</p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const IconComp = ICON_MAP[n.icon] || Bell;
                    return (
                      <motion.div
                        key={n.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`flex items-start gap-3 p-3 rounded-xl transition-colors group ${
                          n.read ? 'opacity-60' : 'bg-primary/5'
                        }`}
                      >
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <IconComp className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{n.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => removeNotif(n.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </button>
                      </motion.div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
