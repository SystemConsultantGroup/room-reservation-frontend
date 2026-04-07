import { DailyRoomScheduleResponse } from '@/types';
import { ReservationBlock } from '@/components/reservation/ReservationBlock';

interface RoomColumnProps {
  room: DailyRoomScheduleResponse;
  HOURS: string[];
  slotHeight: number;
  minHour: number;
  currentUserId?: number;
}

export function RoomColumn({ room, HOURS, slotHeight, minHour, currentUserId }: RoomColumnProps) {

  const isOperatingHour = (hour: string) => {
    if (!room.openTime || !room.closeTime) return false;
    const currentH = parseInt(hour.split(':')[0]);
    const openH = parseInt(room.openTime.split(':')[0]);
    const [closeH, closeM] = room.closeTime.split(':').map(Number);
    return currentH >= openH && (closeM > 0 ? currentH <= closeH : currentH < closeH);
  };

  return (
    <div className="flex-1 border-r border-gray-200 flex flex-col w-full min-w-0 relative">
      <div className="h-14 border-b border-gray-200 bg-white flex flex-col justify-center items-center shrink-0 lg:sticky lg:top-0 lg:z-20 px-2 text-center">
        <span className="font-extrabold text-gray-800 text-xxs lg:text-xs tracking-tight truncate w-full">
          {room.name}
        </span>
        <span className="text-micro text-gray-400 font-bold truncate w-full">
          {room.roomNumber}
        </span>
      </div>

      <div className="relative flex-1 w-full bg-white">
        {HOURS.map((hour) => {
          const isOpen = isOperatingHour(hour);
          return (
            <div
              key={hour}
              className={`border-b border-gray-100 ${!isOpen ? 'bg-striped-gray' : ''}`}
              style={{ height: `${slotHeight}px` }}
            ></div>
          );
        })}

        <div className="absolute inset-0 z-10 pointer-events-none">
          {room.reservations.map((res) => (
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
