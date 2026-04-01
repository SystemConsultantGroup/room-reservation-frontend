import { TopHeader } from '@/components/layout/TopHeader';

export default function AdminUsersPage() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopHeader title="유저 관리" />
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-10 pb-4 h-full relative z-0">
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex items-center justify-center text-gray-400">
          유저 관리 콘텐츠 영역
        </div>
      </div>
    </div>
  );
}
