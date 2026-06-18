import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2 } from 'lucide-react';

interface BookingNotification {
  id: string;
  guestName: string;
  roomName: string;
  createdAt: string;
}

export const LiveBookingNotifications = () => {
  const [notifications] = useState<BookingNotification[]>([]);

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3">
      <AnimatePresence>
        {notifications.map(n => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100 }}
            className="glass-card rounded-xl p-4 shadow-xl max-w-sm border border-primary/20"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">New Booking!</p>
                <p className="text-xs text-muted-foreground">
                  {n.guestName} booked {n.roomName}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
