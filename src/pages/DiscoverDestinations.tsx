import { useState, useRef, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, MapPin, Calendar, DollarSign, Sun, Clock, Star, ArrowRight, Compass, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { matchDestinations, Destination, destinations } from '@/lib/destinationData';
import { Link } from 'react-router-dom';

const SUGGESTIONS = [
  '₹20,000 for 5 days in December, romantic',
  'Solo backpacking trip, budget, Asia',
  'Luxury honeymoon in the Maldives',
  'Adventure trip to Iceland',
  'Beach vacation under ₹15,000',
  'Cultural food tour in Japan',
];

const DiscoverDestinations = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Destination[]>([]);
  const [insights, setInsights] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;
    setQuery(q);
    setIsSearching(true);
    setHasSearched(true);
    setSelectedDest(null);
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
    const result = matchDestinations(q);
    setResults(result.destinations);
    setInsights(result.insights);
    setIsSearching(false);
  };

  const getCurrentSeason = (): string => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  };

  const trendingDestinations = destinations.filter(d => d.bestMonths.includes(new Date().getMonth() + 1)).slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />

      {/* Hero Search Section */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="inline-flex items-center gap-2 px-5 py-2 glass-card rounded-full mb-6">
              <Compass className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Smart Discovery</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="luxury-text">Discover Your</span>
              <br />
              <span className="text-foreground">Dream Destination</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tell us your budget, dates, and travel style — our AI will find the perfect destinations for you
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-3xl mx-auto">
            <div className="relative glass-card rounded-2xl border-2 border-primary/20 p-2 shadow-glow">
              <div className="flex items-center gap-3">
                <div className="pl-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder='Try "₹20,000 for 5 days in December, romantic"...'
                  className="flex-1 bg-transparent border-none outline-none text-foreground text-lg placeholder:text-muted-foreground/60 py-4"
                />
                <Button onClick={() => handleSearch()} disabled={isSearching} className="bg-gradient-gold hover:opacity-90 text-primary-foreground px-8 py-6 rounded-xl font-semibold text-base">
                  {isSearching ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Sparkles className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Discover
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Suggestion Chips */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => handleSearch(s)} className="text-xs px-4 py-2 rounded-full glass-card border border-border/30 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200">
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {isSearching && (
          <motion.section key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container mx-auto px-4 py-12">
            <div className="text-center">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
              </motion.div>
              <p className="text-xl text-muted-foreground">AI is analyzing destinations for you...</p>
            </div>
          </motion.section>
        )}

        {!isSearching && hasSearched && results.length > 0 && (
          <motion.section key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 pb-24">
            {insights && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 glass-card rounded-xl p-4 mb-8 max-w-3xl mx-auto border border-primary/20">
                <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm text-foreground">{insights}</p>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((dest, i) => (
                <motion.div key={dest.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="overflow-hidden glass-card border-border/30 group cursor-pointer hover:border-primary/30 transition-all duration-500 hover:shadow-glow" onClick={() => setSelectedDest(selectedDest?.id === dest.id ? null : dest)}>
                    <div className="relative h-56 overflow-hidden">
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-1">{dest.name}</h3>
                        <p className="text-sm text-white/80 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {dest.country}
                        </p>
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-1 glass px-3 py-1.5 rounded-full">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span className="text-xs font-bold text-foreground">{dest.rating}</span>
                      </div>
                    </div>
                    <CardContent className="p-5 space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">{dest.description}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span className="text-foreground font-medium">{dest.budgetPerDay.currency}{dest.budgetPerDay.min.toLocaleString()}-{dest.budgetPerDay.max.toLocaleString()}/day</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-foreground font-medium">{dest.suggestedDays.min}-{dest.suggestedDays.max} days</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {dest.popularFor.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-primary/10 border-primary/20 text-primary">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <AnimatePresence>
                        {selectedDest?.id === dest.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-4 pt-4 border-t border-border/30 overflow-hidden">
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                <Sun className="h-4 w-4 text-primary" /> Weather ({getCurrentSeason()})
                              </h4>
                              <p className="text-sm text-muted-foreground">{dest.weather[getCurrentSeason() as keyof typeof dest.weather]}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-2">🏛️ Top Attractions</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {dest.topAttractions.map((a) => (
                                  <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-2">💡 Travel Tips</h4>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {dest.travelTips.map((tip, i) => (
                                  <li key={i} className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> {tip}</li>
                                ))}
                              </ul>
                            </div>
                            <Link to="/trip-planner">
                              <Button className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold group mt-2">
                                Plan a Trip to {dest.name}
                                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Trending Section (shown before search) */}
      {!hasSearched && (
        <section className="container mx-auto px-4 pb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center mb-12">
            <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-3 block">Best for {getCurrentSeason()}</span>
            <h2 className="text-4xl font-bold text-foreground">Trending Destinations</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingDestinations.map((dest, i) => (
              <motion.div key={dest.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }} whileHover={{ y: -8 }}>
                <Card className="overflow-hidden glass-card border-border/30 cursor-pointer group hover:shadow-glow transition-all duration-500" onClick={() => { setQuery(dest.name); handleSearch(dest.name); }}>
                  <div className="relative h-64 overflow-hidden">
                    <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-xl font-bold text-white">{dest.name}</h3>
                      <p className="text-sm text-white/70">{dest.country}</p>
                    </div>
                    <Badge className="absolute top-4 right-4 bg-gradient-gold text-primary-foreground text-xs">
                      From {dest.budgetPerDay.currency}{dest.budgetPerDay.min.toLocaleString()}/day
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DiscoverDestinations;
