import { TopHeader } from '@/components/layout/TopHeader';
import { Plus } from 'lucide-react';

export default function AdminSpacesPage() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopHeader 
        title="공간 관리" 
        rightElement={
          <button className="bg-brand-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-brand-primary/20">
            <Plus className="w-5 h-5" /> 새 공간 추가
          </button>
        } 
      />
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-10 pb-4 h-full relative z-0">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex items-center justify-center text-gray-400">
          공간 관리 콘텐츠 영역 (Admin Spaces)
        </div>
      </div>
    </div>
  );
}
