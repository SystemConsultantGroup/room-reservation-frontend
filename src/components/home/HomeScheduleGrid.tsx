'use client';

import { useMemo, useState, useEffect } from 'react';
import { DailyRoomScheduleResponse } from '@/types';
import { TimeColumn } from '@/components/reservation/TimeColumn';
import { RoomColumn } from './RoomColumn';
import { useMeQuery } from '@/hooks/queries/useUser';
import { Card } from '@/components/ui/Card';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { formatFullDate } from '@/lib/date';

interface HomeScheduleGridProps {
  rooms: DailyRoomScheduleResponse[];
  totalRooms: number;
  totalPages: number;
  currentPage: number;
  currentDate: Date;
  isLastPage: boolean;
  isLoading: boolean;
  onPrevDay: () => void;
  onNextDay: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function HomeScheduleGrid({
  rooms,
  totalRooms,
  totalPages,
  currentPage,
  currentDate,
  isLastPage,
  isLoading,
  onPrevDay,
  onNextDay,
  onPrevPage,
  onNextPage
}: HomeScheduleGridProps) {
  const { data: me } = useMeQuery();

  const [slotHeight, setSlotHeight] = useState(50);
  useEffect(() => {
    const handleResize = () => setSlotHeight(window.innerWidth < 1024 ? 40 : 60);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { minHour, HOURS } = useMemo(() => {
    let min = 24, max = 0;
    rooms.forEach(room => {
      if (!room.openTime || !room.closeTime) return;

      const openH = parseInt(room.openTime.split(':')[0]);
      const [closeH, closeM] = room.closeTime.split(':').map(Number);
      if (openH < min) min = openH;
      const lastSelectableHour = closeM > 0 ? closeH : closeH - 1;
      if (lastSelectableHour > max) max = lastSelectableHour;
    });
    if (min > max) { min = 9; max = 21; }
    return {
      minHour: min,
      HOURS: Array.from({ length: max - min + 1 }, (_, i) => `${String(min + i).padStart(2, '0')}:00`)
    };
  }, [rooms]);

  return (
    <Card className="w-full lg:h-full h-auto flex flex-col relative !p-6 lg:!p-8 overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-1.5 sm:gap-2">
            <CalendarDays className="w-5 h-5 lg:w-6 lg:h-6 text-brand-primary" />
            {formatFullDate(currentDate)}
          </h2>

          <div className="flex border rounded-lg border-ui-border overflow-hidden shadow-sm bg-white font-extrabold text-micro tracking-tight text-gray-800 shrink-0">
            <button
              onClick={onPrevDay}
              className="px-2.5 py-1.5 border-r border-ui-border hover:bg-bg-base transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
            </button>
            <button
              onClick={onNextDay}
              className="px-2.5 py-1.5 hover:bg-bg-base transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Room Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3 bg-bg-base p-1.5 rounded-xl border border-ui-border shrink-0">
            <button
              onClick={onPrevPage}
              disabled={currentPage === 0}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-ui-border shadow-xs hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-xs font-bold text-gray-500 min-w-[3rem] text-center">
              Page {currentPage + 1}
            </span>
            <button
              onClick={onNextPage}
              disabled={isLastPage}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-ui-border shadow-xs hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {/* Grid Content */}
      <div className="flex-1 flex flex-col min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center bg-bg-base/30 rounded-xl border border-dashed border-ui-border">
            <div className="w-8 h-8 border-3 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : rooms.length > 0 ? (
          <div className="w-full flex-1 border-t border-l border-gray-200 text-sm flex relative bg-white lg:overflow-y-auto custom-scrollbar select-none min-w-0">
            <TimeColumn HOURS={HOURS} slotHeight={slotHeight} />

            <div className="flex flex-1 relative min-w-0 h-fit">
              {rooms.map((room) => (
                <RoomColumn
                  key={room.id}
                  room={room}
                  HOURS={HOURS}
                  slotHeight={slotHeight}
                  minHour={minHour}
                  currentUserId={me?.id}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-bg-base/30 rounded-xl border border-dashed border-ui-border text-gray-400 animate-in fade-in duration-500">
            <p className="font-bold text-sm">공간이 없습니다.</p>
          </div>
        )}
      </div>
    </Card>
  );
}

