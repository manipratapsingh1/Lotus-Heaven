import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { LOYALTY_TIERS, calculateLoyaltyPoints, getLoyaltyTier, getNextLoyaltyTier } from '@/lib/loyalty';

interface EnhancedLoyaltyDashboardProps {
  bookings?: any[];
}

export const EnhancedLoyaltyDashboard = ({ bookings = [] }: EnhancedLoyaltyDashboardProps) => {
  const points = calculateLoyaltyPoints(bookings);
  const currentTier = getLoyaltyTier(points);
  const nextTier = getNextLoyaltyTier(currentTier);
  const progress = nextTier
    ? ((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass-card border-primary/20 overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${currentTier.gradientColor}`} />
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your Points</p>
                <p className="text-5xl font-bold bg-gradient-gold bg-clip-text text-transparent">{points}</p>
              </div>
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${currentTier.gradientColor} flex items-center justify-center`}>
                <currentTier.icon className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{currentTier.name}</span>
                {nextTier && <span className="text-muted-foreground">{nextTier.name}</span>}
              </div>
              <Progress value={progress} className="h-3" />
              {nextTier && (
                <p className="text-xs text-muted-foreground text-center">
                  {nextTier.minPoints - points} points to reach {nextTier.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Current Benefits */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Your Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentTier.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-primary/5">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tier Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              All Tiers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {LOYALTY_TIERS.map((tier) => (
                <Card key={tier.name} className={`${points >= tier.minPoints ? 'border-primary/30 shadow-sm' : 'opacity-40'} transition-all`}>
                  <CardContent className="p-4 text-center">
                    <div className={`h-12 w-12 mx-auto rounded-xl bg-gradient-to-br ${tier.gradientColor} flex items-center justify-center mb-3`}>
                      <tier.icon className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-bold text-sm">{tier.name}</p>
                    <p className="text-xs text-muted-foreground">{tier.minPoints}+ pts</p>
                    {points >= tier.minPoints && (
                      <Badge variant="outline" className="mt-2 text-xs border-primary/30 text-primary">
                        Unlocked
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

