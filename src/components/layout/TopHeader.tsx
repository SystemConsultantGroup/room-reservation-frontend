'use client';

import { Menu } from 'lucide-react';
import React from 'react';
import { useSidebar } from '@/components/layout/SidebarContext';

interface TopHeaderProps {
  title: string;
  rightElement?: React.ReactNode;
}

export function TopHeader({ title, rightElement }: TopHeaderProps) {
  const { openSidebar } = useSidebar();

  return (
    <header className="flex bg-white px-5 md:px-10 h-[60px] md:h-[73px] items-center justify-between border-b border-gray-200 shrink-0 z-10 w-full">
      <div className="flex items-center">
        <button 
          className="md:hidden p-2 -ml-2 mr-2 cursor-pointer text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
          onClick={openSidebar}
          aria-label="메뉴 열기"
        >
          <Menu size={24} />
        </button>
        <h1 className="font-extrabold text-black text-lg md:text-2xl tracking-tight">{title}</h1>
      </div>
      {rightElement && <div className="flex items-center ml-2 shrink-0">{rightElement}</div>}
    </header>
  );
}
