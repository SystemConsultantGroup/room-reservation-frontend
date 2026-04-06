import { useGridSelection } from '@/hooks/useGridSelection';
import { ReservationDetail } from '@/types';

interface DayColumnProps {
  day: Date;
  dayLabel: string;
  HOURS: string[];
  slotHeight: number;
  minHour: number;
  reservations: ReservationDetail[];
  canReserve: boolean;
  isOperatingHour: (day: Date, hour: string) => boolean;
  isSlotReserved: (day: Date, hour: string) => boolean;
  selectionInfo: ReturnType<typeof useGridSelection>;
  onSelectionComplete: (start: string, end: string, date: Date) => void;
}

export function DayColumn({
  day, dayLabel, HOURS, slotHeight, minHour, reservations, canReserve,
  isOperatingHour, isSlotReserved, selectionInfo, onSelectionComplete
}: DayColumnProps) {

  const {
    isDragging, activeDay, selectionStart, selectionEnd, pressedCell,
    handleMouseDown, handleMouseEnter,
    handleTouchStart, handleTouchMove, handleTouchEnd, isLongPressRef
  } = selectionInfo;

  const dayISO = day.toISOString();
  const isThisDayActive = isDragging && activeDay === dayISO;

  const getReservationStyle = (res: ReservationDetail) => {
    const start = new Date(res.startTime);
    const end = new Date(res.endTime);
    const startTotalMin = (start.getHours() - minHour) * 60 + start.getMinutes();
    const durationMin = ((end.getHours() - minHour) * 60 + end.getMinutes()) - startTotalMin;

    return {
      top: `${(startTotalMin / 60) * slotHeight}px`,
      height: `${(durationMin / 60) * slotHeight}px`,
    };
  };

  return (
    <div className="flex-1 border-gray-200 flex flex-col w-full min-w-0 relative">
      {/* Day Header */}
      <div className="h-14 border-b border-r border-gray-200 bg-white flex justify-center items-center shrink-0 px-1">
        <span className="font-extrabold text-cal-header-day text-xs lg:text-xs uppercase tracking-tight lg:tracking-wide text-center">
          <span className="hidden lg:inline">{dayLabel}</span>
          <span className="text-cal-header-date font-semibold lg:ml-1 text-xs lg:text-sm block lg:inline">{day.getDate()}</span>
        </span>
      </div>

      {/* Grid Content */}
      <div className="relative flex-1 w-full">
        {/* Interactive Cells */}
        <div className="relative z-0">
          {HOURS.map((hour, hourIndex) => {
            const isOpen = isOperatingHour(day, hour);
            const isReservedSlot = isSlotReserved(day, hour);

            return (
              <div
                key={hour}
                data-hour-index={hourIndex}
                data-day-iso={dayISO}
                className={`border-b border-r border-gray-100 transition-colors ${isOpen ? 'cursor-pointer lg:hover:bg-black/5' : 'bg-gray-50/50 cursor-not-allowed'
                  } ${pressedCell?.dayISO === dayISO && pressedCell?.hourIndex === hourIndex ? 'bg-black/10' : ''}`}
                style={{ height: `${slotHeight}px` }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleMouseDown(day, hourIndex);
                }}
                onClick={() => {
                  if (isReservedSlot && canReserve && isOpen) {
                    const endTimeRaw = parseInt(hour.split(':')[0]) + 1;
                    const endTimeStr = `${String(endTimeRaw).padStart(2, '0')}:00`;
                    onSelectionComplete(hour, endTimeStr, day);
                  }
                }}
                onMouseEnter={() => handleMouseEnter(day, hourIndex)}
                onTouchStart={(e) => handleTouchStart(e, day, hourIndex)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onContextMenu={(e) => {
                  if (isLongPressRef.current) e.preventDefault();
                }}
              ></div>
            );
          })}
        </div>

        {/* Selection Overlay */}
        {isThisDayActive && selectionStart !== null && selectionEnd !== null && (
          <div
            className="absolute inset-x-0 bg-brand-primary/30 z-20 pointer-events-none rounded-lg mx-[2px]"
            style={{
              top: `${Math.min(selectionStart, selectionEnd) * slotHeight}px`,
              height: `${(Math.abs(selectionEnd - selectionStart) + 1) * slotHeight}px`,
            }}
          />
        )}

        {/* Reservations Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {reservations.map((res) => (
            <div
              key={res.id}
              className="absolute inset-x-0 bg-brand-primary/10 px-1 lg:px-2 py-1 text-left mx-auto border-l-[3px] lg:border-l-[4px] border-brand-primary pointer-events-auto overflow-hidden"
              style={{ ...getReservationStyle(res), left: '-1px' }}
            >
              <p className="font-bold text-xxs text-gray-900 mb-[1px] leading-tight truncate">
                {res.user.name}
                {res.attendeeCount > 1 && ` 외 ${res.attendeeCount - 1}명`}
              </p>
              <p className="text-micro text-cal-block-text leading-[1] uppercase truncate">
                {res.purpose}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}