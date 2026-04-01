import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/instance';
import type { OnboardingRequest } from '@/type';
import { userKeys } from './useUser';

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.post<never, void>('/auth/logout'),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useOnboardingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: OnboardingRequest) => apiClient.patch<never, void>('/auth/onboarding', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
};

export const redirectToGoogleLogin = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  window.location.href = `${baseUrl}/auth/login/google`;
};
