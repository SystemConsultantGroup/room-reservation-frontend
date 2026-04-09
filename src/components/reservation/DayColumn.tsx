import { useGridSelection } from '@/hooks/useGridSelection';
import { ReservationDetail } from '@/types';
import { ReservationBlock } from '@/components/reservation/ReservationBlock';

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
  getSlotStatus: (day: Date, hour: string) => { isOpen: boolean; closedStartMin: number; closedEndMin: number };
  selectionInfo: ReturnType<typeof useGridSelection>;
  onSelectionComplete: (start: string, end: string, date: Date) => void;
  currentUserId?: number;
}

export function DayColumn({
  day, dayLabel, HOURS, slotHeight, minHour, reservations, canReserve,
  isOperatingHour, isSlotReserved, getSlotStatus, selectionInfo, onSelectionComplete,
  currentUserId
}: DayColumnProps) {

  const {
    isDragging, activeDay, selectionStart, selectionEnd, pressedCell,
    handleMouseDown, handleMouseEnter,
    handleTouchStart, handleTouchMove, handleTouchEnd, isLongPressRef
  } = selectionInfo;

  const dayISO = day.toISOString();
  const isThisDayActive = isDragging && activeDay === dayISO;


  return (
    <div className="h-fit border-gray-200 flex flex-col w-full min-w-0 relative">
      <div className="h-14 border-b border-r border-gray-200 bg-white flex flex-col justify-center items-center shrink-0 px-1 xl:sticky xl:top-0 xl:z-20">
        <span className="hidden xl:block text-gray-400 font-bold text-xxs uppercase tracking-wider mb-0.5">
          {dayLabel}
        </span>
        <span className="text-gray-500 font-extrabold text-xs xl:text-sm">
          {day.getMonth() + 1}/{day.getDate()}
        </span>
      </div>

      {/* Grid Content */}
      <div className="relative flex-1 w-full">
        {/* Interactive Cells */}
        <div className="relative z-0">
          {HOURS.map((hour, hourIndex) => {
            const status = getSlotStatus(day, hour);
            const isReservedSlot = isSlotReserved(day, hour);

            return (
              <div
                key={hour}
                data-hour-index={hourIndex}
                data-day-iso={dayISO}
                className={`border-b border-r border-gray-100 transition-colors relative ${status.isOpen ? 'cursor-pointer xl:hover:bg-black/5' : 'bg-striped-gray cursor-not-allowed'
                  } ${pressedCell?.dayISO === dayISO && pressedCell?.hourIndex === hourIndex ? 'bg-black/10' : ''}`}
                style={{ height: `${slotHeight}px` }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleMouseDown(day, hourIndex);
                }}
                onClick={() => {
                  if (isReservedSlot && canReserve && status.isOpen) {
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
              >
                {status.isOpen && status.closedStartMin > 0 && (
                  <div
                    className="absolute top-0 inset-x-0 bg-striped-gray z-0 pointer-events-none"
                    style={{ height: `${(status.closedStartMin / 60) * 100}%` }}
                  />
                )}
                {status.isOpen && status.closedEndMin > 0 && (
                  <div
                    className="absolute bottom-0 inset-x-0 bg-striped-gray z-0 pointer-events-none"
                    style={{ height: `${(status.closedEndMin / 60) * 100}%` }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Selection Overlay */}
        {isThisDayActive && selectionStart !== null && selectionEnd !== null && (
          <div
            className="absolute inset-x-0 bg-brand-primary/30 z-20 pointer-events-none rounded-lg mx-[2px]"
            style={(() => {
              const startIdx = Math.min(selectionStart, selectionEnd);
              const endIdx = Math.max(selectionStart, selectionEnd);
              const startStatus = getSlotStatus(day, HOURS[startIdx]);
              const endStatus = getSlotStatus(day, HOURS[endIdx]);

              const topOffset = (startStatus.closedStartMin / 60) * slotHeight;
              const bottomClosedPx = (endStatus.closedEndMin / 60) * slotHeight;
              
              const top = startIdx * slotHeight + topOffset;
              const height = (endIdx - startIdx + 1) * slotHeight - topOffset - bottomClosedPx;

              return { top: `${top}px`, height: `${height}px` };
            })()}
          />
        )}

        {/* Reservations Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {reservations.map((res) => (
            <ReservationBlock
              key={res.id}
              reservation={res}
              currentUserId={currentUserId}
              minHour={minHour}
              slotHeight={slotHeight}
            />
          ))}
        </div>
      </div>
    </div>
  );
}