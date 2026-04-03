'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, LogIn, ChevronDown, BookPlus } from 'lucide-react';
import { useMeQuery, useLogoutMutation } from '@/hooks/queries';
import { UserType } from '@/type';
import { Button } from '@/components/ui/Button';

const USER_TYPE_LABELS: Record<UserType, string> = {
  STUDENT: '학생',
  FACULTY: '교원',
  GUEST: '게스트',
};

export function UserProfile() {
  const router = useRouter();
  const { data: user, isLoading } = useMeQuery();
  const logoutMutation = useLogoutMutation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 md:gap-3 px-1 md:px-2">
        <div className="flex flex-col items-end gap-1">
          <div className="w-12 md:w-16 h-3 bg-gray-100 rounded animate-pulse" />
          <div className="w-8 md:w-12 h-2 bg-gray-50 rounded animate-pulse" />
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/login')}
          leftIcon={<LogIn size={16} />}
          className="h-9 border-ui-border text-gray-500 hover:text-black shadow-none font-extrabold"
        >
          로그인
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 md:gap-4 px-2 md:px-3 py-1.5 hover:bg-gray-100/50 rounded-2xl transition-all cursor-pointer group"
      >
        <div className="flex flex-col items-end">
          <p className="text-sm font-bold text-foreground mb-0 whitespace-nowrap leading-tight">{user.name}</p>
          <p className="text-micro text-gray-400 font-medium leading-none mt-1">{USER_TYPE_LABELS[user.type]}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-ui-circle flex items-center justify-center text-gray-500 shrink-0 group-hover:bg-gray-200 transition-colors">
          <User size={18} />
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-ui-border py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => {
              setIsDropdownOpen(false);
              router.push('/registration');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer border-b border-gray-50"
          >
            <BookPlus className="w-4 h-4" />
            전공 등록 관리
          </button>
          <button
            onClick={() => {
              setIsDropdownOpen(false);
              logoutMutation.mutate();
            }}
            disabled={logoutMutation.isPending}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-all cursor-pointer disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
