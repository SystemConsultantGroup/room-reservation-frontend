'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building, UserCheck, Users, Megaphone, ArrowLeftCircle } from 'lucide-react';

export function AdminSidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { name: '공간 관리', href: '/admin/spaces', icon: Building },
    { name: '전공 신청 관리', href: '/admin/majors', icon: UserCheck },
    { name: '유저 관리', href: '/admin/users', icon: Users },
    { name: '공지 관리', href: '/admin/notices', icon: Megaphone },
  ];

  return (
    <nav className="mt-2 text-white">
      {navItems.map((item) => {
        const isActive = pathname?.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-8 py-4 transition-colors ${isActive
              ? 'bg-brand-primary text-white font-bold'
              : 'text-gray-400 hover:bg-admin-hover'
              }`}
          >
            <Icon className={`w-[18px] h-[18px] mr-4 ${isActive ? 'text-white' : ''}`} />
            {item.name}
          </Link>
        );
      })}

      <Link
        href="/"
        className="flex items-center px-8 py-4 text-gray-400 hover:bg-admin-hover transition-colors"
      >
        <ArrowLeftCircle className="w-[18px] h-[18px] mr-4" />
        사용자 페이지로
      </Link>
    </nav>
  );
}
