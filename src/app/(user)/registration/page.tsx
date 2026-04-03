'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useMeQuery } from '@/hooks/queries/useUser';
import { useMajorsQuery, useApplyMajorMutation, useMyApplicationsQuery } from '@/hooks/queries/useMajor';
import { toast } from '@/lib/toast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InfoBox } from '@/components/ui/InfoBox';
import { Select } from '@/components/ui/Select';
import { TopHeader } from '@/components/layout/TopHeader';
import { UserProfile } from '@/components/layout/UserProfile';
import { sortMajors, getMajorTypeLabel, MAJOR_TYPES } from '@/lib/major';

import type { MajorType } from '@/type';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function RegistrationPage() {
  const { data: me } = useMeQuery();
  const { data: majorsList = [] } = useMajorsQuery();
  const { data: history = { applications: [] } } = useMyApplicationsQuery();
  const applyMajorMutation = useApplyMajorMutation();

  const [selectedMajors, setSelectedMajors] = useState<{ id: number; type: MajorType }[]>([
    { id: 0, type: 'FIRST' },
  ]);
  const [errors, setErrors] = useState<{ majors?: string }>({});

  const isStudent = me?.type === 'STUDENT';

  const handleMajorChange = (index: number, majorId: number) => {
    setSelectedMajors(prev => {
      const newMajors = [...prev];
      newMajors[index] = { ...newMajors[index], id: majorId };
      return newMajors;
    });
  };

  const handleTypeChange = (index: number, type: MajorType) => {
    setSelectedMajors(prev => {
      const newMajors = [...prev];
      newMajors[index] = { ...newMajors[index], type };
      return newMajors;
    });
  };

  const handleSubmit = () => {
    if (selectedMajors.length === 0) {
      setErrors({ majors: '하나 이상의 전공을 선택해야 합니다.' });
      return;
    }

    if (selectedMajors.some(m => m.id === 0)) {
      setErrors({ majors: '전공을 선택해 주세요.' });
      return;
    }

    setErrors({});

    applyMajorMutation.mutate({
      majors: selectedMajors.map(m => ({
        id: m.id,
        type: isStudent ? m.type : undefined
      })),
    }, {
      onSuccess: () => {
        toast.success('전공 등록 신청이 완료되었습니다!');
      },
    });
  };

  const currentlyRegisteredCount = me?.majors?.length || 0;
  const pendingCount = (history.applications || []).filter(app => app.status === 'PENDING').length;
  const isAtLimit = currentlyRegisteredCount + pendingCount >= 3;

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
                title="전공 등록 관리"
                subtitle="등록을 희망하는 전공과 유형을 선택해 주세요."
              >
                <div className="space-y-8">
                  {/* Currently Registered Majors */}
                  <div className="bg-bg-base p-6 rounded-2xl border border-ui-border">
                    <label className="block text-xxs font-bold text-gray-400 uppercase tracking-widest mb-3">현재 등록된 전공</label>
                    <div className="flex flex-wrap gap-2">
                      {me?.majors && me.majors.length > 0 ? (
                        sortMajors(me.majors).map((m, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-white border border-ui-border rounded-lg text-xs font-bold text-brand-primary shadow-sm"
                          >
                            {m.name} {isStudent && m.type && `(${getMajorTypeLabel(m.type)})`}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 font-medium italic">등록된 전공이 없습니다.</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 ml-1">전공 선택</label>
                      <Select
                        options={majorsList.map(m => ({ label: m.name, value: String(m.id) }))}
                        value={String(selectedMajors[0]?.id || 0)}
                        onChange={(val) => handleMajorChange(0, Number(val))}
                        error={!!errors.majors}
                        placeholder="전공을 선택해 주세요"
                      />
                      {errors.majors && <p className="text-xs text-red-500 ml-1 font-medium">{errors.majors}</p>}
                    </div>

                    {isStudent && (
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 ml-1">이수 유형</label>
                        <Select
                          options={MAJOR_TYPES.map(t => ({ label: getMajorTypeLabel(t), value: t }))}
                          value={selectedMajors[0]?.type || 'FIRST'}
                          onChange={(val) => handleTypeChange(0, val as MajorType)}
                          placeholder="이수 유형을 선택해 주세요"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSubmit}
                      disabled={applyMajorMutation.isPending || isAtLimit}
                      isLoading={applyMajorMutation.isPending}
                      className="min-w-[160px] h-12 text-base font-bold shadow-lg shadow-primary-main/20"
                    >
                      {isAtLimit ? '등록 한계 도달' : '등록 신청하기'}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Guide Section */}
              <InfoBox
                items={[
                  '승인 방법에 대한 내용이 이 곳에 들어갑니다.',
                ]}
              />
            </div>

            {/* Right Column: History */}
            <div className="w-full lg:w-[380px] lg:sticky lg:top-0 self-start">
              <Card title="신청 진행 내역">
                <div className="space-y-4">
                  {history.applications && history.applications.length > 0 ? (
                    history.applications.map((app) => (
                      <div key={app.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all duration-300">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-sm font-extrabold text-gray-700 leading-none">{app.major.name}</span>
                          <span className="text-xxs font-bold text-gray-400 tracking-wide uppercase">{getMajorTypeLabel(app.type)}</span>
                        </div>
                        <div className={`px-3 py-1.5 rounded-full text-xxs font-extrabold shadow-sm ${app.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-500 border border-amber-100'
                          : 'bg-red-50 text-red-500 border border-red-100'
                          }`}>
                          {app.status === 'PENDING' ? '대기중' : '반려됨'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                        <Plus className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-sm font-bold text-gray-400">신청 진행 중인 내역이 없습니다.</p>
                      <p className="text-xxs font-medium text-gray-300 mt-1">새로운 전공 등록 신청을 진행해 보세요.</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
