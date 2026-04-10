'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { toast } from '@/lib/toast';
import { useUserQuery, useCancelUserFutureReservationsMutation } from '@/hooks/queries/useUser';
import { useApproveApplicationMutation, useRejectApplicationMutation } from '@/hooks/queries/useMajor';
import { getMajorTypeLabel } from '@/lib/major';
import { formatDate } from '@/lib/date';
import { RegistrationStatus } from '@/types/common';
import { UserInfo } from '@/types/user';
import { getUserTypeLabel } from '@/lib/user';

interface AdminUserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserInfo | null;
}

export function AdminUserDetailModal({ isOpen, onClose, user }: AdminUserDetailModalProps) {
  const userId = user?.id;
  const { data: userDetail, isLoading } = useUserQuery(userId || 0, { enabled: !!userId && isOpen });

  const approveMutation = useApproveApplicationMutation();
  const rejectMutation = useRejectApplicationMutation();
  const cancelReservationsMutation = useCancelUserFutureReservationsMutation();

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject' | 'revoke' | 'cancel_reservations' | null;
    applicationId?: number;
    title: string;
    content: string;
  }>({
    isOpen: false,
    type: null,
    title: '',
    content: '',
  });

  const handleApprove = (appId: number, majorName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'approve',
      applicationId: appId,
      title: '전공 신청 승인',
      content: `${majorName} 신청을 승인하시겠습니까?`,
    });
  };

  const handleReject = (appId: number, majorName: string, isRevoke = false) => {
    setConfirmModal({
      isOpen: true,
      type: isRevoke ? 'revoke' : 'reject',
      applicationId: appId,
      title: isRevoke ? '전공 승인 철회' : '전공 신청 반려',
      content: isRevoke
        ? `${majorName} 승인을 철회하시겠습니까?`
        : `${majorName} 신청을 반려하시겠습니까?`,
    });
  };

  const handleCancelReservations = () => {
    setConfirmModal({
      isOpen: true,
      type: 'cancel_reservations',
      title: '예약 일괄 삭제',
      content: '해당 유저의 모든 예약을 삭제하시겠습니까?\n이 작업은 복구할 수 없습니다.',
    });
  };

  const confirmAction = () => {
    if (confirmModal.type === 'approve' && confirmModal.applicationId) {
      approveMutation.mutate(confirmModal.applicationId, {
        onSuccess: () => {
          toast.success('승인되었습니다.');
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        },
      });
    } else if ((confirmModal.type === 'reject' || confirmModal.type === 'revoke') && confirmModal.applicationId) {
      const isRevoke = confirmModal.type === 'revoke';
      rejectMutation.mutate(confirmModal.applicationId, {
        onSuccess: () => {
          toast.success(isRevoke ? '승인이 철회되었습니다.' : '반려되었습니다.');
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        },
      });
    } else if (confirmModal.type === 'cancel_reservations' && userId) {
      cancelReservationsMutation.mutate(userId, {
        onSuccess: () => {
          toast.success('모든 향후 예약이 취소되었습니다.');
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        },
      });
    }
  };

  const sortedApplications = userDetail?.applications ? [...userDetail.applications].sort((a, b) => {
    const order: Record<RegistrationStatus, number> = { APPROVED: 1, PENDING: 2, REJECTED: 3 };
    return order[a.status] - order[b.status];
  }) : [];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="유저 관리"
        maxWidth="max-w-[600px]"
      >
        {isLoading ? (
          <div className="py-10 text-center text-gray-500 font-medium">유저 정보를 불러오는 중...</div>
        ) : userDetail ? (
          <div className="space-y-6 pb-2">
            <div className="bg-bg-base p-5 rounded-2xl border border-ui-border space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">이름</span>
                <span className="text-sm font-medium text-gray-900">{userDetail.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">이메일</span>
                <span className="text-sm font-medium text-gray-900">{userDetail.email}</span>
              </div>
              {userDetail.studentId && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-700">학번</span>
                  <span className="text-sm font-medium text-gray-900">{userDetail.studentId}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">유형</span>
                <span className="text-sm font-medium text-gray-900">{getUserTypeLabel(userDetail.type)}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2 px-1">전공 신청 내역</h3>
              {sortedApplications.length > 0 ? (
                <ul className="max-h-[300px] overflow-y-auto custom-scrollbar border border-ui-border rounded-xl bg-white divide-y divide-ui-border">
                  {sortedApplications.map((app) => {
                    const majorTypeLabel = app.type ? getMajorTypeLabel(app.type) : '교원';
                    return (
                      <li key={app.id} className="flex items-center justify-between p-3 transition-colors hover:bg-gray-50/50">
                        <div className="flex items-center gap-3">
                          <Badge size="sm" variant={app.status === 'APPROVED' ? 'success' : app.status === 'PENDING' ? 'warning' : 'danger'}>
                            {app.status === 'APPROVED' ? '승인됨' : app.status === 'PENDING' ? '대기 중' : '반려됨'}
                          </Badge>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">{app.major.name}
                              <span className="text-xs text-gray-500 font-medium ml-1">({majorTypeLabel})</span>
                            </span>
                            <span className="text-xxs text-gray-400 font-medium">{formatDate(app.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {app.status === 'PENDING' && (
                            <>
                              <Button size="sm" variant="primary" onClick={() => handleApprove(app.id, app.major.name)}>승인</Button>
                              <Button size="sm" variant="outline" onClick={() => handleReject(app.id, app.major.name)}>반려</Button>
                            </>
                          )}
                          {app.status === 'APPROVED' && (
                            <Button size="sm" variant="danger" onClick={() => handleReject(app.id, app.major.name, true)}>승인 철회</Button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4 bg-bg-base rounded-xl border border-ui-border">신청 내역이 없습니다.</p>
              )}
            </div>

            <div className="pt-4 border-t border-ui-border">
              <Button
                variant="danger"
                fullWidth
                onClick={handleCancelReservations}
                size="lg"
              >
                예약 일괄 삭제
              </Button>
              <p className="text-xxs text-gray-400 text-center mt-2">이 유저의 모든 예약을 삭제합니다.</p>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center text-red-500 font-medium">유저 정보를 확인할 수 없습니다.</div>
        )}
      </Modal >

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmAction}
        title={confirmModal.title}
        content={confirmModal.content}
        variant={confirmModal.type === 'approve' ? 'primary' : 'danger'}
        isLoading={approveMutation.isPending || rejectMutation.isPending || cancelReservationsMutation.isPending}
        confirmText="확인"
      />
    </>
  );
}
