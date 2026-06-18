import { Room } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Maximize2, Star, Heart, GitCompare, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '@/lib/stores/wishlistStore';
import { useCompareStore } from '@/lib/stores/compareStore';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { VirtualRoomTour } from './VirtualRoomTour';
import { useToast } from '@/hooks/use-toast';

interface RoomCardProps {
  room: Room;
}

export const RoomCard = ({ room }: RoomCardProps) => {
  const { isFavorite, toggleFavorite } = useWishlistStore();
  const { addToCompare, removeFromCompare, isInCompare } = useCompareStore();
  const [showTour, setShowTour] = useState(false);
  const { toast } = useToast();
  const favorite = isFavorite(room.id);
  const inCompare = isInCompare(room.id);

  const handleCompareToggle = () => {
    if (inCompare) {
      removeFromCompare(room.id);
    } else {
      addToCompare(room);
      toast({
        title: 'Added to Compare',
        description: `${room.name} added. Compare up to 3 rooms.`,
      });
    }
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(room.id);
    toast({
      title: favorite ? 'Removed from Wishlist' : 'Added to Wishlist',
      description: favorite 
        ? `${room.name} removed from your wishlist`
        : `${room.name} saved! We'll notify you of price drops.`,
    });
  };

  return (
    <>
      <Card className="overflow-hidden transition-all duration-500 hover:shadow-glow group bg-gradient-card border-border/50 relative">
        {/* Action Buttons */}
        <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFavoriteToggle}
            className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              favorite 
                ? 'bg-destructive text-destructive-foreground shadow-lg' 
                : 'glass-card hover:bg-destructive/20'
            }`}
          >
            <Heart className={`h-5 w-5 ${favorite ? 'fill-current' : ''}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCompareToggle}
            className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              inCompare 
                ? 'bg-primary text-primary-foreground shadow-glow' 
                : 'glass-card hover:bg-primary/20'
            }`}
          >
            <GitCompare className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTour(true)}
            className="h-10 w-10 rounded-full glass-card flex items-center justify-center hover:bg-accent/20 transition-all duration-300"
          >
            <Eye className="h-5 w-5" />
          </motion.button>
        </div>

        <div className="relative h-72 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 opacity-60" />
          <img 
            src={room.images?.[0]?.url || `https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800`} 
            alt={room.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {room.originalPrice && (
            <Badge className="absolute top-6 right-6 bg-gradient-accent text-accent-foreground shadow-glow-accent px-4 py-2 text-sm font-bold z-20">
              Save ₹{room.originalPrice - room.price}
            </Badge>
          )}
          {room.rating && (
            <div className="absolute bottom-6 left-6 flex items-center gap-2 glass-card px-4 py-2 rounded-full z-20">
              <Star className="h-5 w-5 fill-primary text-primary" />
              <span className="text-sm font-bold text-foreground">{room.rating}</span>
              <span className="text-xs text-muted-foreground">({room.reviewCount})</span>
            </div>
          )}
        </div>
        
        <CardContent className="pt-8 pb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{room.name}</h3>
              <p className="text-sm text-muted-foreground capitalize font-medium">{room.type} Suite</p>
            </div>
            <div className="text-right">
              {room.originalPrice && (
                <p className="text-sm text-muted-foreground line-through mb-1">₹{room.originalPrice}</p>
              )}
              <p className="text-3xl font-bold bg-gradient-gold bg-clip-text text-transparent">₹{room.price}</p>
              <p className="text-xs text-muted-foreground font-medium">per night</p>
            </div>
          </div>
          
          <p className="text-sm text-foreground/70 mb-6 line-clamp-2 leading-relaxed">{room.description}</p>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-medium">Up to {room.capacity} guests</span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize2 className="h-5 w-5 text-primary" />
              <span className="font-medium">{room.size} m²</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {room.amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="secondary" className="text-xs bg-muted/50 border border-border/50 font-medium">
                {amenity}
              </Badge>
            ))}
            {room.amenities.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-primary/10 border border-primary/30 text-primary font-medium">
                +{room.amenities.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 pb-6">
          <Link to={`/rooms/${room.id}`} className="w-full">
            <Button className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold py-6 shadow-glow hover:shadow-glow-accent transition-all duration-300 hover:scale-[1.02]">
              View Details
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <VirtualRoomTour isOpen={showTour} onClose={() => setShowTour(false)} />
    </>
  );
};
