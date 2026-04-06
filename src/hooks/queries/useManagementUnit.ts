import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { ManagementUnitDetail, UpdateNoticeRequest } from '@/type/managementUnit';
import { revalidateCache } from '@/actions/cache';
import { MANAGEMENT_UNIT_CACHE_TAG } from '@/constants/cacheTags';

export const managementUnitKeys = {
  all: ['managementUnit'] as const,
};

export const useManagementUnitQuery = () => {
  return useQuery<ManagementUnitDetail>({
    queryKey: managementUnitKeys.all,
    queryFn: () => apiClient.get<never, ManagementUnitDetail>('/managementUnit'),
  });
};

export const useUpdateNoticeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateNoticeRequest) => apiClient.put<never, void>('/managementUnit/notice', data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: managementUnitKeys.all });
      await revalidateCache(MANAGEMENT_UNIT_CACHE_TAG);
    },
  });
};
