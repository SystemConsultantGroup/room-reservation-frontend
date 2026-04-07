'use client';

import { useState, useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';
import { ReservationDetail, OperatingHoursDetail } from '@/types';
import { getWeekDays, SHORT_DAYS } from '@/lib/date';
import { useGridData } from '@/hooks/useGridData';
import { useGridSelection } from '@/hooks/useGridSelection';
import { DayColumn } from '@/components/reservation/DayColumn';
import { TimeColumn } from '@/components/reservation/TimeColumn';
import { useMeQuery } from '@/hooks/queries/useUser';

interface ScheduleGridProps {
  currentDate: Date;
  reservations: ReservationDetail[];
  operatingHours: OperatingHoursDetail[];
  canReserve: boolean;
  onSelectionComplete: (start: string, end: string, date: Date) => void;
}

export function ScheduleGrid({ currentDate, reservations, operatingHours, canReserve, onSelectionComplete }: ScheduleGridProps) {
  const { data: me } = useMeQuery();
  const weekDays = getWeekDays(currentDate);
  const gridRef = useRef<HTMLDivElement>(null);

  const [slotHeight, setSlotHeight] = useState(50);
  useEffect(() => {
    const handleResize = () => setSlotHeight(window.innerWidth < 1024 ? 36 : 50);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const gridData = useGridData(operatingHours, reservations);

  const selectionInfo = useGridSelection(
    canReserve,
    gridData.HOURS,
    gridData.isSlotReserved,
    gridData.isOperatingHour,
    onSelectionComplete
  );

  return (
    <div
      ref={gridRef}
      className={`w-full flex-1 border-t border-l border-gray-200 text-sm flex relative bg-white select-none ${canReserve ? (selectionInfo.isTouchDrag ? 'overflow-hidden touch-none' : 'overflow-y-visible lg:overflow-y-auto') : 'overflow-hidden'
        }`}
      style={{ maxHeight: typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'calc(100vh - 250px)' : 'none' }}
    >
      <TimeColumn HOURS={gridData.HOURS} slotHeight={slotHeight} />

      <div className="flex flex-1 relative min-w-0 h-fit">
        {weekDays.map((day) => (
          <DayColumn
            key={day.toISOString()}
            day={day}
            dayLabel={SHORT_DAYS[day.getDay()]}
            HOURS={gridData.HOURS}
            slotHeight={slotHeight}
            minHour={gridData.minHour}
            reservations={reservations.filter(res => new Date(res.startTime).toDateString() === day.toDateString())}
            canReserve={canReserve}
            isOperatingHour={gridData.isOperatingHour}
            isSlotReserved={gridData.isSlotReserved}
            selectionInfo={selectionInfo}
            onSelectionComplete={onSelectionComplete}
            currentUserId={me?.id}
          />
        ))}
      </div>

      {!canReserve && (
        <div className="absolute inset-0 z-30 bg-white/70 backdrop-blur-[2px] flex flex-col items-center justify-center">
          <h3 className="font-bold text-black text-2xl mb-3">예약 권한이 없습니다</h3>
        </div>
      )}
    </div>
  );
}