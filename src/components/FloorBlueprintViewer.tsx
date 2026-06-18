import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useRooms } from '@/hooks/useRooms';
import { useBookings } from '@/hooks/useBookings';
import { Map, Info, Compass, ShieldAlert, Award, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isWithinInterval } from 'date-fns';

interface FloorRoom {
  id: string;
  name: string;
  number: string;
  type: string;
  isMock: boolean;
  mockStatus?: 'available' | 'occupied' | 'maintenance';
  mockGuest?: string;
  mockCheckout?: string;
  // SVG coordinates for mapping
  x: number;
  y: number;
  w: number;
  h: number;
}

export const FloorBlueprintViewer = () => {
  const { data: rooms = [] } = useRooms();
  const { data: bookings = [] } = useBookings('admin');
  const [selectedFloor, setSelectedFloor] = useState<string>('12');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const floors = ['3', '5', '8', '12', '20', '25'];

  // Map room data from DB matching current selected floor
  const realRoom = rooms.find(r => r.floor?.toString() === selectedFloor);

  // Check if real room is currently occupied today
  const checkRealRoomOccupancy = (roomId: string) => {
    const today = new Date();
    const activeBooking = bookings.find((b: any) => {
      if (b.roomId !== roomId) return false;
      if (b.status === 'CANCELLED') return false;
      try {
        const inDate = new Date(b.checkIn);
        const outDate = new Date(b.checkOut);
        return isWithinInterval(today, { start: inDate, end: outDate });
      } catch {
        return false;
      }
    });
    return activeBooking || null;
  };

  // Compile a layout of rooms for the active floor (1 real room + 3 mock rooms to fill space)
  const getFloorRooms = (floorNum: string): FloorRoom[] => {
    const list: FloorRoom[] = [];

    // Real room on this floor
    const floorRealRoom = rooms.find(r => r.floor?.toString() === floorNum);
    if (floorRealRoom) {
      list.push({
        id: floorRealRoom.id,
        name: floorRealRoom.name,
        number: `${floorNum}01`,
        type: floorRealRoom.type,
        isMock: false,
        x: 40,
        y: 40,
        w: 120,
        h: 100,
      });
    }

    // Add mock rooms to represent a realistic floor layout
    list.push({
      id: `mock-room-${floorNum}02`,
      name: 'Deluxe Suite B',
      number: `${floorNum}02`,
      type: 'deluxe',
      isMock: true,
      mockStatus: 'available',
      x: 180,
      y: 40,
      w: 100,
      h: 100,
    });

    list.push({
      id: `mock-room-${floorNum}03`,
      name: 'Executive Room C',
      number: `${floorNum}03`,
      type: 'executive',
      isMock: true,
      mockStatus: floorNum === '20' || floorNum === '25' ? 'occupied' : 'maintenance',
      mockGuest: 'Marcus Aurelius',
      mockCheckout: '2026-06-21',
      x: 40,
      y: 200,
      w: 100,
      h: 100,
    });

    list.push({
      id: `mock-room-${floorNum}04`,
      name: 'Standard Twin D',
      number: `${floorNum}04`,
      type: 'standard',
      isMock: true,
      mockStatus: 'occupied',
      mockGuest: 'Cleopatra Philopator',
      mockCheckout: '2026-06-22',
      x: 160,
      y: 200,
      w: 120,
      h: 100,
    });

    return list;
  };

  const activeFloorRooms = getFloorRooms(selectedFloor);
  const selectedRoomDetails = activeFloorRooms.find(r => r.id === selectedRoomId);

  // Helper to determine status and colors of rooms
  const getRoomStatus = (room: FloorRoom) => {
    if (!room.isMock) {
      const activeBooking = checkRealRoomOccupancy(room.id);
      if (activeBooking) {
        return {
          status: 'occupied',
          label: 'Occupied',
          guest: activeBooking.guestName,
          checkout: format(new Date(activeBooking.checkOut), 'MMM d, yyyy'),
          color: 'stroke-red-500 fill-red-500/10 shadow-red-500/30',
          badge: 'bg-red-500/10 text-red-400 border-red-500/20',
        };
      }
      return {
        status: 'available',
        label: 'Available',
        color: 'stroke-green-500 fill-green-500/10 shadow-green-500/30',
        badge: 'bg-green-500/10 text-green-400 border-green-500/20',
      };
    }

    // Mock rooms
    if (room.mockStatus === 'occupied') {
      return {
        status: 'occupied',
        label: 'Occupied',
        guest: room.mockGuest,
        checkout: room.mockCheckout,
        color: 'stroke-red-500 fill-red-500/10 shadow-red-500/30',
        badge: 'bg-red-500/10 text-red-400 border-red-500/20',
      };
    } else if (room.mockStatus === 'maintenance') {
      return {
        status: 'maintenance',
        label: 'Maintenance',
        color: 'stroke-amber-500 fill-amber-500/10 shadow-amber-500/30',
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      };
    }
    return {
      status: 'available',
      label: 'Available',
      color: 'stroke-green-500 fill-green-500/10 shadow-green-500/30',
      badge: 'bg-green-500/10 text-green-400 border-green-500/20',
    };
  };

  const getSelectedRoomDisplayInfo = () => {
    if (!selectedRoomDetails) return null;
    const statusInfo = getRoomStatus(selectedRoomDetails);
    
    // If it's a real room, we can fetch original database properties
    const dbRoom = rooms.find(r => r.id === selectedRoomDetails.id);

    return {
      name: dbRoom?.name || selectedRoomDetails.name,
      number: selectedRoomDetails.number,
      type: dbRoom?.type || selectedRoomDetails.type,
      price: dbRoom?.price || (selectedRoomDetails.type === 'deluxe' ? 7499 : 2999),
      capacity: dbRoom?.capacity || 2,
      size: dbRoom?.size || 35,
      amenities: dbRoom?.amenities || ['WiFi', 'TV', 'Air Conditioning'],
      status: statusInfo.label,
      guest: statusInfo.guest,
      checkout: statusInfo.checkout,
      badgeClass: statusInfo.badge,
    };
  };

  const roomDisplay = getSelectedRoomDisplayInfo();

  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl justify-between flex-wrap">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-gold flex items-center justify-center">
              <Map className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="bg-gradient-gold bg-clip-text text-transparent font-bold">Interactive Floor Blueprint</span>
              <p className="text-xs text-muted-foreground font-light mt-0.5">Real-time floor occupancy and blueprint analytics</p>
            </div>
          </div>

          <Tabs value={selectedFloor} onValueChange={(v) => { setSelectedFloor(v); setSelectedRoomId(null); }}>
            <TabsList className="glass border border-border/30 p-0.5">
              {floors.map(floor => (
                <TabsTrigger
                  key={floor}
                  value={floor}
                  className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground text-xs px-3 py-1.5"
                >
                  Floor {floor}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Blueprint SVG map */}
          <div className="lg:col-span-2 relative glass border border-border/30 rounded-2xl p-6 bg-slate-950/40 flex justify-center items-center overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e911_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e911_1px,transparent_1px)] bg-[size:20px_20px]" />
            
            <svg viewBox="0 0 360 360" className="w-full max-w-[340px] h-auto relative z-10 select-none">
              {/* Hallway */}
              <rect x="150" y="30" width="30" height="290" rx="3" className="stroke-sky-500/20 fill-sky-500/5 stroke-dasharray-[4,4] stroke-1" />
              <text x="165" y="170" transform="rotate(90, 165, 170)" className="text-[8px] font-bold text-sky-500/40 tracking-widest text-center" textAnchor="middle">
                CENTRAL CORRIDOR
              </text>

              {/* Elevator / Staircase Zone */}
              <g className="stroke-sky-500/30 fill-sky-500/5">
                <rect x="300" y="140" width="40" height="40" rx="4" />
                <rect x="300" y="190" width="40" height="40" rx="4" />
                <Compass className="h-5 w-5 text-sky-500/30 x-[310] y-[150]" />
              </g>
              <text x="320" y="163" className="text-[7px] fill-sky-500/40 font-bold text-center" textAnchor="middle">ELEVATOR</text>
              <text x="320" y="213" className="text-[7px] fill-sky-500/40 font-bold text-center" textAnchor="middle">STAIRS</text>

              {/* Render Room rectangles */}
              {activeFloorRooms.map((room) => {
                const statusInfo = getRoomStatus(room);
                const isSelected = selectedRoomId === room.id;
                
                return (
                  <motion.g
                    key={room.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedRoomId(room.id)}
                    whileHover={{ scale: 1.01 }}
                  >
                    <rect
                      x={room.x}
                      y={room.y}
                      width={room.w}
                      height={room.h}
                      rx="8"
                      className={`stroke-2 transition-all duration-300 ${statusInfo.color} ${
                        isSelected ? 'stroke-primary fill-primary/20 ring-2 ring-primary/40' : ''
                      }`}
                    />
                    {/* Glowing dot for occupancy status */}
                    <circle
                      cx={room.x + 15}
                      cy={room.y + 15}
                      r="4"
                      className={
                        statusInfo.status === 'available'
                          ? 'fill-green-500 animate-pulse'
                          : statusInfo.status === 'occupied'
                          ? 'fill-red-500 animate-pulse'
                          : 'fill-amber-500 animate-pulse'
                      }
                    />
                    <text
                      x={room.x + room.w / 2}
                      y={room.y + room.h / 2}
                      className="text-[10px] font-bold fill-foreground text-center"
                      textAnchor="middle"
                    >
                      Room {room.number}
                    </text>
                    <text
                      x={room.x + room.w / 2}
                      y={room.y + room.h / 2 + 12}
                      className="text-[7px] fill-muted-foreground capitalize text-center"
                      textAnchor="middle"
                    >
                      {room.type}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </div>

          {/* Details Sidebar panel */}
          <div className="glass border border-border/30 rounded-2xl p-4 flex flex-col justify-between min-h-[300px]">
            <AnimatePresence mode="wait">
              {roomDisplay ? (
                <motion.div
                  key={selectedRoomId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-bold">{roomDisplay.name}</h4>
                        <p className="text-xs text-muted-foreground font-mono">Room Number: #{roomDisplay.number}</p>
                      </div>
                      <Badge className={roomDisplay.badgeClass}>
                        {roomDisplay.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-b border-border/20">
                      <div>
                        <p className="text-muted-foreground">Type</p>
                        <p className="font-semibold capitalize">{roomDisplay.type}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-semibold text-primary">₹{roomDisplay.price.toLocaleString()}/night</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Capacity</p>
                        <p className="font-semibold">{roomDisplay.capacity} guests</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Size</p>
                        <p className="font-semibold">{roomDisplay.size} m²</p>
                      </div>
                    </div>

                    {/* Guest details if occupied */}
                    {roomDisplay.guest && (
                      <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/10 space-y-1">
                        <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                          <Award className="h-3 w-3" /> Guest Details
                        </p>
                        <p className="text-xs font-semibold">{roomDisplay.guest}</p>
                        <p className="text-[10px] text-muted-foreground">Check-out: {roomDisplay.checkout}</p>
                      </div>
                    )}

                    {/* Amenities list */}
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase">Amenities</p>
                      <div className="flex flex-wrap gap-1">
                        {roomDisplay.amenities.slice(0, 4).map((a: string) => (
                          <Badge key={a} variant="secondary" className="text-[9px] px-1.5 py-0">
                            {a}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-muted-foreground italic leading-relaxed pt-4 border-t border-border/20 mt-auto">
                    Note: Adjust pricing parameters in the Yield Management module to change active nightly rates.
                  </p>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                  <Info className="h-10 w-10 text-muted-foreground/30 animate-pulse" />
                  <div>
                    <p className="font-semibold text-sm text-foreground">No Room Selected</p>
                    <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                      Click any room on the blueprint vector map to view real occupancy and details.
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
