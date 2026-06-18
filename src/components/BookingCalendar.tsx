import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { bookingsApi } from '@/lib/api-client';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingCalendarProps {
  roomId?: string;
}

export const BookingCalendar = ({ roomId }: BookingCalendarProps) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await bookingsApi.getAll();
        const list = Array.isArray(data) ? data : data?.data || [];
        setBookings(roomId ? list.filter((b: any) => b.roomId === roomId) : list);
      } catch (error) {
        // User may not be logged in — show empty calendar
      }
    };
    loadBookings();
  }, [roomId]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const bookedDates = useMemo(() => {
    const dates = new Set<string>();
    bookings.forEach((b) => {
      const startStr = b.checkIn.split('T')[0];
      const endStr = b.checkOut.split('T')[0];
      const start = new Date(startStr + 'T00:00:00');
      const end = new Date(endStr + 'T00:00:00');
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dayStr = String(d.getDate()).padStart(2, '0');
        dates.add(`${y}-${m}-${dayStr}`);
      }
    });
    return dates;
  }, [bookings]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const today = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayStr = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dayStr}`;
  }, []);
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Booking Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold min-w-[140px] text-center">{monthName}</span>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-1">{d}</div>
          ))}
        </div>
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }, (_, i) => (
            <div key={`empty-${i}`} className="h-9" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isBooked = bookedDates.has(dateStr);
            const isToday = dateStr === today;
            const isPast = dateStr < today;

            return (
              <div
                key={day}
                className={`h-9 flex items-center justify-center rounded-lg text-xs font-medium transition-all ${
                  isBooked
                    ? 'bg-destructive/20 text-destructive border border-destructive/30'
                    : isToday
                    ? 'bg-primary/20 text-primary border border-primary/30 font-bold'
                    : isPast
                    ? 'text-muted-foreground/40'
                    : 'text-foreground hover:bg-primary/5'
                }`}
                title={isBooked ? 'Booked' : isToday ? 'Today' : ''}
              >
                {day}
              </div>
            );
          })}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/30">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-primary/20 border border-primary/30" />
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-destructive/20 border border-destructive/30" />
            <span className="text-xs text-muted-foreground">Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded border border-border/30" />
            <span className="text-xs text-muted-foreground">Available</span>
          </div>
          <Badge variant="secondary" className="ml-auto text-xs">
            {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
