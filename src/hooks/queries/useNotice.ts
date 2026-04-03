import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { NoticeDetail, UpdateNoticeRequest } from '@/type';

export const noticeKeys = {
  all: ['notice'] as const,
  detail: () => [...noticeKeys.all, 'detail'] as const,
};

export const useNoticeQuery = () => {
  return useQuery<NoticeDetail>({
    queryKey: noticeKeys.detail(),
    queryFn: () => apiClient.get<never, NoticeDetail>('/notice'),
  });
};

export const useUpdateNoticeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateNoticeRequest) => apiClient.put<never, void>('/notice', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.detail() });
    },
  });
};
