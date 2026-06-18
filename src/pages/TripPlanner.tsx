import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, MapPin, Users, Trash2, ThumbsUp, ThumbsDown, CheckCircle2, Circle, GripVertical, DollarSign, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTripStore, Trip, TripActivity } from '@/lib/stores/tripStore';
import { destinations } from '@/lib/destinationData';
import { ItineraryMap } from '@/components/ItineraryMap';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  sightseeing: { label: 'Sightseeing', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: '🏛️' },
  food: { label: 'Food & Drinks', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: '🍽️' },
  transport: { label: 'Transport', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', icon: '🚗' },
  hotel: { label: 'Hotel', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: '🏨' },
  adventure: { label: 'Adventure', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '🧗' },
  rest: { label: 'Rest', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30', icon: '😴' },
  shopping: { label: 'Shopping', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30', icon: '🛍️' },
};

const TripPlanner = () => {
  const { trips, addTrip, deleteTrip, addActivity, deleteActivity, voteActivity, toggleActivityComplete, updateTrip } = useTripStore();
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [activityDay, setActivityDay] = useState(1);
  const [activeDay, setActiveDay] = useState(1);
  const [newTrip, setNewTrip] = useState({ name: '', destination: '', startDate: '', endDate: '', budget: '', currency: '₹', coverImage: '' });
  const [newActivity, setNewActivity] = useState({ time: '09:00', title: '', category: 'sightseeing' as TripActivity['category'], location: '', cost: '', notes: '' });

  const currentTrip = trips.find((t) => t.id === selectedTrip);

  const handleSelectTrip = (id: string | null) => {
    setSelectedTrip(id);
    setActiveDay(1);
  };

  const handleCreateTrip = () => {
    const destMatch = destinations.find((d) => d.name.toLowerCase() === newTrip.destination.toLowerCase());
    addTrip({
      name: newTrip.name || `Trip to ${newTrip.destination}`,
      destination: newTrip.destination,
      startDate: newTrip.startDate,
      endDate: newTrip.endDate,
      budget: parseFloat(newTrip.budget) || 0,
      currency: newTrip.currency,
      coverImage: destMatch?.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
      collaborators: [{ name: 'You', avatar: '👤' }],
      status: 'planning',
    });
    setNewTrip({ name: '', destination: '', startDate: '', endDate: '', budget: '', currency: '₹', coverImage: '' });
    setIsCreateOpen(false);
  };

  const handleAddActivity = () => {
    if (!selectedTrip || !newActivity.title) return;
    addActivity(selectedTrip, {
      day: activityDay,
      time: newActivity.time,
      title: newActivity.title,
      category: newActivity.category,
      location: newActivity.location,
      cost: parseFloat(newActivity.cost) || 0,
      notes: newActivity.notes,
    });
    setNewActivity({ time: '09:00', title: '', category: 'sightseeing', location: '', cost: '', notes: '' });
    setIsAddActivityOpen(false);
  };

  const getTripDays = (trip: Trip): number => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const getTripTotalCost = (trip: Trip): number => trip.activities.reduce((sum, a) => sum + a.cost, 0);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />

      <section className="relative pt-28 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.12),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-card rounded-full text-sm font-medium text-primary mb-4">
                <Sparkles className="h-4 w-4" /> Collaborative Planning
              </div>
              <h1 className="text-4xl md:text-6xl font-bold"><span className="luxury-text">Trip Planner</span></h1>
              <p className="text-muted-foreground text-lg mt-2">Plan, organize, and share your dream trips</p>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold px-8 py-6">
                  <Plus className="h-5 w-5 mr-2" /> Create Trip
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-2 border-primary/20">
                <DialogHeader><DialogTitle className="text-2xl font-bold luxury-text">Create New Trip</DialogTitle></DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Trip Name</Label><Input value={newTrip.name} onChange={(e) => setNewTrip({ ...newTrip, name: e.target.value })} placeholder="Summer Vacation" /></div>
                    <div className="space-y-2"><Label>Destination</Label><Input value={newTrip.destination} onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })} placeholder="Bali, Paris, Tokyo..." /></div>
                    <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={newTrip.startDate} onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })} /></div>
                    <div className="space-y-2"><Label>End Date</Label><Input type="date" value={newTrip.endDate} onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Budget</Label><Input type="number" value={newTrip.budget} onChange={(e) => setNewTrip({ ...newTrip, budget: e.target.value })} placeholder="50000" /></div>
                    <div className="space-y-2 flex flex-col justify-end">
                      <Label className="mb-1">Currency</Label>
                      <Select value={newTrip.currency} onValueChange={(val) => setNewTrip({ ...newTrip, currency: val })}>
                        <SelectTrigger className="w-full bg-background border-input rounded-md h-10">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border border-primary/20">
                          <SelectItem value="₹">₹ INR</SelectItem>
                          <SelectItem value="$">$ USD</SelectItem>
                          <SelectItem value="€">€ EUR</SelectItem>
                          <SelectItem value="£">£ GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleCreateTrip} className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground py-6 font-semibold">Create Trip</Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        {!selectedTrip ? (
          /* Trip List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {trips.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full">
                <Card className="glass-card border-2 border-dashed border-border/50">
                  <CardContent className="p-16 text-center">
                    <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-40" />
                    <h3 className="text-2xl font-bold mb-3">No trips yet</h3>
                    <p className="text-muted-foreground mb-6">Start planning your next adventure!</p>
                    <Button onClick={() => setIsCreateOpen(true)} className="bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold"><Plus className="h-4 w-4 mr-2" /> Create Your First Trip</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              trips.map((trip, i) => (
                <motion.div key={trip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="overflow-hidden glass-card border-border/30 group cursor-pointer hover:border-primary/30 hover:shadow-glow transition-all duration-500" onClick={() => handleSelectTrip(trip.id)}>
                    <div className="relative h-44 overflow-hidden">
                      <img src={trip.coverImage} alt={trip.destination} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                      <Badge className={`absolute top-4 right-4 ${trip.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : trip.status === 'completed' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                        {trip.status}
                      </Badge>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-bold text-white">{trip.name}</h3>
                        <p className="text-sm text-white/70 flex items-center gap-1"><MapPin className="h-3 w-3" />{trip.destination}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" /><span className="text-muted-foreground">{getTripDays(trip)} days</span></div>
                        <div className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-primary" /><span className="text-muted-foreground">{trip.currency}{trip.budget.toLocaleString()}</span></div>
                        <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" /><span className="text-muted-foreground">{trip.collaborators.length}</span></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        ) : currentTrip ? (
          /* Trip Detail View */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => handleSelectTrip(null)}>← Back</Button>
                <div>
                  <h2 className="text-3xl font-bold text-foreground">{currentTrip.name}</h2>
                  <p className="text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" />{currentTrip.destination} • {getTripDays(currentTrip)} days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="glass-card rounded-xl px-4 py-2 text-sm">
                  <span className="text-muted-foreground">Budget: </span>
                  <span className="font-bold text-foreground">{currentTrip.currency}{currentTrip.budget.toLocaleString()}</span>
                  <span className="text-muted-foreground"> • Spent: </span>
                  <span className={`font-bold ${getTripTotalCost(currentTrip) > currentTrip.budget ? 'text-destructive' : 'text-green-400'}`}>{currentTrip.currency}{getTripTotalCost(currentTrip).toLocaleString()}</span>
                </div>
                {/* Collaborators */}
                <div className="flex -space-x-2">
                  {currentTrip.collaborators.map((c, i) => (
                    <div key={i} className="h-9 w-9 rounded-full bg-gradient-gold flex items-center justify-center text-sm border-2 border-background" title={c.name}>{c.avatar}</div>
                  ))}
                  <button className="h-9 w-9 rounded-full glass-card flex items-center justify-center text-xs border-2 border-background hover:border-primary/50 transition-colors">+</button>
                </div>
                <Button variant="destructive" size="sm" onClick={() => { deleteTrip(currentTrip.id); handleSelectTrip(null); }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Budget Progress Bar */}
            <Card className="glass-card mb-8 border-border/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Budget Progress</span>
                  <span className="text-sm font-bold">{Math.round((getTripTotalCost(currentTrip) / currentTrip.budget) * 100) || 0}%</span>
                </div>
                <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (getTripTotalCost(currentTrip) / currentTrip.budget) * 100)}%` }} transition={{ duration: 1 }}
                    className={`h-full rounded-full ${getTripTotalCost(currentTrip) > currentTrip.budget ? 'bg-destructive' : getTripTotalCost(currentTrip) > currentTrip.budget * 0.8 ? 'bg-amber-500' : 'bg-gradient-to-r from-primary to-accent'}`} />
                </div>
                {getTripTotalCost(currentTrip) > currentTrip.budget * 0.8 && getTripTotalCost(currentTrip) <= currentTrip.budget && (
                  <p className="text-xs text-amber-400 mt-2">⚠️ You're approaching your budget limit</p>
                )}
                {getTripTotalCost(currentTrip) > currentTrip.budget && (
                  <p className="text-xs text-destructive mt-2">🚨 You've exceeded your budget by {currentTrip.currency}{(getTripTotalCost(currentTrip) - currentTrip.budget).toLocaleString()}</p>
                )}
              </CardContent>
            </Card>

            {/* Itinerary Title & Add Activity Button */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Itinerary</h3>
              <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
                <DialogTrigger asChild><Button className="bg-gradient-gold hover:opacity-90 text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Add Activity</Button></DialogTrigger>
                <DialogContent className="glass-card border-2 border-primary/20">
                  <DialogHeader><DialogTitle className="luxury-text text-xl font-bold">Add Activity</DialogTitle></DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Day</Label><Input type="number" min={1} max={getTripDays(currentTrip)} value={activityDay} onChange={(e) => setActivityDay(parseInt(e.target.value) || 1)} /></div>
                      <div className="space-y-2"><Label>Time</Label><Input type="time" value={newActivity.time} onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })} /></div>
                    </div>
                    <div className="space-y-2"><Label>Activity</Label><Input value={newActivity.title} onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })} placeholder="Visit Eiffel Tower" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 flex flex-col justify-end">
                        <Label className="mb-1">Category</Label>
                        <Select value={newActivity.category} onValueChange={(val) => setNewActivity({ ...newActivity, category: val as TripActivity['category'] })}>
                          <SelectTrigger className="w-full bg-background border-input rounded-md h-10">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="glass-card border border-primary/20">
                            {Object.entries(CATEGORY_CONFIG).map(([key, val]) => (
                              <SelectItem key={key} value={key}>
                                {val.icon} {val.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>Cost</Label><Input type="number" value={newActivity.cost} onChange={(e) => setNewActivity({ ...newActivity, cost: e.target.value })} placeholder="0" /></div>
                    </div>
                    <div className="space-y-2"><Label>Location</Label><Input value={newActivity.location} onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })} placeholder="City center" /></div>
                    <Button onClick={handleAddActivity} className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground py-6 font-semibold">Add Activity</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Split layout: Itinerary left, map right */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Itinerary Days */}
              <div className="lg:col-span-2 space-y-6">
                {Array.from({ length: getTripDays(currentTrip) }, (_, i) => i + 1).map((day) => {
                  const dayActivities = currentTrip.activities.filter((a) => a.day === day).sort((a, b) => a.time.localeCompare(b.time));
                  const dayDate = new Date(currentTrip.startDate);
                  dayDate.setDate(dayDate.getDate() + day - 1);
                  return (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: day * 0.05 }}
                      onClick={() => setActiveDay(day)}
                      className="cursor-pointer"
                    >
                      <Card className={`glass-card transition-all duration-300 border-border/30 ${
                        activeDay === day ? 'border-primary/60 ring-1 ring-primary/40 shadow-glow' : 'hover:border-primary/20'
                      }`}>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-gradient-gold flex items-center justify-center text-primary-foreground font-bold">{day}</div>
                              <div>
                                <span className="text-lg font-bold">Day {day}</span>
                                <p className="text-xs text-muted-foreground">{dayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setActivityDay(day); setIsAddActivityOpen(true); }}><Plus className="h-4 w-4" /></Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {dayActivities.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4 text-center">No activities planned yet</p>
                          ) : (
                            <div className="space-y-3">
                              {dayActivities.map((activity) => {
                                const cat = CATEGORY_CONFIG[activity.category];
                                return (
                                  <motion.div key={activity.id} layout className="flex items-center gap-3 p-3 glass rounded-xl group hover:bg-primary/5 transition-colors" onClick={(e) => e.stopPropagation()}>
                                    <GripVertical className="h-4 w-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                                    <button onClick={() => toggleActivityComplete(currentTrip.id, activity.id)} className="flex-shrink-0">
                                      {activity.completed ? <CheckCircle2 className="h-5 w-5 text-green-400" /> : <Circle className="h-5 w-5 text-muted-foreground/40" />}
                                    </button>
                                    <span className="text-sm text-muted-foreground font-mono w-14">{activity.time}</span>
                                    <Badge variant="outline" className={`text-xs ${cat.color}`}>{cat.icon} {cat.label}</Badge>
                                    <span className={`flex-1 text-sm font-medium ${activity.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{activity.title}</span>
                                    {activity.location && <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{activity.location}</span>}
                                    {activity.cost > 0 && <span className="text-xs font-semibold text-primary">{currentTrip.currency}{activity.cost}</span>}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => voteActivity(currentTrip.id, activity.id, 'up')} className="p-1 hover:bg-green-500/20 rounded"><ThumbsUp className="h-3.5 w-3.5 text-green-400" /></button>
                                      <span className="text-xs text-muted-foreground min-w-[20px] text-center">{activity.votes.up - activity.votes.down}</span>
                                      <button onClick={() => voteActivity(currentTrip.id, activity.id, 'down')} className="p-1 hover:bg-red-500/20 rounded"><ThumbsDown className="h-3.5 w-3.5 text-red-400" /></button>
                                      <button onClick={() => deleteActivity(currentTrip.id, activity.id)} className="p-1 hover:bg-destructive/20 rounded ml-1"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Right Column: Sticky Itinerary Map */}
              <div className="lg:col-span-1">
                <div className="sticky top-28 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Interactive Route Map</h4>
                    {/* Day quick selection bubbles */}
                    <div className="flex items-center gap-1 bg-background/50 border border-border/40 rounded-lg p-1 max-w-full overflow-x-auto">
                      {Array.from({ length: getTripDays(currentTrip) }, (_, i) => i + 1).map((d) => (
                        <button
                          key={d}
                          onClick={() => setActiveDay(d)}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded transition-colors ${
                            activeDay === d
                              ? 'bg-gradient-gold text-primary-foreground shadow'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          D{d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ItineraryMap
                    activities={currentTrip.activities.filter((a) => a.day === activeDay)}
                    currency={currentTrip.currency}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </section>
    </div>
  );
};

export default TripPlanner;
