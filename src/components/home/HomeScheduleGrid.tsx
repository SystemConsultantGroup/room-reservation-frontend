'use client';

import React, { useMemo, useState, useEffect } from 'react';
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
  onPageChange: (page: number) => void;
  onToday: () => void;
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
  onPageChange,
  onToday
}: HomeScheduleGridProps) {
  const { data: me } = useMeQuery();

  const [slotHeight, setSlotHeight] = useState(40);
  useEffect(() => {
    const handleResize = () => setSlotHeight(window.innerWidth < 1280 ? 34 : 40);
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
    if (min > max) { min = 9; max = 20; }
    return {
      minHour: min,
      HOURS: Array.from({ length: max - min + 1 }, (_, i) => `${String(min + i).padStart(2, '0')}:00`)
    };
  }, [rooms]);

  const getDisplayPages = () => {
    const total = totalPages || 0;
    const current = currentPage || 0;

    if (total <= 7) return Array.from({ length: total }, (_, i) => i);
    const pages: (number | '...')[] = [];
    pages.push(0);
    if (current > 3) pages.push('...');

    let start = Math.max(1, current - 1);
    let end = Math.min(total - 2, current + 1);

    if (current <= 3) end = 4;
    if (current >= total - 4) start = total - 5;

    for (let i = start; i <= end; i++) {
      if (i > 0 && i < total - 1) pages.push(i);
    }

    if (current < total - 4) pages.push('...');
    if (total > 1) pages.push(total - 1);

    return pages;
  };

  return (
    <Card className="w-full xl:h-fit h-auto flex flex-col relative !p-6 xl:!p-8 overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-wrap">
        {/* Left: Date Title */}
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-1.5 sm:gap-2">
            <CalendarDays className="w-5 h-5 xl:w-6 xl:h-6 text-brand-primary" />
            {formatFullDate(currentDate)}
          </h2>
        </div>

        {/* Date Navigation */}
        <div className="flex border rounded-lg border-ui-border overflow-hidden shadow-sm bg-white font-extrabold text-micro tracking-tight text-gray-800 shrink-0 w-fit">
          <button
            onClick={onPrevDay}
            className="px-2.5 py-1.5 border-r border-ui-border hover:bg-bg-base transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
          </button>
          <button
            onClick={onToday}
            className="px-3 py-1.5 border-r border-ui-border hover:bg-bg-base transition-colors cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={onNextDay}
            className="px-2.5 py-1.5 hover:bg-bg-base transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 flex flex-col min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center bg-bg-base/30 rounded-xl border border-dashed border-ui-border">
            <div className="w-8 h-8 border-3 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : rooms.length > 0 ? (
          <div
            className="w-full flex-1 border-t border-gray-200 text-sm flex relative bg-white xl:overflow-y-auto custom-scrollbar select-none min-w-0"
            style={{ maxHeight: typeof window !== 'undefined' && window.innerWidth >= 1280 ? 'calc(100vh - 250px)' : 'none' }}
          >
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-8 py-6 border-t border-ui-border bg-bg-base -mx-6 xl:-mx-8 -mb-6 xl:-mb-8 mt-6 flex justify-center items-center">
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 h-8 flex items-center justify-center border border-ui-border rounded-lg text-gray-400 hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="text-xs text-gray-500 font-bold">이전</span>
            </button>

            {getDisplayPages().map((page, i) => (
              <React.Fragment key={i}>
                {page === '...' ? (
                  <span className="w-8 h-8 flex items-end justify-center text-gray-400 pb-2">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPage === page
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/10'
                      : 'border border-ui-border text-gray-400 hover:bg-white hover:text-gray-600'
                      }`}
                  >
                    {page + 1}
                  </button>
                )}
              </React.Fragment>
            ))}

            <button
              onClick={() => onPageChange(Math.min((totalPages || 1) - 1, currentPage + 1))}
              disabled={currentPage === (totalPages || 1) - 1}
              className="px-3 h-8 flex items-center justify-center border border-ui-border rounded-lg text-gray-400 hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="text-xs text-gray-500 font-bold">다음</span>
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

