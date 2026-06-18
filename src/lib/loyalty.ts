import { Star, Award, Gift, Crown } from 'lucide-react';

export interface LoyaltyTier {
  name: string;
  minPoints: number;
  icon: any;
  color: string;
  gradientColor?: string;
  benefits: string[];
}

export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    name: 'Bronze',
    minPoints: 0,
    icon: Star,
    color: 'text-amber-600',
    gradientColor: 'from-amber-600 to-amber-400',
    benefits: ['5% room discount', 'Early check-in'],
  },
  {
    name: 'Silver',
    minPoints: 500,
    icon: Award,
    color: 'text-gray-400',
    gradientColor: 'from-gray-400 to-gray-200',
    benefits: ['10% room discount', 'Free breakfast', 'Room upgrade'],
  },
  {
    name: 'Gold',
    minPoints: 1500,
    icon: Gift,
    color: 'text-yellow-500',
    gradientColor: 'from-yellow-500 to-yellow-300',
    benefits: ['15% room discount', 'Spa access', 'Priority booking'],
  },
  {
    name: 'Platinum',
    minPoints: 5000,
    icon: Crown,
    color: 'text-purple-500',
    gradientColor: 'from-purple-500 to-purple-300',
    benefits: ['20% room discount', 'Suite upgrade', 'Personal concierge'],
  },
];

export function calculateLoyaltyPoints(bookings: any[]): number {
  if (!Array.isArray(bookings)) return 0;
  return bookings.reduce((sum, b) => {
    const status = b.status?.toUpperCase();
    if (status === 'CONFIRMED' || status === 'COMPLETED') {
      return sum + Math.floor((b.totalPrice || b.total_price || 0) / 100);
    }
    return sum;
  }, 0);
}

export function getLoyaltyTier(points: number): LoyaltyTier {
  return [...LOYALTY_TIERS].reverse().find((t) => points >= t.minPoints) || LOYALTY_TIERS[0];
}

export function getNextLoyaltyTier(currentTier: LoyaltyTier): LoyaltyTier | undefined {
  const currentIndex = LOYALTY_TIERS.findIndex((t) => t.name === currentTier.name);
  if (currentIndex === -1 || currentIndex === LOYALTY_TIERS.length - 1) {
    return undefined;
  }
  return LOYALTY_TIERS[currentIndex + 1];
}
