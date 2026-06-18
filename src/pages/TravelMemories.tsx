import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Camera, MapPin, Calendar, DollarSign, Star, Lock, CheckCircle2, Plus, Sparkles, Globe, Moon, TrendingUp, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAchievementStore, TIER_COLORS } from '@/lib/stores/achievementStore';

const TravelMemories = () => {
  const { achievements, memories, stats, addMemory, deleteMemory } = useAchievementStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newMemory, setNewMemory] = useState({ tripName: '', destination: '', dates: '', coverImage: '', totalSpent: '', currency: '₹', placesVisited: '', photos: '', aiSummary: '', rating: 5 });

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  const handleAdd = () => {
    addMemory({
      tripName: newMemory.tripName,
      destination: newMemory.destination,
      dates: newMemory.dates,
      coverImage: newMemory.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
      totalSpent: parseFloat(newMemory.totalSpent) || 0,
      currency: newMemory.currency,
      placesVisited: newMemory.placesVisited.split(',').map((s) => s.trim()).filter(Boolean),
      photos: newMemory.photos.split(',').map((s) => s.trim()).filter(Boolean),
      aiSummary: newMemory.aiSummary || `An amazing trip to ${newMemory.destination}! You explored ${newMemory.placesVisited.split(',').length} places and created unforgettable memories.`,
      rating: newMemory.rating,
    });
    setNewMemory({ tripName: '', destination: '', dates: '', coverImage: '', totalSpent: '', currency: '₹', placesVisited: '', photos: '', aiSummary: '', rating: 5 });
    setIsAddOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />

      <section className="relative pt-28 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.12),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-card rounded-full text-sm font-medium text-primary mb-4"><Camera className="h-4 w-4" /> Your Journey</div>
            <h1 className="text-4xl md:text-6xl font-bold"><span className="luxury-text">Travel Memories</span></h1>
            <p className="text-muted-foreground text-lg mt-2">Your personal travel journal, achievements, and adventure stats</p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[
            { icon: Globe, label: 'Trips', value: stats.totalTrips, color: 'from-blue-500 to-cyan-500' },
            { icon: MapPin, label: 'Countries', value: stats.countriesVisited.length, color: 'from-green-500 to-emerald-500' },
            { icon: Moon, label: 'Nights Away', value: stats.nightsAway, color: 'from-purple-500 to-pink-500' },
            { icon: DollarSign, label: 'Total Spent', value: `₹${(stats.totalSpent / 1000).toFixed(0)}k`, color: 'from-amber-500 to-orange-500' },
            { icon: Trophy, label: 'Badges', value: `${unlocked.length}/${achievements.length}`, color: 'from-yellow-500 to-amber-400' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="glass-card border-border/30 group hover:border-primary/30 transition-all">
                <CardContent className="p-4 text-center">
                  <div className={`inline-flex h-10 w-10 rounded-xl bg-gradient-to-br ${stat.color} items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="memories" className="space-y-8">
          <TabsList className="glass-card p-1.5 h-auto">
            <TabsTrigger value="memories" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground px-6 py-2.5 rounded-lg gap-2"><Camera className="h-4 w-4" />Memories</TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground px-6 py-2.5 rounded-lg gap-2"><Trophy className="h-4 w-4" />Achievements</TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground px-6 py-2.5 rounded-lg gap-2"><TrendingUp className="h-4 w-4" />Timeline</TabsTrigger>
          </TabsList>

          {/* Memories Tab */}
          <TabsContent value="memories" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild><Button className="bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold"><Plus className="h-4 w-4 mr-2" />Add Memory</Button></DialogTrigger>
                <DialogContent className="glass-card border-2 border-primary/20 max-w-lg max-h-[85vh] overflow-y-auto">
                  <DialogHeader><DialogTitle className="luxury-text text-xl font-bold">Add Travel Memory</DialogTitle></DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Trip Name</Label><Input value={newMemory.tripName} onChange={(e) => setNewMemory({ ...newMemory, tripName: e.target.value })} placeholder="Summer in Bali" /></div>
                      <div className="space-y-2"><Label>Destination</Label><Input value={newMemory.destination} onChange={(e) => setNewMemory({ ...newMemory, destination: e.target.value })} placeholder="Bali, Indonesia" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Dates</Label><Input value={newMemory.dates} onChange={(e) => setNewMemory({ ...newMemory, dates: e.target.value })} placeholder="Jun 15-22, 2026" /></div>
                      <div className="space-y-2"><Label>Total Spent</Label><Input type="number" value={newMemory.totalSpent} onChange={(e) => setNewMemory({ ...newMemory, totalSpent: e.target.value })} placeholder="50000" /></div>
                    </div>
                    <div className="space-y-2"><Label>Cover Image URL</Label><Input value={newMemory.coverImage} onChange={(e) => setNewMemory({ ...newMemory, coverImage: e.target.value })} placeholder="https://..." /></div>
                    <div className="space-y-2"><Label>Places Visited (comma-separated)</Label><Input value={newMemory.placesVisited} onChange={(e) => setNewMemory({ ...newMemory, placesVisited: e.target.value })} placeholder="Ubud, Seminyak, Uluwatu" /></div>
                    <div className="space-y-2"><Label>Rating</Label>
                      <div className="flex gap-2">{[1, 2, 3, 4, 5].map((r) => <button key={r} onClick={() => setNewMemory({ ...newMemory, rating: r })} className="text-2xl">{r <= newMemory.rating ? '⭐' : '☆'}</button>)}</div>
                    </div>
                    <Button onClick={handleAdd} className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground py-6 font-semibold">Save Memory</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {memories.length === 0 ? (
              <Card className="glass-card border-2 border-dashed border-border/50">
                <CardContent className="p-16 text-center">
                  <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-40" />
                  <h3 className="text-2xl font-bold mb-3">No memories yet</h3>
                  <p className="text-muted-foreground mb-6">Complete your first trip and save it here!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {memories.map((memory, i) => (
                  <motion.div key={memory.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="overflow-hidden glass-card border-border/30 group hover:shadow-glow transition-all duration-500">
                      <div className="relative h-48 overflow-hidden">
                        <img src={memory.coverImage} alt={memory.tripName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-4 left-4">
                          <h3 className="text-xl font-bold text-white">{memory.tripName}</h3>
                          <p className="text-sm text-white/70 flex items-center gap-1"><MapPin className="h-3 w-3" />{memory.destination}</p>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-1">{Array.from({ length: memory.rating }, (_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
                      </div>
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{memory.dates}</span>
                          <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{memory.currency}{memory.totalSpent.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-foreground/80">{memory.aiSummary}</p>
                        <div className="flex flex-wrap gap-1.5">{memory.placesVisited.slice(0, 4).map((p) => <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>)}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-8">
            {unlocked.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-400" />Unlocked ({unlocked.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {unlocked.map((ach, i) => (
                    <motion.div key={ach.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                      <Card className="glass-card border-primary/20 hover:border-primary/40 transition-all group">
                        <CardContent className="p-5 text-center">
                          <div className={`inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br ${TIER_COLORS[ach.tier]} items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                            <span className="text-3xl">{ach.icon}</span>
                          </div>
                          <h4 className="font-bold text-foreground text-sm mb-1">{ach.title}</h4>
                          <p className="text-xs text-muted-foreground">{ach.description}</p>
                          <Badge className="mt-2 text-xs capitalize bg-primary/10 text-primary">{ach.tier}</Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Lock className="h-5 w-5 text-muted-foreground" />Locked ({locked.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {locked.map((ach, i) => (
                  <motion.div key={ach.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                    <Card className="glass-card border-border/30 opacity-60 hover:opacity-80 transition-all">
                      <CardContent className="p-5 text-center">
                        <div className="inline-flex h-16 w-16 rounded-2xl bg-muted/30 items-center justify-center mb-3">
                          <span className="text-3xl grayscale">{ach.icon}</span>
                        </div>
                        <h4 className="font-bold text-foreground text-sm mb-1">{ach.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{ach.description}</p>
                        <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                          <div className="h-full bg-primary/40 rounded-full" style={{ width: `${(ach.progress / ach.target) * 100}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{ach.progress}/{ach.target}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4">
            {memories.length === 0 ? (
              <Card className="glass-card border-2 border-dashed border-border/50">
                <CardContent className="p-16 text-center">
                  <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-40" />
                  <h3 className="text-2xl font-bold mb-3">Your travel timeline</h3>
                  <p className="text-muted-foreground">Your journey map will appear here as you add memories</p>
                </CardContent>
              </Card>
            ) : (
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/20" />
                {memories.map((memory, i) => (
                  <motion.div key={memory.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="relative pl-20 pb-12">
                    <div className="absolute left-5 top-2 h-7 w-7 rounded-full bg-gradient-gold flex items-center justify-center shadow-glow z-10">
                      <MapPin className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                    <Card className="glass-card border-border/30 hover:border-primary/30 transition-all">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-lg font-bold text-foreground">{memory.tripName}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-3 w-3" />{memory.destination} • {memory.dates}</p>
                          </div>
                          <Badge className="bg-primary/10 text-primary text-xs">{memory.currency}{memory.totalSpent.toLocaleString()}</Badge>
                        </div>
                        <p className="text-sm text-foreground/80 mb-3">{memory.aiSummary}</p>
                        <div className="flex flex-wrap gap-1.5">{memory.placesVisited.map((p) => <Badge key={p} variant="outline" className="text-xs">{p}</Badge>)}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default TravelMemories;
