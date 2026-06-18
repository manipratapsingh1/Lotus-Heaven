import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LOYALTY_TIERS, calculateLoyaltyPoints, getLoyaltyTier, getNextLoyaltyTier } from '@/lib/loyalty';

interface LoyaltyProgramProps {
  bookings?: any[];
}

export const LoyaltyProgram = ({ bookings = [] }: LoyaltyProgramProps) => {
  const points = calculateLoyaltyPoints(bookings);
  const currentTier = getLoyaltyTier(points);
  const nextTier = getNextLoyaltyTier(currentTier);
  const progress = nextTier 
    ? ((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100 
    : 100;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <currentTier.icon className={`h-6 w-6 ${currentTier.color}`} />
          Loyalty Program
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent">
            {points}
          </p>
          <p className="text-muted-foreground">Total Points</p>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <Badge variant="outline" className="gap-1">
              <currentTier.icon className={`h-3 w-3 ${currentTier.color}`} />
              {currentTier.name}
            </Badge>
            {nextTier && (
              <Badge variant="outline" className="gap-1">
                <nextTier.icon className={`h-3 w-3 ${nextTier.color}`} />
                {nextTier.name}
              </Badge>
            )}
          </div>
          <Progress value={progress} className="h-3" />
          {nextTier && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {nextTier.minPoints - points} points to {nextTier.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {LOYALTY_TIERS.map(tier => (
            <Card key={tier.name} className={`${points >= tier.minPoints ? 'border-primary/30' : 'opacity-50'}`}>
              <CardContent className="p-3 text-center">
                <tier.icon className={`h-5 w-5 mx-auto mb-1 ${tier.color}`} />
                <p className="text-sm font-semibold">{tier.name}</p>
                <p className="text-xs text-muted-foreground">{tier.minPoints}+ pts</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

