import { SidebarNav } from './SidebarNav';
import { SidebarHeader } from './SidebarHeader';

interface SidebarProps {
  isOpen?: boolean;
}

export function Sidebar({ isOpen = false }: SidebarProps) {
  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-ui-border flex flex-col h-full transform transition-transform duration-300 md:relative md:translate-x-0 md:flex md:shrink-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div>
        <SidebarHeader />
        <SidebarNav />
      </div>
    </aside>
  );
}
