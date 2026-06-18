import { Navigation } from '@/components/Navigation';
import { RoomCard } from '@/components/RoomCard';
import { useRooms } from '@/hooks/useRooms';
import { useWishlistStore } from '@/lib/stores/wishlistStore';
import { motion } from 'framer-motion';
import { Heart, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/lib/stores/authStore';
import { useToast } from '@/hooks/use-toast';

const Wishlist = () => {
  const { data: rooms = [] } = useRooms();
  const { favorites, priceAlerts, togglePriceAlert } = useWishlistStore();
  const { toast } = useToast();
  const { user } = useAuthStore();

  const favoriteRooms = rooms.filter(room => favorites.includes(room.id));

  const handlePriceAlertToggle = async (roomId: string) => {
    togglePriceAlert(roomId);
    const isEnabled = !priceAlerts.includes(roomId);
    
    toast({
      title: isEnabled ? 'Price Alert Enabled' : 'Price Alert Disabled',
      description: isEnabled 
        ? "We'll notify you when the price drops!"
        : 'You will no longer receive price alerts for this room.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--destructive)/0.15),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-6"
            >
              <Heart className="h-10 w-10 text-destructive fill-destructive" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="luxury-text">My Wishlist</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Your saved rooms and price alerts in one place
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        {favoriteRooms.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 glass-card rounded-3xl"
          >
            <Heart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h3 className="text-2xl font-bold mb-4">No Saved Rooms Yet</h3>
            <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
              Start exploring our rooms and save your favorites to see them here.
            </p>
            <Button asChild className="bg-gradient-gold hover:opacity-90">
              <a href="/rooms">Browse Rooms</a>
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground">
                <span className="text-foreground font-semibold">{favoriteRooms.length}</span> saved rooms
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bell className="h-4 w-4" />
                <span>Enable price alerts to get notified of deals</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favoriteRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="relative"
                >
                  <RoomCard room={room} />
                  
                  {/* Price Alert Toggle */}
                  <div className="absolute bottom-24 right-4 z-30">
                    <div className="glass-card rounded-full px-4 py-2 flex items-center gap-3">
                      {priceAlerts.includes(room.id) ? (
                        <Bell className="h-4 w-4 text-primary" />
                      ) : (
                        <BellOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-xs font-medium">
                        {priceAlerts.includes(room.id) ? 'Alerts On' : 'Alerts Off'}
                      </span>
                      <Switch
                        checked={priceAlerts.includes(room.id)}
                        onCheckedChange={() => handlePriceAlertToggle(room.id)}
                        className="scale-75"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Wishlist;
