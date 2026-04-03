'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMeQuery } from '@/hooks/queries';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading, isFetching } = useMeQuery();
  const isAdmin = !!(user && user.managingUnitIds && user.managingUnitIds.length > 0);

  useEffect(() => {
    if (isLoading || isFetching) return;

    if (!isAdmin) {
      router.replace('/');
      return;
    }

    if (pathname === '/admin') {
      router.replace('/admin/spaces');
    }
  }, [isAdmin, isLoading, isFetching, router, pathname]);

  if (isLoading || isFetching || !isAdmin) {
    return <div className="h-screen w-full bg-bg-lightest" />;
  }

  return <>{children}</>;
}
