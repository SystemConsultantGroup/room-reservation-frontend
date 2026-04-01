'use client';

import { User } from 'lucide-react';
import { useMeQuery } from '@/hooks/queries';
import { UserType } from '@/type';

const USER_TYPE_LABELS: Record<UserType, string> = {
  STUDENT: '학생',
  FACULTY: '교원',
  GUEST: '게스트',
};

export function UserProfile() {
  const { data: user, isLoading } = useMeQuery();

  let avatarContent = null;
  let textContent = null;

  if (isLoading) {
    avatarContent = <div className="w-full h-full animate-pulse bg-gray-200" />;
    textContent = (
      <div className="flex flex-col gap-2">
        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
        <div className="w-20 h-2 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  } else if (!user) {
    avatarContent = <User className="w-5 h-5 text-gray-400" />;
    textContent = (
      <div>
        <p className="text-sm font-bold text-foreground mb-0.5">로그인이 필요합니다</p>
      </div>
    );
  } else {
    avatarContent = <User className="w-5 h-5 text-gray-500" />;
    textContent = (
      <div>
        <p className="text-sm font-bold text-foreground mb-0.5">{user.name}</p>
        <p className="text-xxs text-gray-500">{USER_TYPE_LABELS[user.type]}</p>
      </div>
    );
  }

  return (
    <div className="p-6 border-t border-ui-border flex items-center bg-bg-lightest">
      <div className="w-10 h-10 rounded-full bg-ui-circle flex items-center justify-center mr-4 overflow-hidden shrink-0">
        {avatarContent}
      </div>
      {textContent}
    </div>
  );
}
