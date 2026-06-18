import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, CreditCard, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { useCreateBooking } from '@/hooks/useBookings';
import { Room } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/stores/authStore';
import { bookingsApi, paymentsApi } from '@/lib/api-client';
import { calculateLoyaltyPoints, getLoyaltyTier } from '@/lib/loyalty';

interface BookingFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room;
}

type Step = 'details' | 'payment' | 'confirmation';

export const BookingFlow = ({ open, onOpenChange, room }: BookingFlowProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('details');
  const { isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: '',
  });

  const createBooking = useCreateBooking();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (open && isAuthenticated) {
      bookingsApi.getAll()
        .then((data) => {
          setBookings(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error('Error fetching bookings for discount:', err));
    }
  }, [open, isAuthenticated]);

  const points = calculateLoyaltyPoints(bookings);
  const currentTier = getLoyaltyTier(points);
  const discountPercent = currentTier.name === 'Platinum' ? 0.20 : currentTier.name === 'Gold' ? 0.15 : currentTier.name === 'Silver' ? 0.10 : 0.05;

  useEffect(() => {
    if (open && !isAuthenticated) {
      toast.error('Please sign in to make a booking');
      onOpenChange(false);
      navigate('/auth');
    }
  }, [open, isAuthenticated, navigate, onOpenChange]);

  const handleNext = () => {
    if (step === 'details') {
      if (!formData.guestName || !formData.guestEmail || !formData.checkIn || !formData.checkOut) {
        toast.error('Please fill in all required fields');
        return;
      }
      setStep('payment');
    }
  };

  const handleConfirm = async () => {
    try {
      const booking = await createBooking.mutateAsync({
        roomId: room.id,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,
        specialRequests: formData.specialRequests,
      });
      
      // Try to initiate Razorpay checkout
      try {
        const order = await paymentsApi.createOrder(booking.id);
        
        if (order?.orderId) {
          // Open Razorpay checkout popup
          const options = {
            key: order.keyId,
            amount: order.amount,
            currency: order.currency,
            name: 'Lotus Heaven',
            description: `Booking: ${room.name}`,
            order_id: order.orderId,
            prefill: order.prefill,
            theme: { color: '#D4AF37' },
            handler: async (response: any) => {
              // Verify payment on backend
              try {
                await paymentsApi.verifyPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                });
                setStep('confirmation');
                toast.success('Payment successful! Booking confirmed.');
              } catch {
                toast.error('Payment verification failed. Contact support.');
              }
            },
            modal: {
              ondismiss: () => {
                toast.error('Payment cancelled');
              },
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
          return;
        }
      } catch {
        // Razorpay not configured — proceed with direct confirmation
      }

      // If no Razorpay, show confirmation directly
      setStep('confirmation');
      toast.success('Booking confirmed successfully!');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to create booking. Please try again.';
      toast.error(Array.isArray(message) ? message.join(', ') : message);
    }
  };

  const calculateNights = () => {
    if (formData.checkIn && formData.checkOut) {
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  const basePrice = calculateNights() * room.price;
  const discountAmount = Math.round(basePrice * discountPercent * 100) / 100;
  const totalPrice = Math.max(0, basePrice - discountAmount);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl glass-card border-2 border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-gold bg-clip-text text-transparent">
            {step === 'details' && 'Booking Details'}
            {step === 'payment' && 'Payment Information'}
            {step === 'confirmation' && 'Booking Confirmed!'}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guestName" className="flex items-center gap-2 text-foreground">
                    <User className="h-4 w-4 text-primary" />
                    Full Name *
                  </Label>
                  <Input
                    id="guestName"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    className="bg-background/50 border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestEmail" className="flex items-center gap-2 text-foreground">
                    <Mail className="h-4 w-4 text-primary" />
                    Email *
                  </Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    value={formData.guestEmail}
                    onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                    className="bg-background/50 border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestPhone" className="flex items-center gap-2 text-foreground">
                    <Phone className="h-4 w-4 text-primary" />
                    Phone
                  </Label>
                  <Input
                    id="guestPhone"
                    type="tel"
                    value={formData.guestPhone}
                    onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                    className="bg-background/50 border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guests" className="flex items-center gap-2 text-foreground">
                    Guests
                  </Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max={room.capacity}
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                    className="bg-background/50 border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkIn" className="flex items-center gap-2 text-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    Check-in *
                  </Label>
                  <Input
                    id="checkIn"
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    className="bg-background/50 border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkOut" className="flex items-center gap-2 text-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    Check-out *
                  </Label>
                  <Input
                    id="checkOut"
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    className="bg-background/50 border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requests" className="flex items-center gap-2 text-foreground">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Special Requests
                </Label>
                <Textarea
                  id="requests"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  className="bg-background/50 border-border min-h-[100px]"
                  placeholder="Any special requirements or preferences..."
                />
              </div>

              <div className="glass-card rounded-xl p-6 space-y-3 border-primary/10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Room Rate</span>
                  <span className="font-semibold text-foreground">
                    ₹{room.price} / night
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nights</span>
                  <span className="font-semibold text-foreground">{calculateNights()}</span>
                </div>
                {basePrice > 0 && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Loyalty Discount ({currentTier.name} - {Math.round(discountPercent * 100)}%)</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-2" />
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-bold bg-gradient-gold bg-clip-text text-transparent text-2xl">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button onClick={handleNext} className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground py-6 text-lg font-semibold">
                Continue to Payment
              </Button>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="glass rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">Secure Payment</h3>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  A secure Razorpay payment popup will open to complete your payment. Supports UPI, Cards, Net Banking &amp; Wallets.
                </p>
              </div>

              <div className="glass rounded-xl p-6">
                <h4 className="font-bold text-foreground mb-4">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{room.name}</span>
                    <span className="text-foreground">₹{room.price}/night</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {formData.checkIn} - {formData.checkOut}
                    </span>
                    <span className="text-foreground">{calculateNights()} nights</span>
                  </div>
                  {basePrice > 0 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Loyalty Discount ({currentTier.name})</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="h-px bg-border my-3" />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-foreground">Total</span>
                    <span className="bg-gradient-gold bg-clip-text text-transparent">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep('details')} variant="outline" className="flex-1 py-6">
                  Back
                </Button>
                <Button onClick={handleConfirm} className="flex-1 bg-gradient-gold hover:opacity-90 text-primary-foreground py-6 font-semibold">
                  Confirm & Pay
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'confirmation' && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-8"
            >
              <div className="h-24 w-24 mx-auto rounded-full bg-gradient-gold flex items-center justify-center shadow-glow">
                <svg className="h-12 w-12 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h3>
                <p className="text-muted-foreground">
                  A confirmation email has been sent to {formData.guestEmail}
                </p>
              </div>

              <div className="glass rounded-xl p-6 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Room</span>
                  <span className="font-semibold text-foreground">{room.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Check-in</span>
                  <span className="font-semibold text-foreground">{formData.checkIn}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Check-out</span>
                  <span className="font-semibold text-foreground">{formData.checkOut}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-bold text-primary">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <Button onClick={() => onOpenChange(false)} className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground py-6">
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
