'use client';

import { useState } from 'react';
import { Table, TableColumn } from '@/components/ui/Table';
import { MajorApplicationDetail } from '@/type';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useApproveApplicationMutation, useRejectApplicationMutation } from '@/hooks/queries/useMajor';
import { toast } from '@/lib/toast';
import { getMajorTypeLabel } from '@/lib/major';
import { formatDate } from '@/lib/date';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface AdminRegistrationsTableProps {
  applications: MajorApplicationDetail[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch: (keyword: string) => void;
}

export function AdminRegistrationsTable({
  applications,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
}: AdminRegistrationsTableProps) {
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject' | null;
    applicationId: number | null;
    userName: string;
    majorName: string;
    majorTypeLabel: string;
  }>({
    isOpen: false,
    type: null,
    applicationId: null,
    userName: '',
    majorName: '',
    majorTypeLabel: '',
  });

  const approveMutation = useApproveApplicationMutation();
  const rejectMutation = useRejectApplicationMutation();

  const handleApprove = (id: number, userName: string, majorName: string, majorTypeLabel: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'approve',
      applicationId: id,
      userName,
      majorName,
      majorTypeLabel,
    });
  };

  const handleReject = (id: number, userName: string, majorName: string, majorTypeLabel: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'reject',
      applicationId: id,
      userName,
      majorName,
      majorTypeLabel,
    });
  };

  const executeAction = () => {
    if (!confirmModal.applicationId || !confirmModal.type) return;

    const mutation = confirmModal.type === 'approve' ? approveMutation : rejectMutation;
    mutation.mutate(confirmModal.applicationId, {
      onSuccess: () => {
        toast.success(`${confirmModal.type === 'approve' ? '승인' : '거절'}되었습니다.`);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  const columns: TableColumn<MajorApplicationDetail>[] = [
    {
      header: '이름',
      className: 'whitespace-nowrap min-w-[100px]',
      render: (item) => <span className="text-sm font-bold text-gray-900">{item.user.name}</span>,
    },
    {
      header: '학번',
      className: 'whitespace-nowrap min-w-[120px]',
      render: (item) => <span className="text-sm font-medium text-gray-500">{item.user.studentId || '-'}</span>,
    },
    {
      header: '유형',
      className: 'whitespace-nowrap min-w-[80px]',
      render: (item) => <span className="text-sm font-medium text-gray-600">{item.user.type === 'FACULTY' ? '교원' : '학생'}</span>,
    },
    {
      header: '이메일',
      className: 'whitespace-nowrap min-w-[180px]',
      render: (item) => <span className="text-sm font-medium text-gray-400">{item.user.email}</span>,
    },
    {
      header: '신청 항목 및 관리',
      render: (item) => (
        <div className="space-y-3 py-2">
          {item.applications.map((app) => {
            const majorTypeLabel = app.type ? getMajorTypeLabel(app.type) : '교원';

            return (
              <div key={app.id} className="flex items-center justify-between p-3.5 border border-amber-100 bg-amber-50/30 rounded-2xl transition-all">
                <div className="flex items-center gap-3.5">
                  <Badge variant="warning">
                    {majorTypeLabel}
                  </Badge>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{app.major.name}</span>
                    <span className="text-xxs text-gray-400 font-bold">
                      {formatDate(app.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(app.id, item.user.name, app.major.name, majorTypeLabel)}
                        isLoading={approveMutation.isPending && approveMutation.variables === app.id}
                        className="h-8 px-4"
                      >
                        승인
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(app.id, item.user.name, app.major.name, majorTypeLabel)}
                        isLoading={rejectMutation.isPending && rejectMutation.variables === app.id}
                        className="h-8 px-4"
                      >
                        거절
                      </Button>
                    </>
                  }
                </div>
              </div>
            );
          })}
        </div>
      ),
      className: 'min-w-[450px]'
    }
  ];

  return (
    <>
      <Table
        data={applications}
        columns={columns}
        showSearch
        onSearch={onSearch}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        title="전공 등록 신청 목록"
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={executeAction}
        isLoading={approveMutation.isPending || rejectMutation.isPending}
        title={confirmModal.type === 'approve' ? '전공 신청 승인' : '전공 신청 거절'}
        content={
          `${confirmModal.userName}님의 ${confirmModal.majorName}(${confirmModal.majorTypeLabel}) 신청을 정말 ${confirmModal.type === 'approve' ? '승인' : '거절'}하시겠습니까?`}
        variant={confirmModal.type === 'reject' ? 'danger' : 'primary'}
      />
    </>
  );
}
