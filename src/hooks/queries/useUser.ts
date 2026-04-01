import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/instance';
import type { PageResponse, UserInfo, UserDetail } from '@/type';

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
    size: params.size ?? 10,
    ...(params.keyword && { keyword: params.keyword }),
  };

  return useQuery<PageResponse<UserInfo>>({
    queryKey: userKeys.list(normalizedParams),
    queryFn: () => apiClient.get<never, PageResponse<UserInfo>>('/users', { params: normalizedParams }),
  });
};

export const useMeQuery = () => {
  return useQuery<UserDetail>({
    queryKey: userKeys.me(),
    queryFn: () => apiClient.get<never, UserDetail>('/users/me'),
  });
};
