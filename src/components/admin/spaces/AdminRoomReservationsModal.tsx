'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Table, TableColumn } from '@/components/ui/Table';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useRoomFutureReservationsQuery } from '@/hooks/queries/useRoom';
import { useDeleteReservationMutation } from '@/hooks/queries/useReservation';
import { toast } from '@/lib/toast';
import { ReservationDetail, RoomInfo } from '@/types';
import { formatDate, extractTimeFromIso } from '@/lib/date';


interface AdminRoomReservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: RoomInfo | null;
}

export function AdminRoomReservationsModal({ isOpen, onClose, room }: AdminRoomReservationsModalProps) {
  const [page, setPage] = useState(0);
  const roomId = room?.id;

  const { data: pageData, isLoading } = useRoomFutureReservationsQuery(roomId || 0, { page, size: 5 }, { enabled: !!roomId && isOpen });
  const deleteMutation = useDeleteReservationMutation();

  const [cancelTargetId, setCancelTargetId] = useState<number | null>(null);

  const reservations = pageData?.content || [];

  const columns: TableColumn<ReservationDetail>[] = [
    {
      header: '예약자',
      className: 'whitespace-nowrap min-w-[120px]',
      render: (r) => (
        <span className="text-sm font-bold text-gray-900">{r.user.name}</span>
      ),
    },
    {
      header: '사용 목적',
      className: 'min-w-[150px]',
      render: (r) => (
        <span className="text-sm text-gray-700">{r.purpose}</span>
      ),
    },
    {
      header: '인원',
      className: 'whitespace-nowrap min-w-[100px]',
      render: (r) => (
        <span className="text-sm text-gray-600">{r.attendeeCount}명</span>
      ),
    },
    {
      header: '이용 시간',
      className: 'whitespace-nowrap min-w-[200px]',
      render: (r) => {
        const startDateStr = formatDate(r.startTime);
        const startTimeStr = extractTimeFromIso(r.startTime);
        const endTimeStr = extractTimeFromIso(r.endTime);
        return (
          <span className="text-sm text-gray-600 font-medium">
            {startDateStr} {startTimeStr} ~ {endTimeStr}
          </span>
        );
      },
    },
    {
      header: '작업',
      headerClassName: 'text-center',
      className: 'text-center whitespace-nowrap w-[100px]',
      render: (r) => (
        <button
          onClick={() => setCancelTargetId(r.id)}
          className="text-red-400 font-bold text-xs hover:underline transition-all active:scale-95 cursor-pointer"
        >
          삭제
        </button>
      ),
    },
  ];


  const handleConfirmCancel = () => {
    if (cancelTargetId) {
      deleteMutation.mutate(cancelTargetId, {
        onSuccess: () => {
          toast.success('예약이 성공적으로 취소되었습니다.');
          setCancelTargetId(null);
        },
        onError: () => {
          setCancelTargetId(null);
        }
      });
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`${room?.name || ''} 예약 목록`}
        maxWidth="max-w-[900px]"
      >
        <div className="py-2">
          <Table<ReservationDetail>
            title=""
            data={reservations}
            columns={columns}
            isLoading={isLoading}
            showSearch={false}
            emptyMessage="예약 내역이 없습니다."
            currentPage={pageData?.pageNumber}
            totalPages={pageData?.totalPages}
            onPageChange={setPage}
          />
        </div>
      </Modal>

      <ConfirmModal
        isOpen={cancelTargetId !== null}
        onClose={() => setCancelTargetId(null)}
        onConfirm={handleConfirmCancel}
        title="예약 삭제 확인"
        content="해당 예약을 삭제하시겠습니까?"
        confirmText="삭제"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
