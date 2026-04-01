import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/instance';
import type {
  MajorApplicationRequest,
  MajorSummary,
  PageResponse,
  MajorApplicationDetail,
} from '@/type';

export const majorKeys = {
  all: ['majors'] as const,
  lists: () => [...majorKeys.all, 'list'] as const,
  managed: () => [...majorKeys.all, 'managed'] as const,
  applications: () => [...majorKeys.all, 'applications'] as const,
  applicationList: (params: { page: number; size: number; keyword?: string }) =>
    [...majorKeys.applications(), params] as const,
};

export const useMajorsQuery = () => {
  return useQuery<MajorSummary[]>({
    queryKey: majorKeys.lists(),
    queryFn: () => apiClient.get<never, MajorSummary[]>('/majors'),
  });
};

export const useManagedMajorsQuery = () => {
  return useQuery<MajorSummary[]>({
    queryKey: majorKeys.managed(),
    queryFn: () => apiClient.get<never, MajorSummary[]>('/majors/managed'),
  });
};

export const useApplicationsQuery = (params: { page?: number; size?: number; keyword?: string }) => {
  const normalizedParams = {
    page: params.page ?? 0,
    size: params.size ?? 10,
    ...(params.keyword && { keyword: params.keyword }),
  };

  return useQuery<PageResponse<MajorApplicationDetail>>({
    queryKey: majorKeys.applicationList(normalizedParams),
    queryFn: () => apiClient.get<never, PageResponse<MajorApplicationDetail>>('/majors/applications', { params: normalizedParams }),
  });
};

export const useApplyMajorMutation = () => {
  return useMutation({
    mutationFn: (data: MajorApplicationRequest) => apiClient.post<never, void>('/majors/apply', data),
  });
};

export const useApproveApplicationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) =>
      apiClient.post<never, void>(`/majors/applications/${applicationId}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: majorKeys.applications() });
    },
  });
};

export const useRejectApplicationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) =>
      apiClient.post<never, void>(`/majors/applications/${applicationId}/reject`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: majorKeys.applications() });
    },
  });
};
