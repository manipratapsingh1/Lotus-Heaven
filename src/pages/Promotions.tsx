import { Navigation } from '@/components/Navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Percent, Gift, Sparkles, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Promotions = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 15,
    minutes: 30,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const promotions = [
    {
      id: 1,
      title: 'Early Bird Special',
      description: 'Book 30 days in advance and save up to 35% on your stay',
      discount: '35%',
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
      validUntil: 'December 31, 2025',
      featured: true,
      code: 'EARLY35',
    },
    {
      id: 2,
      title: 'Weekend Luxury Escape',
      description: 'Stay 2 nights on weekends and get the 3rd night free',
      discount: '33%',
      icon: Calendar,
      color: 'from-purple-500 to-pink-600',
      validUntil: 'Ongoing',
      featured: true,
      code: 'WEEKEND3',
    },
    {
      id: 3,
      title: 'Extended Stay Bonus',
      description: 'Book 7+ nights and receive complimentary spa treatment',
      discount: 'Free Spa',
      icon: Gift,
      color: 'from-blue-500 to-cyan-600',
      validUntil: 'Limited Time',
      featured: false,
      code: 'LONGSTAY',
    },
    {
      id: 4,
      title: 'Group Booking Deal',
      description: 'Book 3+ rooms and save 25% on total booking',
      discount: '25%',
      icon: Users,
      color: 'from-green-500 to-emerald-600',
      validUntil: 'Year Round',
      featured: false,
      code: 'GROUP25',
    },
    {
      id: 5,
      title: 'Flash Sale',
      description: 'Limited rooms available at unbeatable prices',
      discount: '50%',
      icon: Sparkles,
      color: 'from-red-500 to-rose-600',
      validUntil: 'Ends Soon!',
      featured: true,
      code: 'FLASH50',
    },
    {
      id: 6,
      title: 'Loyalty Reward',
      description: 'Members get an extra 10% off on all bookings',
      discount: '10%',
      icon: Percent,
      color: 'from-indigo-500 to-purple-600',
      validUntil: 'Members Only',
      featured: false,
      code: 'LOYAL10',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-gradient-gold text-primary-foreground px-6 py-2 text-sm font-bold">
              🎉 Special Offers
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-gold bg-clip-text text-transparent">
              Exclusive Deals & Promotions
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Unlock incredible savings on your dream luxury stay
            </p>
          </motion.div>

          {/* Countdown Timer for Flash Sale */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto mt-12"
          >
            <Card className="glass-card border-2 border-accent/30 shadow-glow-accent">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-accent mb-2">⚡ Flash Sale Ending In</h3>
                  <p className="text-muted-foreground">Don't miss out on 50% off!</p>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Minutes', value: timeLeft.minutes },
                    { label: 'Seconds', value: timeLeft.seconds }
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="text-center"
                    >
                      <div className="glass-card border border-primary/20 rounded-xl p-4 mb-2">
                        <span className="text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                          {String(item.value).padStart(2, '0')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Promotions Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Card className={`glass-card border-2 h-full relative overflow-hidden group ${
                promo.featured ? 'border-primary/40' : 'border-border/30'
              }`}>
                {promo.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-accent text-accent-foreground font-bold">
                      Featured
                    </Badge>
                  </div>
                )}
                
                <div className={`absolute inset-0 bg-gradient-to-br ${promo.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <CardHeader>
                  <div className={`inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br ${promo.color} items-center justify-center mb-4 shadow-glow group-hover:scale-110 transition-transform duration-300`}>
                    <promo.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl group-hover:bg-gradient-gold group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {promo.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      {promo.discount} OFF
                    </Badge>
                    <span className="text-xs text-muted-foreground">Code: {promo.code}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {promo.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">Valid until: {promo.validUntil}</span>
                  </div>
                  
                  <Link to="/rooms">
                    <Button className="w-full bg-gradient-gold hover:opacity-90 font-semibold shadow-glow group-hover:shadow-glow-accent transition-all duration-300">
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Terms Section */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass-card border border-border/30 rounded-2xl p-8"
        >
          <h3 className="text-xl font-bold mb-4">Terms & Conditions</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• All promotions are subject to availability and may be modified without notice</li>
            <li>• Discounts cannot be combined unless explicitly stated</li>
            <li>• Early bird bookings must be made at least 30 days in advance</li>
            <li>• Promotional rates exclude taxes and resort fees</li>
            <li>• Loyalty member discounts apply automatically at checkout</li>
          </ul>
        </motion.div>
      </section>
    </div>
  );
};

export default Promotions;
