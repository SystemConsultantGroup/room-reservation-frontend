import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/instance';
import type {
  RoomResponse, RoomUpdateRequest, RoomCreateRequest, PageResponse, RoomInfo,
  WeeklyRoomScheduleResponse, RoomSummaryList, DailyRoomScheduleResponse
} from '@/type';

export const roomKeys = {
  all: ['rooms'] as const,
  lists: () => [...roomKeys.all, 'list'] as const,
  list: (params: { page: number; size: number }) => [...roomKeys.lists(), params] as const,
  details: () => [...roomKeys.all, 'detail'] as const,
  detail: (id: number) => [...roomKeys.details(), id] as const,
  schedules: () => [...roomKeys.all, 'schedule'] as const,
  weeklySchedule: (id: number, date: string) => [...roomKeys.schedules(), 'weekly', id, date] as const,
  dailySchedules: (params: { date: string; page: number; size: number }) => [...roomKeys.schedules(), 'daily', params] as const,
  summaries: () => [...roomKeys.all, 'summary'] as const,
};

export const useRoomQuery = (roomId: number) => {
  return useQuery<RoomResponse>({
    queryKey: roomKeys.detail(roomId),
    queryFn: () => apiClient.get<never, RoomResponse>(`/rooms/${roomId}`),
  });
};

export const useUpdateRoomMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId, data }: { roomId: number, data: RoomUpdateRequest }) =>
      apiClient.put<never, void>(`/rooms/${roomId}`, data),
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.detail(roomId) });
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
};

export const useDeleteRoomMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roomId: number) => apiClient.delete<never, void>(`/rooms/${roomId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
};

export const useRoomsQuery = (params: { page?: number; size?: number } = {}) => {
  const normalizedParams = {
    page: params.page ?? 0,
    size: params.size ?? 8,
  };

  return useQuery<PageResponse<RoomInfo>>({
    queryKey: roomKeys.list(normalizedParams),
    queryFn: () => apiClient.get<never, PageResponse<RoomInfo>>('/rooms', { params: normalizedParams }),
  });
};

export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RoomCreateRequest) => apiClient.post<never, void>('/rooms', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
};

export const useWeeklyRoomSchedulesQuery = (roomId: number, date: string) => {
  return useQuery<WeeklyRoomScheduleResponse>({
    queryKey: roomKeys.weeklySchedule(roomId, date),
    queryFn: () => apiClient.get<never, WeeklyRoomScheduleResponse>(`/rooms/${roomId}/schedules`, { params: { date } }),
  });
};

export const useRoomSummariesQuery = () => {
  return useQuery<RoomSummaryList>({
    queryKey: roomKeys.summaries(),
    queryFn: () => apiClient.get<never, RoomSummaryList>('/rooms/summary'),
  });
};

export const useDailyRoomSchedulesQuery = (params: { date: string; page?: number; size?: number }) => {
  const normalizedParams = {
    date: params.date,
    page: params.page ?? 0,
    size: params.size ?? 8,
  };

  return useQuery<PageResponse<DailyRoomScheduleResponse>>({
    queryKey: roomKeys.dailySchedules(normalizedParams),
    queryFn: () => apiClient.get<never, PageResponse<DailyRoomScheduleResponse>>('/rooms/schedules', { params: normalizedParams }),
  });
};
