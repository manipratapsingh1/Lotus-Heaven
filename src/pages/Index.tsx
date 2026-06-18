import { Navigation } from '@/components/Navigation';
import { RoomCard } from '@/components/RoomCard';
import { Button } from '@/components/ui/button';
import { useRooms } from '@/hooks/useRooms';
import { Sparkles, Compass, CalendarDays, DollarSign, Camera, MapPin, ArrowRight, Star } from 'lucide-react';
import heroImage from '@/assets/hero-lobby.jpg';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RoomCardSkeleton } from '@/components/LoadingSkeleton';
import { Card, CardContent } from '@/components/ui/card';
import { destinations } from '@/lib/destinationData';

const Index = () => {
  const { data: rooms = [], isLoading } = useRooms();
  const featuredRooms = rooms.slice(0, 3);
  const trendingDests = destinations.slice(0, 4);

  const platformSteps = [
    { icon: Compass, title: 'Discover', desc: 'AI finds your perfect destination', color: 'from-blue-500 to-cyan-500', link: '/discover' },
    { icon: CalendarDays, title: 'Plan', desc: 'Build your itinerary collaboratively', color: 'from-purple-500 to-pink-500', link: '/trip-planner' },
    { icon: MapPin, title: 'Book', desc: 'Reserve hotels & experiences', color: 'from-amber-500 to-orange-500', link: '/rooms' },
    { icon: DollarSign, title: 'Track', desc: 'Manage expenses & budgets', color: 'from-green-500 to-emerald-500', link: '/expenses' },
    { icon: Camera, title: 'Remember', desc: 'Save memories & earn badges', color: 'from-rose-500 to-pink-500', link: '/memories' },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle particles-bg">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[800px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-accent/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(230,25%,8%)_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(45,95%,60%,0.12),transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(280,75%,65%,0.1),transparent_40%)]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block mb-8 px-8 py-3 glass-card rounded-full border border-primary/30 animate-border-glow"
            >
              <p className="text-sm font-semibold tracking-widest uppercase text-primary">✦ Luxury Travel & Hospitality ✦</p>
            </motion.div>
            
            <h1 className="text-7xl md:text-9xl font-bold mb-6 leading-none tracking-tight">
              <span className="luxury-text">Lotus Heaven</span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-foreground/70 mb-12 max-w-2xl mx-auto font-light tracking-wide"
            >
              Discover destinations, plan trips, book stays, and create memories — all in one place
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/discover">
                <Button 
                  size="lg" 
                  className="bg-gradient-gold hover:opacity-90 text-primary-foreground text-lg px-14 py-8 shadow-glow hover:shadow-glow-accent transition-all duration-500 hover:scale-105 font-semibold rounded-2xl group"
                >
                  <Compass className="mr-2 h-5 w-5" />
                  <span>Discover Destinations</span>
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="ml-2">→</motion.span>
                </Button>
              </Link>
              <Link to="/rooms">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-primary/50 text-foreground hover:bg-primary/10 text-lg px-10 py-8 transition-all duration-300 hover:border-primary rounded-2xl backdrop-blur-sm"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Book a Suite
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Animated Decorative Elements */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.25, 0.15] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px]" 
        />
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll</span>
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-1.5 h-1.5 bg-primary rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Platform Journey Steps */}
      <section className="container mx-auto px-4 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-4 block">How It Works</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Your <span className="luxury-text">Complete Journey</span>
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-24 relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 -translate-y-1/2 z-0" />
          
          {platformSteps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="relative z-10"
            >
              <Link to={step.link}>
                <div className="premium-card text-center p-8 glass-card rounded-3xl cursor-pointer group border border-border/30 hover:border-primary/30 transition-all duration-500 hover:shadow-glow">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-3 py-0.5 rounded-full border border-border/30">
                    <span className="text-xs font-bold text-primary">0{i + 1}</span>
                  </div>
                  <motion.div 
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`h-[72px] w-[72px] mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500`}
                  >
                    <step.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-lg font-bold mb-3 text-foreground group-hover:text-primary transition-colors">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Destinations */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-primary/5">
        <motion.div className="max-w-7xl mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="text-center mb-12">
            <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-4 block">Explore the World</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="luxury-text">Trending Destinations</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Discover where travelers are heading this season</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {trendingDests.map((dest, i) => (
              <motion.div key={dest.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} whileHover={{ y: -8 }}>
                <Link to="/discover">
                  <Card className="overflow-hidden glass-card border-border/30 group hover:shadow-glow transition-all duration-500 cursor-pointer">
                    <div className="relative h-64 overflow-hidden">
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white">{dest.name}</h3>
                        <p className="text-sm text-white/70 flex items-center gap-1"><MapPin className="h-3 w-3" />{dest.country}</p>
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 glass px-3 py-1.5 rounded-full">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span className="text-xs font-bold text-foreground">{dest.rating}</span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="text-xs font-bold px-3 py-1.5 bg-gradient-gold text-primary-foreground rounded-full">
                          From {dest.budgetPerDay.currency}{dest.budgetPerDay.min.toLocaleString()}/day
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/discover">
              <Button variant="outline" size="lg" className="border-2 border-primary/50 text-foreground hover:bg-primary/10 px-10 py-6 rounded-2xl font-semibold transition-all duration-300 hover:border-primary gap-2">
                <Compass className="h-5 w-5" /> Explore All Destinations
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Suites */}
      <section className="container mx-auto px-4 pb-32 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-4 block">Our Finest Selections</span>
          <h2 className="text-5xl md:text-7xl font-bold mb-8"><span className="luxury-text">Featured Suites</span></h2>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Immerse yourself in unparalleled luxury and comfort with our handpicked collection
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15, duration: 0.7 }}>
                <RoomCardSkeleton />
              </motion.div>
            ))
          ) : (
            featuredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <RoomCard room={room} />
              </motion.div>
            ))
          )}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link to="/rooms">
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-primary/50 text-foreground hover:bg-primary/10 px-12 py-7 rounded-2xl font-semibold transition-all duration-300 hover:border-primary"
            >
              View All Suites
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="ml-2">→</motion.span>
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-card to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,hsl(45,95%,60%,0.08),transparent_60%)]" />
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h3 className="text-3xl font-bold luxury-text mb-2">Lotus Heaven</h3>
                <p className="text-xs font-semibold tracking-widest uppercase text-primary/60 mb-4">Luxury Travel & Hospitality</p>
                <p className="text-muted-foreground leading-relaxed max-w-sm">
                  Discover destinations, plan trips, book luxury stays, and create unforgettable memories — all in one place.
                </p>
              </motion.div>
            </div>
            
            {/* Travel */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Travel</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/discover" className="hover:text-primary transition-colors">Discover Destinations</Link></li>
                <li><Link to="/trip-planner" className="hover:text-primary transition-colors">Trip Planner</Link></li>
                <li><Link to="/expenses" className="hover:text-primary transition-colors">Expense Manager</Link></li>
                <li><Link to="/experiences" className="hover:text-primary transition-colors">Local Experiences</Link></li>
                <li><Link to="/memories" className="hover:text-primary transition-colors">Travel Memories</Link></li>
              </ul>
            </div>
            
            {/* Stay */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Stay</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/rooms" className="hover:text-primary transition-colors">Our Suites</Link></li>
                <li><Link to="/promotions" className="hover:text-primary transition-colors">Special Offers</Link></li>
                <li><Link to="/3d-explorer" className="hover:text-primary transition-colors">Virtual Tour</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground/60">
              © 2025 Lotus Heaven Travel. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground/60">
              <span className="hover:text-primary cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-primary cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-primary cursor-pointer transition-colors">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
