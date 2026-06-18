import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { roomsApi } from '@/lib/api-client';

interface FloorPlanViewerProps {
  hotelId?: string;
}

export const FloorPlanViewer = ({ hotelId }: FloorPlanViewerProps) => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedFloor, setSelectedFloor] = useState(1);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await roomsApi.getAll();
        setRooms(data?.data || []);
      } catch (error) {
        console.error('Failed to load rooms');
      }
    };
    loadRooms();
  }, [hotelId]);

  const floors = [...new Set(rooms.map(r => r.floor || 1))].sort();
  const floorRooms = rooms.filter(r => (r.floor || 1) === selectedFloor);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Floor Plan</CardTitle>
        <div className="flex gap-2 mt-2">
          {floors.map(floor => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedFloor === floor
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Floor {floor}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {floorRooms.map(room => (
            <div
              key={room.id}
              className={`p-3 rounded-lg border text-center transition-all ${
                room.available
                  ? 'border-green-500/30 bg-green-500/5 hover:bg-green-500/10'
                  : 'border-red-500/30 bg-red-500/5'
              }`}
            >
              <p className="text-xs font-semibold">{room.name}</p>
              <Badge variant="outline" className="mt-1 text-xs">
                {room.available ? 'Available' : 'Occupied'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
