'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { MobileBackdrop } from '@/components/layout/MobileBackdrop';
import { SidebarProvider, useSidebar } from '@/components/layout/SidebarContext';
import { Footer } from '../Footer';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const pathname = usePathname();

  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  return (
    <div className="flex h-screen w-full bg-bg-lightest overflow-hidden relative">
      <MobileBackdrop isOpen={isSidebarOpen} onClose={closeSidebar} />
      <AdminSidebar isOpen={isSidebarOpen} />

      <main className="flex-1 flex flex-col h-full bg-bg-main relative overflow-hidden min-w-0">
        {children}
        <Footer />
      </main>
    </div>
  );
}

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SidebarProvider>
  );
}
