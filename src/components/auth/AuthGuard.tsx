'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMeQuery } from '@/hooks/queries';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading, isFetching } = useMeQuery();

  const isGuest = user?.type === 'GUEST';
  const shouldRedirectToOnboarding = isGuest && pathname !== '/onboarding';
  const shouldRedirectFromOnboarding = !isGuest && !isLoading && !isFetching && pathname === '/onboarding';

  useEffect(() => {
    if (isLoading || isFetching) return;

    if (shouldRedirectToOnboarding) {
      router.replace('/onboarding');
    } else if (shouldRedirectFromOnboarding) {
      router.replace('/');
    }
  }, [shouldRedirectToOnboarding, shouldRedirectFromOnboarding, isLoading, isFetching, router]);

  if (isLoading || isFetching || shouldRedirectToOnboarding || shouldRedirectFromOnboarding) {
    return <div className="h-screen w-full bg-bg-lightest" />;
  }

  return <>{children}</>;
}
