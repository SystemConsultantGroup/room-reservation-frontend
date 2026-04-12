'use client';

import { useState, useEffect } from 'react';
import { useMeQuery } from '@/hooks/queries/useUser';
import { useMajorsQuery, useApplyMajorMutation, useMyApplicationsQuery, useCancelApplicationMutation } from '@/hooks/queries/useMajor';
import { toast } from '@/lib/toast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InfoBox } from '@/components/ui/InfoBox';
import { Select } from '@/components/ui/Select';
import { TopHeader } from '@/components/layout/TopHeader';
import { UserProfile } from '@/components/layout/UserProfile';
import { sortMajors, getMajorTypeLabel, MAJOR_TYPES } from '@/lib/major';
import { Badge } from '@/components/ui/Badge';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { formatDate } from '@/lib/date';

import type { MajorType } from '@/types';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useManagementUnitQuery } from '@/hooks/queries/useManagementUnit';

export default function RegistrationPage() {
  const { data: me } = useMeQuery();
  const { data: majorsList = [] } = useMajorsQuery();
  const { data: history = { applications: [] } } = useMyApplicationsQuery();
  const { data: managementUnit } = useManagementUnitQuery();
  const applyMajorMutation = useApplyMajorMutation();
  const cancelMutation = useCancelApplicationMutation();

  const [selectedMajorId, setSelectedMajorId] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<MajorType>('FIRST');
  const [errors, setErrors] = useState<{ majors?: string }>({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [cancelTargetId, setCancelTargetId] = useState<number | null>(null);

  const isStudent = me?.type === 'STUDENT';

  useEffect(() => {
    if (majorsList.length === 1 && selectedMajorId === 0) {
      setSelectedMajorId(majorsList[0].id);
    }
  }, [majorsList, selectedMajorId]);

  const handleMajorChange = (majorId: number) => {
    setSelectedMajorId(majorId);
    if (errors.majors) setErrors({});
  };

  const handleTypeChange = (type: MajorType) => {
    setSelectedType(type);
  };

  const handleSubmit = () => {
    if (selectedMajorId === 0) {
      setErrors({ majors: '전공을 선택해 주세요.' });
      return;
    }

    setErrors({});
    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsConfirmOpen(false);
    applyMajorMutation.mutate({
      majors: [{
        id: selectedMajorId,
        type: isStudent ? selectedType : undefined
      }],
    }, {
      onSuccess: () => {
        toast.success('전공 등록 신청이 완료되었습니다.');
      },
    });
  };

  return (
    <AuthGuard>
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopHeader title="전공 등록 관리" rightElement={<UserProfile />} />

        <main className="flex-1 flex flex-col items-center bg-bg-main overflow-y-auto p-6 md:p-10">
          <div className="w-full max-w-[1024px] flex flex-col lg:flex-row items-start gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Left Column: Form & Guide */}
            <div className="flex-1 flex flex-col gap-8 w-full">
              {/* Registration Form Card */}
              <Card
                title="전공 등록 신청"
                subtitle="등록을 희망하는 전공을 선택해 주세요."
              >
                <div className="space-y-8">
                  {/* Currently Registered Majors */}
                  <div className="bg-bg-base p-6 rounded-2xl border border-ui-border">
                    <label className="block text-xxs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">현재 등록된 전공</label>
                    <div className="flex flex-wrap gap-2">
                      {me?.majors && me.majors.length > 0 ? (
                        sortMajors(me.majors).map((m, idx) => (
                          <Badge key={idx} variant="outline" size="sm">
                            {m.name} {isStudent && m.type && `(${getMajorTypeLabel(m.type)})`}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 font-medium italic">등록된 전공이 없습니다.</span>
                      )}
                    </div>
                  </div>

                  {/* Majors Section */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">신청할 전공 정보</label>

                    <div className="flex gap-2">
                      {/* Major Dropdown */}
                      <div className="flex-1">
                        <Select
                          options={majorsList.map(m => ({ value: m.id, label: m.name }))}
                          value={selectedMajorId || 0}
                          onChange={handleMajorChange}
                          placeholder="전공 선택"
                          error={!!errors.majors && selectedMajorId === 0}
                        />
                      </div>

                      {/* Major Type Dropdown (Only for Students) */}
                      {isStudent && (
                        <div className="w-[120px]">
                          <Select
                            options={MAJOR_TYPES.map((type: MajorType) => ({
                              value: type,
                              label: getMajorTypeLabel(type)
                            }))}
                            value={selectedType}
                            onChange={handleTypeChange}
                          />
                        </div>
                      )}
                    </div>
                    {errors.majors && <p className="text-xs text-red-500 mt-2 ml-1 font-medium">{errors.majors}</p>}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-ui-border">
                    <Button
                      onClick={handleSubmit}
                      isLoading={applyMajorMutation.isPending}
                      size="xl"
                      fullWidth
                    >
                      신청하기
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Guide Section */}
              <InfoBox
                items={[
                  '신청 이후 관리자의 전공 승인을 거쳐야 시스템 이용이 가능합니다.',
                  ...(managementUnit?.approvalMethod
                    ? managementUnit.approvalMethod.split('\n').filter(line => line.trim() !== '')
                    : ['...'])
                ]}
              />
            </div>

            {/* Right Column: History */}
            <div className="w-full lg:w-[400px] shrink-0 self-start">
              <Card
                title="신청 진행 내역"
                subtitle="심사 중이거나 반려된 목록"
              >
                <div className="space-y-3">
                  {history.applications.length > 0 ? (
                    [...history.applications]
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-4 bg-bg-base rounded-2xl border border-ui-border transition-all">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-extrabold text-gray-700 leading-none">{app.major.name}</span>
                            <div className="flex items-center gap-2">
                              {app.type && <span className="text-xxs font-bold text-gray-400 tracking-wide uppercase">{getMajorTypeLabel(app.type)}</span>}
                              <span className="text-xxs font-bold text-gray-300 tracking-tight">{formatDate(app.createdAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={app.status === 'PENDING' ? 'warning' : 'danger'}
                              rounded="full"
                            >
                              {app.status === 'PENDING' ? '심사 중' : '반려됨'}
                            </Badge>
                            {app.status === 'PENDING' && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => setCancelTargetId(app.id)}
                                isLoading={cancelMutation.isPending && cancelMutation.variables === app.id}
                              >
                                취소
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="py-6 border border-ui-border rounded-2xl flex flex-col items-center justify-center bg-bg-base/30">
                      <p className="text-gray-400 text-xs font-bold">진행 중인 신청이 없습니다.</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main >

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmSubmit}
          title="전공 등록 신청 확인"
          content={
            `선택하신 전공으로 등록 신청을 진행하시겠습니까?\n\n신청 전공: ${majorsList.find(ml => ml.id === selectedMajorId)?.name || ''}${isStudent ? ` (${getMajorTypeLabel(selectedType)})` : ''
            }`
          }
          confirmText="신청하기"
        />

        <ConfirmModal
          isOpen={cancelTargetId !== null}
          onClose={() => setCancelTargetId(null)}
          onConfirm={() => {
            if (cancelTargetId) {
              cancelMutation.mutate(cancelTargetId, {
                onSuccess: () => {
                  toast.success('전공 신청이 취소되었습니다.');
                  setCancelTargetId(null);
                },
                onError: () => setCancelTargetId(null),
              });
            }
          }}
          title="전공 신청 취소 확인"
          content={
            cancelTargetId
              ? `${history.applications.find(app => app.id === cancelTargetId)?.major.name || ''}${isStudent && history.applications.find(app => app.id === cancelTargetId)?.type
                ? ` (${getMajorTypeLabel(history.applications.find(app => app.id === cancelTargetId)!.type)})`
                : ''
              } 신청을 취소하시겠습니까?`
              : ''
          }
          confirmText="신청 취소"
          variant="danger"
        />
      </div >
    </AuthGuard>
  );
}
