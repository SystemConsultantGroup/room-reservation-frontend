'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useDeleteReservationMutation } from '@/hooks/queries/useReservation';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ReservationDetail } from '@/types';
import { toast } from '@/lib/toast';

interface ReservationContextMenuProps {
  children: (handleContextMenu: (e: React.MouseEvent) => void) => ReactNode;
  reservation: ReservationDetail;
  disabled?: boolean;
}

export function ReservationContextMenu({ children, reservation, disabled }: ReservationContextMenuProps) {
  const [menuPos, setMenuPos] = useState<{ x: number, y: number } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const deleteMutation = useDeleteReservationMutation();

  const handleContextMenu = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setMenuPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleClickOutside = () => setMenuPos(null);
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleClickOutside);
    window.addEventListener('scroll', handleClickOutside, true);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleClickOutside);
      window.removeEventListener('scroll', handleClickOutside, true);
    };
  }, []);

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuPos(null);
    setShowConfirm(true);
  };

  const handleConfirmCancel = () => {
    deleteMutation.mutate(reservation.id, {
      onSuccess: () => {
        toast.success('예약이 취소되었습니다.');
        setShowConfirm(false);
      },
    });
  };

  return (
    <>
      {children(handleContextMenu)}

      {menuPos && (
        <div
          className="fixed z-[999] bg-white border border-gray-200 shadow-xl rounded-lg py-1 min-w-[140px] animate-in fade-in zoom-in-95 duration-100 origin-top-left"
          style={{ top: menuPos.y, left: menuPos.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleCancelClick}
            className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors font-bold cursor-pointer"
          >
            예약 취소
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmCancel}
        title="예약 취소 확인"
        content="해당 예약을 취소하시겠습니까?"
        confirmText="예약 취소"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
