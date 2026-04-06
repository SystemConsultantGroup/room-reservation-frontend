import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { CreateReservationRequest } from '@/types';

export const useCreateReservationMutation = () => {
  return useMutation({
    mutationFn: (data: CreateReservationRequest) =>
      apiClient.post<never, void>('/reservations', data),
  });
};
