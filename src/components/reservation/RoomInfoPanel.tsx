'use client';

import { RoomResponse } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getAccessPolicyLabel } from '@/lib/room';
import { formatTime, getDayOfWeekLabel, sortOperatingHours } from '@/lib/date';

interface RoomInfoPanelProps {
  room: RoomResponse;
}


export function RoomInfoPanel({ room }: RoomInfoPanelProps) {
  return (
    <Card className="flex-1 overflow-y-auto w-full !p-8">
      {/* Space Overview */}
      <div className="mb-10">

        <div className="mb-6">
          <div className="text-xs font-extrabold text-brand-primary mb-1.5 uppercase tracking-wide">
            공간 이름
          </div>
          <h3 className="text-md font-extrabold text-black tracking-tight">{room.name}</h3>
        </div>

        <div className="mb-6">
          <div className="text-xs font-extrabold text-brand-primary mb-1.5 uppercase tracking-wide">
            위치
          </div>
          <div className="text-md font-bold text-gray-900">{room.roomNumber}</div>
        </div>

        <div>
          <div className="text-xs font-extrabold text-brand-primary mb-2 uppercase tracking-wide">
            허용 전공
          </div>
          <div className="flex flex-wrap gap-2">
            {room.majors.map((major) => (
              <Badge
                key={major.id}
                variant="outline"
                size="sm"
              >
                {major.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 mb-8 border-dashed"></div>

      {/* Usage Policy */}
      <div>

        <ul className="space-y-4 text-xs text-cal-block-text mb-8 w-full border-b border-gray-100 pb-8">
          <li className="flex justify-between items-center">
            <span>수용 인원</span>
            <span className="font-extrabold text-gray-900 text-sm">
              {room.minAttendeeCount}명 - {room.maxAttendeeCount}명
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span>이용 가능 시간</span>
            <span className="font-extrabold text-gray-900 text-sm">
              {(() => {
                const format = (mins: number) => {
                  const h = Math.floor(mins / 60);
                  const m = mins % 60;
                  if (h > 0 && m > 0) return `${h}시간 ${m}분`;
                  if (h > 0) return `${h}시간`;
                  return `${m}분`;
                };
                return `${format(room.minUsageMinutes)} - ${format(room.maxUsageMinutes)}`;
              })()}
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span>권한</span>
            <div className="text-right">
              <span className="font-extrabold text-gray-900 text-sm">
                {getAccessPolicyLabel(room.accessPolicy)}
              </span>
            </div>
          </li>
        </ul>

        <div className="mb-4">
          <span className="text-sm font-bold text-gray-800">운영 시간</span>
        </div>
        <ul className="space-y-3 text-xs text-cal-block-text">
          {sortOperatingHours(room.operatingHours).map((oh) => (
            <li key={oh.dayOfWeek} className="flex justify-between items-center">
              <span>{getDayOfWeekLabel(oh.dayOfWeek)}</span>
              <span className="font-extrabold text-gray-800 tracking-wider">
                {formatTime(oh.openTime)} - {formatTime(oh.closeTime)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
