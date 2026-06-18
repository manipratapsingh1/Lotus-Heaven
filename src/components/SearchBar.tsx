import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Users, Search, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch?: (params: { checkIn: string; checkOut: string; guests: number }) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [isFocused, setIsFocused] = useState<string | null>(null);

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ checkIn, checkOut, guests });
    }
  };

  return (
    <Card className="glass-card p-10 shadow-elegant border border-primary/20 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 animate-gradient-shift" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground tracking-wide">Find Your Perfect Stay</h3>
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div 
            className="space-y-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              Check-in
            </label>
            <Input 
              type="date" 
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              onFocus={() => setIsFocused('checkIn')}
              onBlur={() => setIsFocused(null)}
              className={`border-2 bg-card/80 h-14 text-foreground rounded-xl transition-all duration-300 ${
                isFocused === 'checkIn' ? 'border-primary shadow-glow' : 'border-border/50 hover:border-primary/50'
              }`}
            />
          </motion.div>
          
          <motion.div 
            className="space-y-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              Check-out
            </label>
            <Input 
              type="date" 
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              onFocus={() => setIsFocused('checkOut')}
              onBlur={() => setIsFocused(null)}
              className={`border-2 bg-card/80 h-14 text-foreground rounded-xl transition-all duration-300 ${
                isFocused === 'checkOut' ? 'border-primary shadow-glow' : 'border-border/50 hover:border-primary/50'
              }`}
            />
          </motion.div>
          
          <motion.div 
            className="space-y-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              Guests
            </label>
            <Input 
              type="number" 
              min="1" 
              max="10"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              onFocus={() => setIsFocused('guests')}
              onBlur={() => setIsFocused(null)}
              className={`border-2 bg-card/80 h-14 text-foreground rounded-xl transition-all duration-300 ${
                isFocused === 'guests' ? 'border-primary shadow-glow' : 'border-border/50 hover:border-primary/50'
              }`}
            />
          </motion.div>
          
          <div className="flex items-end">
            <motion.div className="w-full" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={handleSearch}
                className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground gap-3 h-14 font-bold shadow-glow hover:shadow-glow-accent transition-all duration-300 rounded-xl text-base"
              >
                <Search className="h-5 w-5" />
                Search Suites
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </Card>
  );
};
