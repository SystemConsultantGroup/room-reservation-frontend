'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMeQuery } from '@/hooks/queries';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading, isFetching } = useMeQuery();

  const isGuest = user?.type === 'GUEST';
  const isLoggedOut = user === null;
  const isOnboardingPage = pathname === '/onboarding';
  const shouldRedirectToOnboarding = isGuest && !isOnboardingPage;
  const shouldRedirectFromOnboarding = !isGuest && isOnboardingPage;

  useEffect(() => {
    if (isLoggedOut && isOnboardingPage) {
      router.replace('/');
      return;
    }

    if (isLoading || isFetching) return;

    if (shouldRedirectToOnboarding) {
      router.replace('/onboarding');
    } else if (shouldRedirectFromOnboarding) {
      router.replace('/');
    }
  }, [isLoggedOut, isLoading, isFetching, shouldRedirectToOnboarding, shouldRedirectFromOnboarding, pathname, router]);

  if (isOnboardingPage && (isLoading || isFetching || shouldRedirectFromOnboarding)) {
    return <div className="h-screen w-full bg-bg-lightest" />;
  }

  return <>{children}</>;
}