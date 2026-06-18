import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Users, Search, SlidersHorizontal, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedSearchBarProps {
  onSearch?: (params: SearchParams) => void;
}

export interface SearchParams {
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType?: string;
  priceRange: [number, number];
  amenities: string[];
}

export const EnhancedSearchBar = ({ onSearch }: EnhancedSearchBarProps) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const amenitiesList = [
    'WiFi',
    'Air Conditioning',
    'Mini Bar',
    'Ocean View',
    'Balcony',
    'Room Service',
    'Smart TV',
    'Spa Bath',
  ];

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        checkIn,
        checkOut,
        guests,
        roomType: roomType === 'all' ? undefined : roomType,
        priceRange,
        amenities: selectedAmenities,
      });
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <Card className="glass-card p-6 md:p-8 shadow-elegant border-2">
      <div className="space-y-6">
        {/* Main Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Check-in
            </Label>
            <Input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="border-border bg-card/50 h-11"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Check-out
            </Label>
            <Input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="border-border bg-card/50 h-11"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Guests
            </Label>
            <Input
              type="number"
              min="1"
              max="10"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="border-border bg-card/50 h-11"
            />
          </div>

          <div className="flex items-end gap-2">
            <Button
              onClick={handleSearch}
              className="flex-1 bg-gradient-gold hover:opacity-90 text-primary-foreground gap-2 h-11 font-semibold shadow-glow hover:shadow-glow-accent transition-all duration-300"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <Collapsible open={showFilters} onOpenChange={setShowFilters}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between hover:bg-primary/10"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Advanced Filters
                {selectedAmenities.length > 0 && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    {selectedAmenities.length} selected
                  </span>
                )}
              </span>
              <motion.div
                animate={{ rotate: showFilters ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ▼
              </motion.div>
            </Button>
          </CollapsibleTrigger>

          <AnimatePresence>
            {showFilters && (
              <CollapsibleContent forceMount>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pt-6 space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Room Type Filter */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Room Type</Label>
                      <Select value={roomType} onValueChange={setRoomType}>
                        <SelectTrigger className="bg-card/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="deluxe">Deluxe</SelectItem>
                          <SelectItem value="suite">Suite</SelectItem>
                          <SelectItem value="executive">Executive</SelectItem>
                          <SelectItem value="presidential">Presidential</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range Filter */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                      </Label>
                      <Slider
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        min={0}
                        max={50000}
                        step={500}
                        className="mt-4"
                      />
                    </div>
                  </div>

                  {/* Amenities Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Amenities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {amenitiesList.map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center space-x-2 glass-card p-3 rounded-lg cursor-pointer hover:border-primary/30 transition-colors"
                          onClick={() => toggleAmenity(amenity)}
                        >
                          <Checkbox
                            id={amenity}
                            checked={selectedAmenities.includes(amenity)}
                            onCheckedChange={() => toggleAmenity(amenity)}
                          />
                          <label
                            htmlFor={amenity}
                            className="text-sm cursor-pointer"
                          >
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  {(selectedAmenities.length > 0 || roomType !== 'all' || priceRange[0] !== 0 || priceRange[1] !== 50000) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedAmenities([]);
                        setRoomType('all');
                        setPriceRange([0, 50000]);
                      }}
                      className="w-full md:w-auto"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </motion.div>
              </CollapsibleContent>
            )}
          </AnimatePresence>
        </Collapsible>
      </div>
    </Card>
  );
};
