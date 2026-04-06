'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useRoomSummariesQuery } from '@/hooks/queries/useRoom';

import { TopHeader } from '@/components/layout/TopHeader';
import { UserProfile } from '@/components/layout/UserProfile';

export default function ReservationRedirect() {
  const router = useRouter();
  const { data: roomList, isLoading } = useRoomSummariesQuery();

  useEffect(() => {
    if (!isLoading && roomList && roomList.rooms.length > 0) {
      router.replace(`/reservation/${roomList.rooms[0].id}`);
    }
  }, [roomList, isLoading, router]);

  const isEmpty = !isLoading && roomList && roomList.rooms.length === 0;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopHeader title="공간 예약" rightElement={<UserProfile />} />
      <div className="flex-1 flex items-center justify-center bg-bg-main">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : isEmpty ? (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500 px-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">예약 가능한 공간이 없습니다.</h2>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              공간이 등록되면 여기에서 예약할 수 있습니다.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
