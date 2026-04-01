import { TopHeader } from '@/components/layout/TopHeader';

export default function UserHomePage() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopHeader title="공간 현황" />
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-10 pb-4 h-full relative z-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex items-center justify-center text-gray-400">
          사용자 메인 페이지 (공간 현황 및 캘린더)
        </div>
      </div>
    </div>
  );
}
