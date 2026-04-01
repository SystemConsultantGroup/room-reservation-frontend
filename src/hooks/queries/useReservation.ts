import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/instance';
import type { CreateReservationRequest } from '@/type';

export const useCreateReservationMutation = () => {
  return useMutation({
    mutationFn: (data: CreateReservationRequest) =>
      apiClient.post<never, void>('/reservations', data),
  });
};
