'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMeQuery } from '@/hooks/queries';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading, isFetching } = useMeQuery();

  useEffect(() => {
    if (!isLoading && !isFetching && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, isFetching, router]);

  if (isLoading || isFetching || !user) {
    return <div className="h-screen w-full bg-bg-lightest" />;
  }

  return <>{children}</>;
}
