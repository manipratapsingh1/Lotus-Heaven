import { Navigation } from '@/components/Navigation';
import { EnhancedSearchBar, SearchParams } from '@/components/EnhancedSearchBar';
import { RoomCard } from '@/components/RoomCard';
import { useRooms } from '@/hooks/useRooms';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RoomCardSkeleton } from '@/components/LoadingSkeleton';

const Rooms = () => {
  const { data: rooms = [], isLoading } = useRooms();
  const [filteredRooms, setFilteredRooms] = useState(rooms);

  const handleSearch = (params: SearchParams) => {
    let filtered = [...rooms];

    // Filter by room type
    if (params.roomType && params.roomType !== 'all') {
      filtered = filtered.filter(room => room.type === params.roomType);
    }

    // Filter by price range
    filtered = filtered.filter(room => 
      room.price >= params.priceRange[0] && room.price <= params.priceRange[1]
    );

    // Filter by amenities
    if (params.amenities.length > 0) {
      filtered = filtered.filter(room =>
        params.amenities.every(amenity => room.amenities.includes(amenity))
      );
    }

    setFilteredRooms(filtered);
  };

  // Update filtered rooms when rooms data changes
  useEffect(() => {
    setFilteredRooms(rooms);
  }, [rooms]);

  const displayRooms = filteredRooms;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-6 py-2 glass-card rounded-full text-sm font-medium text-primary mb-6 tracking-wider uppercase"
            >
              ✦ Premium Collection ✦
            </motion.span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="luxury-text">Luxury Suites</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Discover our curated selection of world-class accommodations, 
              designed for the discerning traveler
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <EnhancedSearchBar onSearch={handleSearch} />
          </motion.div>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="container mx-auto px-4 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <RoomCardSkeleton />
              </motion.div>
            ))}
          </div>
        ) : displayRooms.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 glass-card rounded-3xl"
          >
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold mb-4">No Matches Found</h3>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              We couldn't find rooms matching your criteria. Try adjusting your filters.
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between mb-8"
            >
              <p className="text-muted-foreground">
                Showing <span className="text-foreground font-semibold">{displayRooms.length}</span> luxury suites
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  <RoomCard room={room} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Rooms;
