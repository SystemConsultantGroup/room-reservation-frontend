import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { ManagementUnitDetail, UpdateNoticeRequest } from '@/type';

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managementUnitKeys.all });
    },
  });
};
