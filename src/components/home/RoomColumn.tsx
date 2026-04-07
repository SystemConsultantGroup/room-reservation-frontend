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

  const getSlotStatus = (hour: string) => {
    if (!room.openTime || !room.closeTime) return { isOpen: false, closedStartMin: 0, closedEndMin: 0 };
    
    const currentH = parseInt(hour.split(':')[0]);
    const [openH, openM] = room.openTime.split(':').map(Number);
    const [closeH, closeM] = room.closeTime.split(':').map(Number);

    const isBeforeOpen = currentH < openH;
    const isAfterClose = currentH > closeH || (currentH === closeH && closeM === 0);
    
    if (isBeforeOpen || isAfterClose) return { isOpen: false, closedStartMin: 0, closedEndMin: 0 };

    return {
      isOpen: true,
      closedStartMin: currentH === openH ? openM : 0,
      closedEndMin: currentH === closeH ? (60 - closeM) : 0
    };
  };

  return (
    <div className="h-fit border-r border-gray-200 flex flex-col w-full min-w-0 relative">
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
          const status = getSlotStatus(hour);
          return (
            <div
              key={hour}
              className={`border-b border-gray-100 relative ${!status.isOpen ? 'bg-striped-gray' : ''}`}
              style={{ height: `${slotHeight}px` }}
            >
              {status.isOpen && status.closedStartMin > 0 && (
                <div 
                  className="absolute top-0 inset-x-0 bg-striped-gray z-0"
                  style={{ height: `${(status.closedStartMin / 60) * 100}%` }}
                />
              )}
              {status.isOpen && status.closedEndMin > 0 && (
                <div 
                  className="absolute bottom-0 inset-x-0 bg-striped-gray z-0"
                  style={{ height: `${(status.closedEndMin / 60) * 100}%` }}
                />
              )}
            </div>
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
