'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { MobileBackdrop } from './MobileBackdrop';
import { MobileNav } from './MobileNav';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen w-full bg-bg-lightest overflow-hidden relative">
      <MobileBackdrop isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Sidebar isOpen={isSidebarOpen} />

      <main className="flex-1 flex flex-col h-full bg-bg-main relative overflow-hidden min-w-0">
        <MobileNav onMenuClick={() => setIsSidebarOpen(true)} />
        {children}
        <Footer />
      </main>
    </div>
  );
}
