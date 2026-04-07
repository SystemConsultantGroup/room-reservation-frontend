'use client';

import { useState } from 'react';
import { HomeScheduleGrid } from '@/components/home/HomeScheduleGrid';
import { MyReservationsSection } from '@/components/home/MyReservationsSection';
import { NoticeSection } from '@/components/home/NoticeSection';
import { useDailyRoomSchedulesQuery } from '@/hooks/queries/useRoom';
import { useMyReservationsQuery } from '@/hooks/queries/useReservation';
import { useMeQuery } from '@/hooks/queries/useUser';
import { useManagementUnitQuery } from '@/hooks/queries/useManagementUnit';
import { formatApiDate } from '@/lib/date';
import { UserProfile } from '@/components/layout/UserProfile';
import { TopHeader } from '@/components/layout/TopHeader';
import { Footer } from '@/components/layout/Footer';

export default function UserHomePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(0);

  const { data: me } = useMeQuery();
  const { data: managementUnit } = useManagementUnitQuery();
  const { data: myReservations } = useMyReservationsQuery({ enabled: !!me });
  const { data: scheduleData, isLoading: isScheduleLoading } = useDailyRoomSchedulesQuery({
    date: formatApiDate(currentDate),
    page: currentPage,
    size: 4,
  });

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
    setCurrentPage(0);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
    setCurrentPage(0);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev: number) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    if (scheduleData && !scheduleData.last) {
      setCurrentPage((prev: number) => prev + 1);
    }
  };

  const hasMyReservations = !!(me && myReservations && myReservations.reservations.length > 0);
  const hasNotice = !!(managementUnit?.noticeTitle?.trim() || managementUnit?.noticeContent?.trim());
  const hasSideContent = hasMyReservations || hasNotice;

  return (
    <div className="flex-1 flex flex-col min-h-screen lg:h-full overflow-hidden">
      <TopHeader title="공간 현황" rightElement={<UserProfile />} />

      <div className="p-4 lg:p-10 pb-4 flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row gap-8 h-auto lg:h-full relative z-0">
        <div className={`w-full max-w-[1400px] flex flex-col h-fit lg:h-full relative ${hasSideContent ? 'lg:w-[65%] max-w-[1400px]' : 'lg:w-full max-w-none'}`}>
          <HomeScheduleGrid
            rooms={scheduleData?.content || []}
            totalRooms={scheduleData?.totalElements || 0}
            totalPages={scheduleData?.totalPages || 0}
            currentPage={currentPage}
            currentDate={currentDate}
            isLastPage={scheduleData?.last ?? true}
            isLoading={isScheduleLoading}
            onPrevDay={handlePrevDay}
            onNextDay={handleNextDay}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
          />
        </div>

        {hasSideContent && (
          <div className="w-full lg:flex-1 lg:min-w-[380px] h-auto lg:h-full flex flex-col lg:overflow-y-auto pr-1 custom-scrollbar">
            {hasMyReservations && (
              <MyReservationsSection reservations={myReservations.reservations} />
            )}

            <NoticeSection managementUnit={managementUnit} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
