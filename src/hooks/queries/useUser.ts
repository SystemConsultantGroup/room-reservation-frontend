import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { PageResponse, UserInfo, GetMeResponse, UpdateMeRequest, UserDetail } from '@/types';
import { isAxiosError } from 'axios';
import { reservationKeys } from '@/hooks/queries/useReservation';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: { page: number; size: number; keyword?: string }) =>
    [...userKeys.lists(), params] as const,
  me: () => [...userKeys.all, 'me'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

export const useUsersQuery = (params: { page?: number; size?: number; keyword?: string }) => {
  const normalizedParams = {
    page: params.page ?? 0,
    size: params.size ?? 8,
    ...(params.keyword && { keyword: params.keyword }),
  };

  return useQuery<PageResponse<UserInfo>>({
    queryKey: userKeys.list(normalizedParams),
    queryFn: () => apiClient.get<never, PageResponse<UserInfo>>('/users', { params: normalizedParams }),
  });
};

export const useUserQuery = (userId: number, options?: { enabled?: boolean }) => {
  return useQuery<UserDetail>({
    queryKey: userKeys.detail(userId),
    queryFn: () => apiClient.get<never, UserDetail>(`/users/${userId}`),
    enabled: options?.enabled,
  });
};

export const useMeQuery = () => {
  return useQuery<GetMeResponse | null>({
    queryKey: userKeys.me(),
    queryFn: async () => {
      try {
        return await apiClient.get<never, GetMeResponse>('/users/me');
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateMeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: UpdateMeRequest }) =>
      apiClient.put<never, void>('/users/me', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
};

export const useCancelUserFutureReservationsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) =>
      apiClient.delete<never, void>(`/users/${userId}/reservations`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
};
