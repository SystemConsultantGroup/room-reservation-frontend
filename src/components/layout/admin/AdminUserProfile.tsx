'use client';

import { ShieldCheck } from 'lucide-react';
import { useMeQuery } from '@/hooks/queries';

export function AdminUserProfile() {
  const { data: user, isLoading } = useMeQuery();

  let avatarContent = null;
  let textContent = null;

  if (isLoading) {
    avatarContent = <div className="w-full h-full animate-pulse bg-white/10" />;
    textContent = (
      <div className="flex flex-col gap-2 w-full mt-1">
        <div className="w-16 h-3 bg-white/10 rounded animate-pulse" />
        <div className="w-24 h-2 bg-white/10 rounded animate-pulse" />
      </div>
    );
  } else {
    avatarContent = <ShieldCheck className="w-5 h-5" />;
    textContent = (
      <>
        <p className="text-sm font-bold text-white mb-0.5 truncate">
          {user?.name}
        </p>
        <p className="text-xxs text-gray-500 uppercase font-bold tracking-tighter truncate">
          System Administrator
        </p>
      </>
    );
  }

  return (
    <div className="p-6 border-t border-admin-border flex items-center bg-admin-profile">
      <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white mr-4 shrink-0 overflow-hidden">
        {avatarContent}
      </div>
      <div className="flex-1 min-w-0">
        {textContent}
      </div>
    </div>
  );
}
