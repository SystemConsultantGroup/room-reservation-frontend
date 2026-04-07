import { ReservationDetail } from '@/types';

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

  return (
    <div
      className={`absolute inset-x-0 px-1 lg:px-2 py-1 text-left mx-auto border-l-[3px] lg:border-l-[4px] pointer-events-auto overflow-hidden
        ${isMine
          ? 'bg-brand-secondary/10 border-brand-secondary'
          : 'bg-brand-primary/10 border-brand-primary'}`}
      style={getStyle()}
    >
      <p className="font-bold text-xxs text-gray-900 mb-[1px] leading-tight truncate">
        {reservation.user.name}
        {reservation.attendeeCount > 1 && ` +${reservation.attendeeCount - 1}`}
      </p>
      <p className="text-micro text-cal-block-text leading-[1] uppercase truncate">
        {reservation.purpose}
      </p>
    </div>
  );
}
