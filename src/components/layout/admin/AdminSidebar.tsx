import { AdminSidebarNav } from './AdminSidebarNav';
import { AdminUserProfile } from './AdminUserProfile';
import { AdminSidebarHeader } from './AdminSidebarHeader';

interface AdminSidebarProps {
  isOpen?: boolean;
}

export function AdminSidebar({ isOpen = false }: AdminSidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-admin-bg text-white flex flex-col justify-between h-full transform transition-transform duration-300 md:relative md:translate-x-0 md:flex md:shrink-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="overflow-y-auto overflow-x-hidden">
        <AdminSidebarHeader />
        <AdminSidebarNav />
      </div>
      <AdminUserProfile />
    </aside>
  );
}
