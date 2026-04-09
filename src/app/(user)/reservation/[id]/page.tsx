'use client';

import { useState, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  useRoomQuery,
  useRoomSummariesQuery,
  useWeeklyRoomSchedulesQuery
} from '@/hooks/queries/useRoom';
import { RoomSelector } from '@/components/reservation/RoomSelector';
import { ScheduleGrid } from '@/components/reservation/ScheduleGrid';
import { RoomInfoPanel } from '@/components/reservation/RoomInfoPanel';
import { ReservationModal } from '@/components/reservation/ReservationModal';
import { InfoBox } from '@/components/ui/InfoBox';
import { formatApiDate, getSunday, getSaturday } from '@/lib/date';
import { TopHeader } from '@/components/layout/TopHeader';
import { UserProfile } from '@/components/layout/UserProfile';
import { Card } from '@/components/ui/Card';

export default function ReservationPage() {
  const params = useParams();
  const roomId = Number(params.id);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({ start: '', end: '', date: new Date() });

  const { data: summaries, isLoading: isSummariesLoading } = useRoomSummariesQuery();

  const isValidRoom = useMemo(() => {
    if (isSummariesLoading || !summaries) return true;
    return summaries.rooms.some(r => r.id === roomId);
  }, [summaries, isSummariesLoading, roomId]);

  if (!isSummariesLoading && !isValidRoom) {
    notFound();
  }

  const { data: room, isLoading: isRoomLoading } = useRoomQuery(roomId, { enabled: isValidRoom });
  const { data: schedule } = useWeeklyRoomSchedulesQuery(
    roomId,
    formatApiDate(getSunday(currentDate))
  );

  const canReserve = summaries?.rooms.find(r => r.id === roomId)?.canReserve ?? false;

  const handlePrevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  const handleSelectionComplete = (start: string, end: string, date: Date) => {
    setSelectedSlot({ start, end, date });
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopHeader title="공간 예약" rightElement={<UserProfile />} />

      {isSummariesLoading || isRoomLoading ? (
        <div className="flex-1 flex items-center justify-center bg-bg-main">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="p-4 lg:p-10 pb-4 flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row gap-6 lg:gap-8 h-full">
          {/* Schedule */}
          <Card className="w-full lg:w-[72%] max-w-[1200px] flex flex-col shrink-0 lg:shrink h-fit lg:h-full relative !p-6 lg:!p-8">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 lg:mb-8 gap-4 relative">
              <RoomSelector rooms={summaries?.rooms || []} currentRoomId={roomId} />

              <div className="flex border rounded border-gray-200 overflow-hidden shadow-sm bg-white font-extrabold text-xs sm:text-xs tracking-tight text-gray-800">
                <button
                  onClick={handlePrevWeek}
                  className="px-2 sm:px-3 py-1.5 border-r border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
                </button>
                <div className="px-3 sm:px-4 py-1.5 flex items-center min-w-[150px] sm:min-w-[200px] justify-center">
                  {formatApiDate(getSunday(currentDate))} — {formatApiDate(getSaturday(currentDate))}
                </div>
                <button
                  onClick={handleNextWeek}
                  className="px-2 sm:px-3 py-1.5 border-l border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            </div>

            <ScheduleGrid
              currentDate={currentDate}
              reservations={schedule?.reservations || []}
              operatingHours={room?.operatingHours || []}
              canReserve={canReserve}
              onSelectionComplete={handleSelectionComplete}
            />

            <InfoBox
              items={['캘린더 상의 빈 시간대를 클릭하거나 드래그하여 자유롭게 예약 범위를 지정할 수 있습니다.']}
              className="!p-4 mt-6"
            />
          </Card>

          {/* Info Panel */}
          <div className="w-full lg:flex-1 lg:min-w-[340px] h-auto lg:h-full flex flex-col">
            {room && <RoomInfoPanel room={room} />}
          </div>
        </div>
      )}

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roomId={roomId}
        selectedDate={selectedSlot.date}
        initialStartTime={selectedSlot.start}
        initialEndTime={selectedSlot.end}
        minAttendeeCount={room?.minAttendeeCount || 1}
        maxAttendeeCount={room?.maxAttendeeCount || 0}
        minUsageMinutes={room?.minUsageMinutes || 0}
        maxUsageMinutes={room?.maxUsageMinutes || 0}
      />
    </div>
  );
}
