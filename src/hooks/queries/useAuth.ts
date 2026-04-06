import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { OnboardingRequest } from '@/types';
import { userKeys } from './useUser';
import { env } from 'next-runtime-env';

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
  const baseUrl = env('NEXT_PUBLIC_API_URL');
  window.location.href = `${baseUrl}/auth/login/google`;
};
