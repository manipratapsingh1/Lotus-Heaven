import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Users, Maximize2, Star, ArrowLeft, Loader2 } from 'lucide-react';
import { BookingFlow } from '@/components/BookingFlow';
import { motion } from 'framer-motion';
import { LiveAvailability } from '@/components/LiveAvailability';
import { AIRecommendations } from '@/components/AIRecommendations';
import { ReviewSystem } from '@/components/ReviewSystem';
import { BookingCalendar } from '@/components/BookingCalendar';
import { useRoom } from '@/hooks/useRooms';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { bookingsApi } from '@/lib/api-client';
import { calculateLoyaltyPoints, getLoyaltyTier } from '@/lib/loyalty';

const RoomDetails = () => {
  const { id } = useParams();
  const { data: room, isLoading, error } = useRoom(id || '');
  const [bookingOpen, setBookingOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      bookingsApi.getAll()
        .then((data) => {
          setBookings(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error('Error fetching bookings for RoomDetails:', err));
    }
  }, [isAuthenticated]);

  const points = calculateLoyaltyPoints(bookings);
  const currentTier = getLoyaltyTier(points);
  const discountPercent = isAuthenticated ? (currentTier.name === 'Platinum' ? 0.20 : currentTier.name === 'Gold' ? 0.15 : currentTier.name === 'Silver' ? 0.10 : 0.05) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (!room || error) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Room not found</h1>
          <Link to="/rooms">
            <Button variant="outline">Back to Rooms</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      <BookingFlow open={bookingOpen} onOpenChange={setBookingOpen} room={room} />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/rooms">
            <Button variant="ghost" className="mb-6 hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Rooms
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Room Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden group">
              <img 
                src={room.images?.[0]?.url || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'} 
                alt={room.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              {room.originalPrice && (
                <Badge className="absolute top-6 right-6 bg-gradient-accent text-accent-foreground shadow-glow-accent px-4 py-2 text-sm font-bold z-10">
                  Save ₹{room.originalPrice - room.price}
                </Badge>
              )}
            </div>

            {/* Room Info */}
            <Card className="glass-card border-border/50 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold mb-3 bg-gradient-gold bg-clip-text text-transparent">{room.name}</h1>
                  <p className="text-lg text-muted-foreground capitalize font-medium">{room.type} Suite</p>
                </div>
                {room.rating && (
                  <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                    <Star className="h-5 w-5 fill-primary text-primary" />
                    <span className="text-lg font-bold text-foreground">{room.rating}</span>
                    <span className="text-sm text-muted-foreground">({room.reviewCount})</span>
                  </div>
                )}
              </div>

              <p className="text-foreground/80 mb-8 leading-relaxed text-lg">{room.description}</p>

              <div className="flex items-center gap-8 mb-8">
                <div className="flex items-center gap-3 glass px-5 py-3 rounded-xl">
                  <Users className="h-6 w-6 text-primary" />
                  <span className="font-semibold text-foreground">Up to {room.capacity} guests</span>
                </div>
                <div className="flex items-center gap-3 glass px-5 py-3 rounded-xl">
                  <Maximize2 className="h-6 w-6 text-primary" />
                  <span className="font-semibold text-foreground">{room.size} m²</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6 text-foreground">Amenities</h3>
                <div className="grid grid-cols-2 gap-4">
                  {room.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3 p-3 glass rounded-xl">
                      <div className="h-8 w-8 rounded-lg bg-gradient-gold flex items-center justify-center">
                        <Check className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Booking Card */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="sticky top-4 glass-card border-2 border-primary/20">
              <CardContent className="p-8 space-y-8">
                <div className="text-center glass rounded-2xl p-6 relative">
                  {discountPercent > 0 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-gold text-primary-foreground text-xs shadow-glow-accent font-semibold">
                        Your {currentTier.name} Rate
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    {(room.originalPrice || discountPercent > 0) && (
                      <span className="text-xl text-muted-foreground line-through">
                        ₹{room.originalPrice || room.price}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                      ₹{discountPercent > 0 ? Math.round(room.price * (1 - discountPercent)).toLocaleString() : room.price.toLocaleString()}
                    </span>
                    <span className="text-lg text-muted-foreground font-medium">/night</span>
                  </div>
                </div>

                <Button 
                  onClick={() => setBookingOpen(true)}
                  className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground py-7 text-lg font-semibold shadow-glow hover:shadow-glow-accent transition-all duration-300 hover:scale-[1.02]"
                >
                  Book Now
                </Button>

                <div className="space-y-3 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">No booking fees</span>
                    <Check className="h-4 w-4 text-success" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Free cancellation</span>
                    <Check className="h-4 w-4 text-success" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Best price guarantee</span>
                    <Check className="h-4 w-4 text-success" />
                  </div>
                </div>

                <p className="text-xs text-center text-muted-foreground glass rounded-lg p-3">
                  Free cancellation up to 24 hours before check-in
                </p>
              </CardContent>
            </Card>

            {/* Booking Calendar */}
            <BookingCalendar roomId={room.id} />

            {/* Live Availability */}
            <LiveAvailability roomId={room.id} />

            {/* AI Recommendations */}
            <AIRecommendations />

            {/* Reviews */}
            <ReviewSystem roomId={room.id} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
