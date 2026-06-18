import { motion, useInView } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Shield, Zap, Crown, Award, Clock } from 'lucide-react';
import { useRef } from 'react';

export const PremiumFeatures = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const features = [
    {
      icon: Sparkles,
      title: 'Smart Experience',
      description: 'Smart recommendations and intelligent room matching tailored to your preferences and travel style',
    },
    {
      icon: Shield,
      title: 'Premium Security',
      description: 'Bank-level encryption and secure payment processing for complete peace of mind',
    },
    {
      icon: Zap,
      title: 'Instant Booking',
      description: 'Lightning-fast reservations with real-time availability and immediate confirmation',
    },
    {
      icon: Crown,
      title: 'VIP Treatment',
      description: 'Exclusive perks, priority service, and dedicated concierge for every guest',
    },
    {
      icon: Award,
      title: 'Loyalty Rewards',
      description: 'Earn points on every stay and unlock exclusive benefits and room upgrades',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock assistance from our dedicated concierge and support team',
    },
  ];

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto relative z-10"
      >
        <div className="text-center mb-20">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            transition={{ duration: 0.6, type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-3 glass-card px-8 py-4 rounded-full mb-8 border-primary/20"
          >
            <Crown className="h-6 w-6 text-primary animate-pulse" />
            <span className="text-base font-bold bg-gradient-gold bg-clip-text text-transparent">
              Premium Experience
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-gold bg-clip-text text-transparent"
          >
            Luxury Redefined
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Experience unparalleled service and exclusive benefits designed for discerning travelers
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.5 + (index * 0.1),
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Card className="glass-card border-primary/20 hover:border-primary/40 transition-all duration-500 h-full group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <CardContent className="p-8 relative z-10">
                  <motion.div 
                    className="h-16 w-16 rounded-2xl bg-gradient-gold flex items-center justify-center mb-6 shadow-glow-accent"
                    whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                  >
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:bg-gradient-gold group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
