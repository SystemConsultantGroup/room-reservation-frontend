import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { PageResponse, UserInfo, UserDetail } from '@/type';
import { isAxiosError } from 'axios';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: { page: number; size: number; keyword?: string }) =>
    [...userKeys.lists(), params] as const,
  me: () => [...userKeys.all, 'me'] as const,
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

export const useMeQuery = () => {
  return useQuery<UserDetail | null>({
    queryKey: userKeys.me(),
    queryFn: async () => {
      try {
        return await apiClient.get<never, UserDetail>('/users/me');
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
