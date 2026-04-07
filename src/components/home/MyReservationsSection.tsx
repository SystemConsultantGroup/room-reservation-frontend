'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ReservationDetail } from '@/types';
import { formatTime, formatDate } from '@/lib/date';
import { Clock, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useDeleteReservationMutation } from '@/hooks/queries/useReservation';

interface MyReservationsSectionProps {
  reservations: ReservationDetail[];
}

export function MyReservationsSection({ reservations }: MyReservationsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [selectedResId, setSelectedResId] = useState<number | null>(null);

  const deleteMutation = useDeleteReservationMutation();
  const now = new Date();

  const selectedRes = reservations.find(r => r.id === selectedResId);

  if (reservations.length === 0) return null;

  const displayReservations = showAll ? reservations : reservations.slice(0, 3);
  const hasMore = reservations.length > 3;

  const getRemainingTime = (startTime: string) => {
    const start = new Date(startTime);
    const diffMs = start.getTime() - now.getTime();
    if (diffMs <= 0) return null;

    const diffMin = Math.floor(diffMs / (1000 * 60));
    if (diffMin < 1) return '곧 시작';

    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}일 후`;
    if (diffHours > 0) return `${diffHours}시간 후`;
    return `${diffMin}분 후`;
  };

  return (
    <div className="flex flex-col gap-4 mb-8">
      <Card className="!p-0 border border-ui-border overflow-hidden">
        <div className="divide-y divide-ui-border">
          {displayReservations.map((res) => {
            const start = new Date(res.startTime);
            const isProceeding = now >= start;
            const remainingTime = !isProceeding ? getRemainingTime(res.startTime) : null;

            return (
              <div key={res.id} className="px-5 py-4 hover:bg-bg-base/50 transition-colors group flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge variant={isProceeding ? 'success' : 'primary'} size="xs" rounded="lg" className="shrink-0 scale-90 origin-left">
                      {isProceeding ? '진행 중' : (remainingTime || '예정됨')}
                    </Badge>
                    <h4 className="font-bold text-gray-800 text-sm truncate tracking-tight">
                      {res.purpose}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1 text-micro text-gray-400 font-bold shrink-0">
                    <Calendar className="w-3 h-3" />
                    {formatDate(res.startTime)}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium tracking-tight">
                    <Clock className="w-3.5 h-3.5 text-brand-primary/60" />
                    <span>
                      {formatTime(res.startTime.split('T')[1])} — {formatTime(res.endTime.split('T')[1])}
                    </span>
                  </div>
                  <Button
                    size="xs"
                    variant="danger"
                    onClick={() => setSelectedResId(res.id)}
                  >
                    예약 취소
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <ConfirmModal
          isOpen={selectedResId !== null}
          onClose={() => setSelectedResId(null)}
          onConfirm={() => {
            if (selectedResId) {
              deleteMutation.mutate(selectedResId, {
                onSuccess: () => setSelectedResId(null),
              });
            }
          }}
          isLoading={deleteMutation.isPending}
          title="예약 취소"
          content={`정말 이 예약(${selectedRes?.purpose})을 취소하시겠습니까?`}
          confirmText="예약 취소"
          cancelText="돌아가기"
          variant="danger"
        />

        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-3 flex items-center justify-center gap-2 text-micro font-bold text-gray-400 hover:text-brand-primary bg-white hover:bg-bg-base transition-all border-t border-ui-border"
          >
            {showAll ? (
              <>
                접기 <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                {reservations.length - 3}개의 예약 더보기 <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        )}
      </Card>
    </div>
  );
}
