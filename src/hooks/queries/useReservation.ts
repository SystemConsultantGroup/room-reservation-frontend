import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { CreateReservationRequest, ReservationList } from '@/types';
import { roomKeys } from '@/hooks/queries/useRoom';

export const reservationKeys = {
  all: ['reservations'] as const,
  me: () => [...reservationKeys.all, 'me'] as const,
};

export const useCreateReservationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReservationRequest) =>
      apiClient.post<never, void>('/reservations', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.me() });
      queryClient.invalidateQueries({ queryKey: roomKeys.schedules() });
    },
  });
};

export const useMyReservationsQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: reservationKeys.me(),
    queryFn: () => apiClient.get<never, ReservationList>('/reservations/me'),
    enabled: options?.enabled,
  });
};

export const useDeleteReservationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reservationId: number) =>
      apiClient.delete<never, void>(`/reservations/${reservationId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.me() });
      queryClient.invalidateQueries({ queryKey: roomKeys.schedules() });
    },
  });
};
