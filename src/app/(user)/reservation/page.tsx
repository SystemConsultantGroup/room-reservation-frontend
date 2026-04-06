'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopHeader title="공간 예약" rightElement={<UserProfile />} />
      <div className="flex-1 flex items-center justify-center bg-bg-main">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
