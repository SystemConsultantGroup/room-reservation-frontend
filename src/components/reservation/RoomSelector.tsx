'use client';

import { useRouter } from 'next/navigation';
import { Building2, Lock } from 'lucide-react';
import { RoomSummary } from '@/types';
import { Select } from '@/components/ui/Select';

interface RoomSelectorProps {
  rooms: RoomSummary[];
  currentRoomId: number;
}

export function RoomSelector({ rooms, currentRoomId }: RoomSelectorProps) {
  const router = useRouter();

  const options = [...rooms]
    .sort((a, b) => (a.canReserve === b.canReserve ? 0 : a.canReserve ? -1 : 1))
    .map(room => ({
      value: room.id,
      label: room.name,
      rightElement: !room.canReserve ? <Lock className="w-3 h-3 text-gray-400" /> : undefined
    }));

  const handleSelect = (id: number) => {
    router.push(`/reservation/${id}`);
  };

  return (
    <div className="w-[180px] sm:w-[220px]">
      <Select
        options={options}
        value={currentRoomId}
        onChange={handleSelect}
        leftIcon={<Building2 className="w-4 h-4" />}
      />
    </div>
  );
}
