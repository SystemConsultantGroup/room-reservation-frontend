'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMeQuery } from '@/hooks/queries';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading, isFetching } = useMeQuery();
  const isAdmin = !!(user && user.managingUnitIds && user.managingUnitIds.length > 0);

  useEffect(() => {
    if (isLoading || isFetching) return;

    if (!isAdmin) {
      router.replace('/');
      return;
    }
  }, [isAdmin, isLoading, isFetching, router]);

  if (isLoading || isFetching || !isAdmin) {
    return <div className="h-screen w-full bg-bg-lightest" />;
  }

  return <>{children}</>;
}
