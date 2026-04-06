'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, CalendarDays, BookPlus, LogIn } from 'lucide-react';

const NAV_ITEMS = [
  { name: '메인', href: '/', icon: LayoutGrid },
  { name: '예약', href: '/reservation', icon: CalendarDays },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-2 text-sm">
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === '/'
          ? pathname === '/'
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-8 py-4 relative transition-colors ${isActive
              ? 'bg-bg-base text-foreground font-bold'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            {isActive && (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-brand-primary rounded-r" />
            )}
            <item.icon className={`mr-4 w-4.5 h-4.5 ${isActive ? 'text-brand-primary' : 'text-gray-400'}`} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
