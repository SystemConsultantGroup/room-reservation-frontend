'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { MobileBackdrop } from './MobileBackdrop';
import { SidebarProvider, useSidebar } from './SidebarContext';
import { OnboardingGuard } from '@/components/auth/OnboardingGuard';

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const pathname = usePathname();

  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  return (
    <OnboardingGuard>
      <div className="flex h-screen w-full bg-bg-lightest overflow-hidden relative">
        <MobileBackdrop isOpen={isSidebarOpen} onClose={closeSidebar} />
        <Sidebar isOpen={isSidebarOpen} />

        <main className="flex-1 flex flex-col h-full bg-bg-main relative overflow-hidden min-w-0">
          {children}
          <Footer />
        </main>
      </div>
    </OnboardingGuard>
  );
}

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutInner>{children}</LayoutInner>
    </SidebarProvider>
  );
}
