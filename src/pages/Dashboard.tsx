import { Navigation } from '@/components/Navigation';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Star, Award, Clock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { bookingsApi } from '@/lib/api-client';
import { EnhancedLoyaltyDashboard } from '@/components/EnhancedLoyaltyDashboard';
import { DashboardSkeleton } from '@/components/LoadingSkeleton';
import { calculateLoyaltyPoints, getLoyaltyTier } from '@/lib/loyalty';

const Dashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    const fetchBookings = async () => {
      try {
        const data = await bookingsApi.getAll();
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, authLoading, navigate]);

  const loyaltyPoints = calculateLoyaltyPoints(bookings);
  const loyaltyTier = getLoyaltyTier(loyaltyPoints).name;

  const upcomingBookings = bookings.filter(b => {
    const status = b.status?.toUpperCase();
    return (status === 'CONFIRMED' || status === 'PENDING') && new Date(b.checkIn || b.check_in) > new Date();
  });
  const pastBookings = bookings.filter(b => {
    const status = b.status?.toUpperCase();
    return status === 'COMPLETED' || status === 'CANCELLED' || new Date(b.checkOut || b.check_out) < new Date();
  });

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': return 'bg-success/20 text-success border-success/30';
      case 'PENDING': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      case 'CANCELLED': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-28 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          >
            <div>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 glass-card rounded-full text-sm font-medium text-primary mb-4"
              >
                <Sparkles className="h-4 w-4" />
                Welcome Back
              </motion.span>
              <h1 className="text-4xl md:text-6xl font-bold mb-2">
                <span className="luxury-text">My Dashboard</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage your bookings and track your loyalty rewards
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-24">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Calendar, label: 'Upcoming Stays', value: upcomingBookings.length, color: 'from-blue-500 to-cyan-500' },
            { icon: CheckCircle2, label: 'Past Bookings', value: pastBookings.length, color: 'from-green-500 to-emerald-500' },
            { icon: Star, label: 'Total Stays', value: bookings.length, color: 'from-amber-500 to-orange-500' },
            { icon: Award, label: 'Loyalty Tier', value: loyaltyTier, color: 'from-purple-500 to-pink-500' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass-card border-border/30 hover:border-primary/30 transition-all duration-300 group">
                <CardContent className="p-5">
                  <div className={`inline-flex h-11 w-11 rounded-xl bg-gradient-to-br ${stat.color} items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="glass-card p-1.5 h-auto">
            <TabsTrigger value="bookings" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground px-6 py-2.5 rounded-lg">
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground px-6 py-2.5 rounded-lg">
              Loyalty Program
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                Upcoming Stays
              </h2>
              
              {upcomingBookings.length === 0 ? (
                <Card className="glass-card border-2 border-dashed border-border/50">
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">No Upcoming Bookings</h3>
                    <p className="text-muted-foreground mb-6">
                      Book your next luxury stay and start earning rewards
                    </p>
                    <Link to="/rooms">
                      <Button className="bg-gradient-gold hover:opacity-90 font-semibold">
                        Explore Rooms
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {upcomingBookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="glass-card border-primary/20 hover:border-primary/40 transition-all">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden">
                              <img
                                src={booking.room?.images?.[0]?.url || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&q=80'}
                                alt={booking.room?.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-xl font-bold text-foreground">{booking.room?.name}</h3>
                                  <Badge className={`mt-2 ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                  </Badge>
                                </div>
                                <p className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                                  ₹{booking.totalPrice}
                                </p>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-primary" />
                                  <div>
                                    <p className="text-muted-foreground">Check-in</p>
                                    <p className="font-semibold">{new Date(booking.checkIn).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-primary" />
                                  <div>
                                    <p className="text-muted-foreground">Check-out</p>
                                    <p className="font-semibold">{new Date(booking.checkOut).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-primary" />
                                  <div>
                                    <p className="text-muted-foreground">Booking ID</p>
                                    <p className="font-semibold font-mono">#{booking.id.slice(0, 8)}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex gap-2 pt-2">
                                <Button variant="outline" size="sm">View Details</Button>
                                <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                                  Cancel Booking
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {pastBookings.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  Past Stays
                </h2>
                
                <div className="grid gap-4">
                  {pastBookings.slice(0, 3).map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="glass-card opacity-80 hover:opacity-100 transition-opacity">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all">
                              <img
                                src={booking.room?.images?.[0]?.url || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&q=80'}
                                alt={booking.room?.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-xl font-bold text-foreground">{booking.room?.name}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge variant="outline" className="border-success/30 text-success">
                                  Completed
                                </Badge>
                              </div>
                              
                              <Button variant="outline" size="sm" className="gap-2">
                                <Star className="h-4 w-4" />
                                Leave a Review
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Loyalty Tab */}
          <TabsContent value="loyalty">
            <EnhancedLoyaltyDashboard bookings={bookings} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Dashboard;
