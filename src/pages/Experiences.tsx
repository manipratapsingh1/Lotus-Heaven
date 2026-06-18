import { useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { motion } from 'framer-motion';
import { Search, Star, Clock, MapPin, Filter, Users, Heart, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { localExperiences, LocalExperience } from '@/lib/destinationData';

const CATEGORIES = [
  { key: 'all', label: 'All', icon: '🌟' },
  { key: 'food', label: 'Food Tours', icon: '🍽️' },
  { key: 'adventure', label: 'Adventure', icon: '🧗' },
  { key: 'cultural', label: 'Cultural', icon: '🏛️' },
  { key: 'nature', label: 'Nature', icon: '🌿' },
  { key: 'guide', label: 'Local Guides', icon: '🗺️' },
  { key: 'nightlife', label: 'Nightlife', icon: '🌃' },
];

const Experiences = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return localExperiences.filter((exp) => {
      const matchCat = category === 'all' || exp.category === category;
      const matchSearch = !search || exp.title.toLowerCase().includes(search.toLowerCase()) || exp.destination.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />

      <section className="relative pt-28 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="absolute top-20 right-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 glass-card rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Curated Experiences</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="luxury-text">Local Experiences</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Discover authentic activities, food tours, adventures, and cultural experiences curated by locals</p>
          </motion.div>

          {/* Search & Filter */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-2xl mx-auto mb-8">
            <div className="relative glass-card rounded-xl border border-border/30 p-1.5">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-muted-foreground ml-3" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search experiences or destinations..." className="border-none bg-transparent shadow-none focus-visible:ring-0 text-base" />
              </div>
            </div>
          </motion.div>

          {/* Category Chips */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button key={cat.key} onClick={() => setCategory(cat.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${category === cat.key ? 'bg-gradient-gold text-primary-foreground shadow-glow' : 'glass-card border border-border/30 text-muted-foreground hover:text-primary hover:border-primary/40'}`}>
                <span className="mr-1.5">{cat.icon}</span> {cat.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((exp, i) => (
            <motion.div key={exp.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="overflow-hidden glass-card border-border/30 group hover:border-primary/30 hover:shadow-glow transition-all duration-500">
                <div className="relative h-56 overflow-hidden">
                  <img src={exp.image} alt={exp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-70" />
                  <button onClick={() => toggleSave(exp.id)}
                    className={`absolute top-4 right-4 h-10 w-10 rounded-full flex items-center justify-center transition-all ${savedIds.has(exp.id) ? 'bg-destructive text-white' : 'glass-card hover:bg-destructive/20'}`}>
                    <Heart className={`h-5 w-5 ${savedIds.has(exp.id) ? 'fill-current' : ''}`} />
                  </button>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <Badge className="bg-gradient-gold text-primary-foreground text-sm font-bold px-3 py-1">{exp.currency}{exp.price.toLocaleString()}</Badge>
                  </div>
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 glass px-3 py-1.5 rounded-full">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    <span className="text-xs font-bold text-foreground">{exp.rating}</span>
                    <span className="text-xs text-muted-foreground">({exp.reviewCount})</span>
                  </div>
                </div>
                <CardContent className="p-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-1">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{exp.destination} • <Clock className="h-3 w-3" />{exp.duration}</p>
                  </div>
                  <p className="text-sm text-foreground/70 line-clamp-2">{exp.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.highlights.slice(0, 3).map((h) => (
                      <Badge key={h} variant="secondary" className="text-xs bg-muted/50 border-border/50"><CheckCircle2 className="h-3 w-3 mr-1 text-green-400" />{h}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-gold flex items-center justify-center text-sm">{exp.host.avatar}</div>
                      <div>
                        <p className="text-xs font-medium text-foreground flex items-center gap-1">{exp.host.name} {exp.host.verified && <CheckCircle2 className="h-3 w-3 text-blue-400" />}</p>
                        <p className="text-xs text-muted-foreground">Local Host</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold">Book Now</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-40" />
            <h3 className="text-2xl font-bold mb-3">No experiences found</h3>
            <p className="text-muted-foreground">Try a different search or category</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Experiences;
