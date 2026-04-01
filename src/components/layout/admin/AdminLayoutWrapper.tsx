'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { MobileBackdrop } from '@/components/layout/MobileBackdrop';
import { MobileNav } from '@/components/layout/MobileNav';

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen w-full bg-bg-lightest overflow-hidden relative">
      <MobileBackdrop isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <AdminSidebar isOpen={isSidebarOpen} />

      <main className="flex-1 flex flex-col h-full bg-bg-main relative overflow-hidden min-w-0">
        <MobileNav onMenuClick={() => setIsSidebarOpen(true)} />
        {children}
      </main>
    </div>
  );
}
