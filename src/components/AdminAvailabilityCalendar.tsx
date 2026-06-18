import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRooms } from '@/hooks/useRooms';
import { useBookings } from '@/hooks/useBookings';
import { Calendar, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO, isWithinInterval } from 'date-fns';

const parseDate = (d: any): Date => {
  if (!d) return new Date();
  if (d instanceof Date) return d;
  if (typeof d === 'string') return parseISO(d);
  return new Date(d);
};

export const AdminAvailabilityCalendar = () => {
  const { data: rooms = [] } = useRooms();
  const { data: bookings = [] } = useBookings('admin');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get bookings for a room on a specific day
  const getRoomBookingsForDay = (roomId: string, day: Date) => {
    return bookings.filter((booking: any) => {
      if (booking.roomId !== roomId) return false;
      if (booking.status === 'CANCELLED') return false;
      try {
        const checkIn = parseDate(booking.checkIn);
        const checkOut = parseDate(booking.checkOut);
        return isWithinInterval(day, { start: checkIn, end: checkOut });
      } catch {
        return false;
      }
    });
  };

  const getStatusColor = (available: boolean, hasBooking: boolean) => {
    if (hasBooking) return 'bg-amber-500/20 border-amber-500/40 text-amber-400';
    if (!available) return 'bg-red-500/20 border-red-500/40 text-red-400';
    return 'bg-green-500/20 border-green-500/40 text-green-400';
  };

  return (
    <div className="space-y-6">
      {/* Room Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {rooms.map((room: any) => {
          const activeBookings = bookings.filter(
            (b: any) => b.roomId === room.id && (b.status === 'CONFIRMED' || b.status === 'PENDING')
          ).length;

          return (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
              className="cursor-pointer"
            >
              <Card className={`glass-card border-border/50 transition-all ${
                selectedRoom === room.id ? 'ring-2 ring-primary shadow-glow' : ''
              }`}>
                <CardContent className="p-4">
                  <p className="font-semibold text-sm mb-2 truncate">{room.name}</p>
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="outline"
                      className={room.available ? 'text-green-400 border-green-500/30' : 'text-red-400 border-red-500/30'}
                    >
                      {room.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>₹{room.price}/night</span>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{activeBookings}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {rooms.length === 0 && (
        <Card className="glass-card border-border/50">
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">No rooms found. Add rooms in the Rooms tab.</p>
          </CardContent>
        </Card>
      )}

      {/* Calendar View */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calendar className="h-5 w-5 text-primary" />
              {selectedRoom
                ? `Calendar — ${rooms.find((r: any) => r.id === selectedRoom)?.name || 'Room'}`
                : 'Availability Calendar'
              }
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for offset */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16" />
            ))}

            {daysInMonth.map(day => {
              const roomsToCheck = selectedRoom
                ? rooms.filter((r: any) => r.id === selectedRoom)
                : rooms;

              const bookedRooms = roomsToCheck.filter((room: any) =>
                getRoomBookingsForDay(room.id, day).length > 0
              ).length;

              const totalRooms = roomsToCheck.length;
              const allBooked = totalRooms > 0 && bookedRooms === totalRooms;
              const someBooked = bookedRooms > 0 && !allBooked;

              let bgClass = 'bg-green-500/10 border-green-500/20';
              if (allBooked) bgClass = 'bg-red-500/10 border-red-500/20';
              else if (someBooked) bgClass = 'bg-amber-500/10 border-amber-500/20';

              return (
                <motion.div
                  key={day.toISOString()}
                  whileHover={{ scale: 1.05 }}
                  className={`h-16 rounded-lg border p-1.5 transition-all ${bgClass} ${
                    isToday(day) ? 'ring-2 ring-primary' : ''
                  } ${!isSameMonth(day, currentMonth) ? 'opacity-30' : ''}`}
                >
                  <div className="text-xs font-medium mb-1">
                    {format(day, 'd')}
                  </div>
                  {totalRooms > 0 && (
                    <div className="text-[10px] text-muted-foreground">
                      {bookedRooms > 0 ? (
                        <span className={allBooked ? 'text-red-400' : 'text-amber-400'}>
                          {bookedRooms}/{totalRooms} booked
                        </span>
                      ) : (
                        <span className="text-green-400">All free</span>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/30">
            <div className="flex items-center gap-2 text-xs">
              <div className="h-3 w-3 rounded bg-green-500/30 border border-green-500/40" />
              <span className="text-muted-foreground">Available</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="h-3 w-3 rounded bg-amber-500/30 border border-amber-500/40" />
              <span className="text-muted-foreground">Partially Booked</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="h-3 w-3 rounded bg-red-500/30 border border-red-500/40" />
              <span className="text-muted-foreground">Fully Booked</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
