import { useState } from 'react';
import { ReservationDetail } from '@/types';
import { Tooltip } from '@/components/ui/Tooltip';
import { formatTime } from '@/lib/date';
import { ReservationDetailModal } from '@/components/reservation/ReservationDetailModal';

interface ReservationBlockProps {
  reservation: ReservationDetail;
  currentUserId?: number;
  minHour: number;
  slotHeight: number;
}

export function ReservationBlock({
  reservation,
  currentUserId,
  minHour,
  slotHeight,
}: ReservationBlockProps) {
  const isMine = currentUserId !== undefined && reservation.user.id === currentUserId;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStyle = () => {
    const start = new Date(reservation.startTime);
    const end = new Date(reservation.endTime);
    const startTotalMin = (start.getHours() - minHour) * 60 + start.getMinutes();
    const durationMin = ((end.getHours() - minHour) * 60 + end.getMinutes()) - startTotalMin;

    return {
      top: `${(startTotalMin / 60) * slotHeight}px`,
      height: `${(durationMin / 60) * slotHeight}px`,
      left: '-1px',
    };
  };

  const timeRange = `${formatTime(reservation.startTime.split('T')[1])} — ${formatTime(reservation.endTime.split('T')[1])}`;

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        className={`absolute inset-x-0 px-1 lg:px-2 py-1 text-left mx-auto border border-l-[3px] lg:border-l-[4px] pointer-events-auto hover:z-50 cursor-pointer
          ${isMine
            ? 'bg-brand-secondary/10 border-brand-secondary/20 border-l-brand-secondary'
            : 'bg-brand-primary/10 border-brand-primary/20 border-l-brand-primary'}`}
        style={getStyle()}
      >
        <Tooltip content={timeRange} delay={100} className="w-full h-full">
          <div className="w-full h-full">
            <p className="font-bold text-xxs text-gray-900 mb-[1px] leading-tight truncate">
              {reservation.user.name}
              {reservation.attendeeCount > 1 && ` +${reservation.attendeeCount - 1}`}
            </p>
            <p className="text-micro text-cal-block-text leading-[1] uppercase truncate">
              {reservation.purpose}
            </p>
          </div>
        </Tooltip>
      </div>

      <ReservationDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reservation={reservation}
        isMine={isMine}
      />
    </>
  );
}
