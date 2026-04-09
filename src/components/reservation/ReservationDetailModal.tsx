import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Button } from '@/components/ui/Button';
import { ReservationDetail } from '@/types';
import { formatDate, extractTimeFromIso } from '@/lib/date';
import { useDeleteReservationMutation } from '@/hooks/queries/useReservation';
import { toast } from '@/lib/toast';

interface ReservationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: ReservationDetail;
  isMine: boolean;
}

export function ReservationDetailModal({
  isOpen,
  onClose,
  reservation,
  isMine,
}: ReservationDetailModalProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const deleteMutation = useDeleteReservationMutation();

  const handleCancelClick = () => {
    setIsConfirmOpen(true);
  };

  const confirmCancel = () => {
    deleteMutation.mutate(reservation.id, {
      onSuccess: () => {
        toast.success('예약이 취소되었습니다.');
        setIsConfirmOpen(false);
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  const isPast = new Date(reservation.endTime) < new Date();
  const startDateStr = formatDate(reservation.startTime);
  const startTimeStr = extractTimeFromIso(reservation.startTime);
  const endTimeStr = extractTimeFromIso(reservation.endTime);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="예약 상세 정보"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 py-2">
          <div className="bg-bg-base p-4 rounded-xl border border-ui-border space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-700">예약자</span>
              <span className="text-sm font-medium text-gray-900">{reservation.user.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-700">이용 날짜</span>
              <span className="text-sm font-medium text-gray-900">{startDateStr}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-700">이용 시간</span>
              <span className="text-sm font-medium text-gray-900">
                {startTimeStr} ~ {endTimeStr}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-700">사용 인원</span>
              <span className="text-sm font-medium text-gray-900">{reservation.attendeeCount}명</span>
            </div>
            <div className="flex justify-between items-start gap-4">
              <span className="text-sm font-bold text-gray-700 whitespace-nowrap mt-0.5">사용 목적</span>
              <span className="text-sm font-medium text-gray-900 text-right break-words max-w-[70%] leading-relaxed">
                {reservation.purpose}
              </span>
            </div>
          </div>

          {isMine && (
            <div className="pt-2">
              <Button
                variant="danger"
                fullWidth
                onClick={handleCancelClick}
                disabled={isPast}
              >
                예약 취소
              </Button>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmCancel}
        title="예약 취소 확인"
        content="해당 예약을 정말 취소하시겠습니까?"
        variant="danger"
        isLoading={deleteMutation.isPending}
        confirmText="예약 취소"
      />
    </>
  );
}
