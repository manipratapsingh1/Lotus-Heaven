import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { mockBookings } from '@/lib/mock-data';

export const useBookings = (scope?: string) => {
  return useQuery({
    queryKey: ['bookings', scope],
    queryFn: async () => {
      try {
        const result = await bookingsApi.getAll();
        return Array.isArray(result) ? result : (result?.data ?? result ?? []);
      } catch {
        // Backend unavailable or unauthorized — use mock data
        return [...mockBookings];
      }
    },
    retry: false,
    staleTime: 30000,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (booking: {
      roomId: string;
      guestName: string;
      guestEmail: string;
      guestPhone: string;
      checkIn: string;
      checkOut: string;
      guests: number;
      specialRequests?: string;
    }) => bookingsApi.create(booking),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Success', description: 'Booking created successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create booking', variant: 'destructive' });
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      bookingsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Success', description: 'Booking status updated' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update booking status', variant: 'destructive' });
    },
  });
};

export const useBookingAnalytics = () => {
  return useQuery({
    queryKey: ['booking-analytics'],
    queryFn: async () => {
      try {
        return await bookingsApi.getAnalytics();
      } catch {
        const confirmed = mockBookings.filter(b => b.status === 'CONFIRMED');
        return {
          totalBookings: mockBookings.length,
          totalRevenue: confirmed.reduce((sum, b) => sum + b.totalPrice, 0),
          recentBookings: mockBookings.slice(0, 5),
        };
      }
    },
    retry: false,
    staleTime: 30000,
  });
};
