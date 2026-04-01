import { Menu } from 'lucide-react';

interface MobileNavProps {
  onMenuClick: () => void;
}

export function MobileNav({ onMenuClick }: MobileNavProps) {
  return (
    <header className="md:hidden h-14 bg-white border-b border-gray-200 flex items-center px-4 justify-between shrink-0 z-10 relative">
      <button onClick={onMenuClick} className="p-2 -ml-2 cursor-pointer text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors" aria-label="메뉴 열기">
        <Menu size={24} />
      </button>
      <div className="font-extrabold text-[15px] tracking-tight text-gray-800">
        공간예약시스템
      </div>
      <div className="w-10" />
    </header>
  );
}
