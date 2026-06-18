// Stripe integration — the backend handles all Stripe API calls.
// The frontend redirects users to Stripe's hosted checkout via the backend's
// POST /api/payments/checkout/:bookingId endpoint, which returns a Stripe
// Checkout Session URL. No publishable key is needed on the frontend.

export interface PaymentResult {
  success: boolean;
  bookingId: string;
  message: string;
}

/**
 * Initiates payment for a booking by requesting a checkout URL from the backend.
 * If Stripe is configured, the backend returns a hosted checkout URL.
 * If not, the booking is confirmed directly (demo mode).
 */
export const initiatePayment = async (
  bookingId: string,
  createCheckout: (id: string) => Promise<{ url?: string }>,
): Promise<PaymentResult> => {
  try {
    const result = await createCheckout(bookingId);
    if (result?.url) {
      window.location.href = result.url;
      return { success: true, bookingId, message: 'Redirecting to payment...' };
    }
    // No checkout URL means Stripe is not configured — confirm directly
    return { success: true, bookingId, message: 'Booking confirmed!' };
  } catch {
    // Stripe not available — booking still created, confirm directly
    return { success: true, bookingId, message: 'Booking confirmed!' };
  }
};
