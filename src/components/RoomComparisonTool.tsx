import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Minus, Star, Users, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompareStore } from '@/lib/stores/compareStore';
import { Badge } from '@/components/ui/badge';

export const RoomComparisonTool = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();

  if (compareList.length === 0) return null;

  const allAmenities = [...new Set(compareList.flatMap((room) => room.amenities))];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-primary/20"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">Compare Rooms</h3>
              <p className="text-sm text-muted-foreground">
                {compareList.length}/3 rooms selected
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCompare}
              className="text-muted-foreground hover:text-destructive"
            >
              Clear All
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground w-40">
                    Feature
                  </th>
                  {compareList.map((room) => (
                    <th key={room.id} className="py-3 px-4 w-60">
                      <div className="relative glass rounded-xl p-4">
                        <button
                          onClick={() => removeFromCompare(room.id)}
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive flex items-center justify-center hover:bg-destructive/80 transition-colors"
                        >
                          <X className="h-3 w-3 text-destructive-foreground" />
                        </button>
                        <img
                          src={room.images?.[0]?.url || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'}
                          alt={room.name}
                          className="w-full h-24 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-bold text-foreground text-sm truncate">
                          {room.name}
                        </h4>
                      </div>
                    </th>
                  ))}
                  {[...Array(3 - compareList.length)].map((_, i) => (
                    <th key={`empty-${i}`} className="py-3 px-4 w-60">
                      <div className="glass rounded-xl p-4 h-36 flex items-center justify-center border-2 border-dashed border-border/50">
                        <p className="text-sm text-muted-foreground">Add room</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-t border-border/30">
                  <td className="py-3 px-4 font-medium text-muted-foreground">Price</td>
                  {compareList.map((room) => (
                    <td key={room.id} className="py-3 px-4 text-center">
                      <span className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                        ₹{room.price}
                      </span>
                      <span className="text-muted-foreground text-xs">/night</span>
                    </td>
                  ))}
                  {[...Array(3 - compareList.length)].map((_, i) => (
                    <td key={`empty-${i}`} className="py-3 px-4" />
                  ))}
                </tr>
                <tr className="border-t border-border/30">
                  <td className="py-3 px-4 font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-primary" />
                      Rating
                    </div>
                  </td>
                  {compareList.map((room) => (
                    <td key={room.id} className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-semibold text-foreground">
                          {room.rating || 'N/A'}
                        </span>
                      </div>
                    </td>
                  ))}
                  {[...Array(3 - compareList.length)].map((_, i) => (
                    <td key={`empty-${i}`} className="py-3 px-4" />
                  ))}
                </tr>
                <tr className="border-t border-border/30">
                  <td className="py-3 px-4 font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Capacity
                    </div>
                  </td>
                  {compareList.map((room) => (
                    <td key={room.id} className="py-3 px-4 text-center text-foreground">
                      Up to {room.capacity} guests
                    </td>
                  ))}
                  {[...Array(3 - compareList.length)].map((_, i) => (
                    <td key={`empty-${i}`} className="py-3 px-4" />
                  ))}
                </tr>
                <tr className="border-t border-border/30">
                  <td className="py-3 px-4 font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Maximize2 className="h-4 w-4 text-primary" />
                      Size
                    </div>
                  </td>
                  {compareList.map((room) => (
                    <td key={room.id} className="py-3 px-4 text-center text-foreground">
                      {room.size} m²
                    </td>
                  ))}
                  {[...Array(3 - compareList.length)].map((_, i) => (
                    <td key={`empty-${i}`} className="py-3 px-4" />
                  ))}
                </tr>
                {allAmenities.slice(0, 6).map((amenity) => (
                  <tr key={amenity} className="border-t border-border/30">
                    <td className="py-3 px-4 font-medium text-muted-foreground text-xs">
                      {amenity}
                    </td>
                    {compareList.map((room) => (
                      <td key={room.id} className="py-3 px-4 text-center">
                        {room.amenities.includes(amenity) ? (
                          <Check className="h-5 w-5 mx-auto text-success" />
                        ) : (
                          <Minus className="h-5 w-5 mx-auto text-muted-foreground/30" />
                        )}
                      </td>
                    ))}
                    {[...Array(3 - compareList.length)].map((_, i) => (
                      <td key={`empty-${i}`} className="py-3 px-4" />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
