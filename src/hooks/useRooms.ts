import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomsApi } from '@/lib/api-client';
import { SearchParams } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { mockRooms } from '@/lib/mock-data';

export const useRooms = (params?: SearchParams) => {
  return useQuery({
    queryKey: ['rooms', params],
    queryFn: async () => {
      try {
        const result = await roomsApi.getAll(params);
        // Backend returns { data: [...], meta: {...} } — extract the array
        return Array.isArray(result) ? result : (result.data ?? []);
      } catch {
        // Backend unavailable — use mock data
        return [...mockRooms];
      }
    },
    retry: false,
    staleTime: 30000,
  });
};

export const useRoom = (id: string) => {
  return useQuery({
    queryKey: ['room', id],
    queryFn: async () => {
      try {
        return await roomsApi.getOne(id);
      } catch {
        const room = mockRooms.find(r => r.id === id);
        if (room) return room;
        throw new Error('Room not found');
      }
    },
    enabled: !!id,
    retry: false,
  });
};

export const useRoomAvailability = (id: string, from: string, to: string) => {
  return useQuery({
    queryKey: ['room-availability', id, from, to],
    queryFn: async () => {
      try {
        return await roomsApi.checkAvailability(id, from, to);
      } catch {
        return { available: true };
      }
    },
    enabled: !!id && !!from && !!to,
    retry: false,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (room: any) => roomsApi.create(room),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({ title: 'Success', description: 'Room created successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create room', variant: 'destructive' });
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => roomsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({ title: 'Success', description: 'Room updated successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update room', variant: 'destructive' });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => roomsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({ title: 'Success', description: 'Room deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete room', variant: 'destructive' });
    },
  });
};
