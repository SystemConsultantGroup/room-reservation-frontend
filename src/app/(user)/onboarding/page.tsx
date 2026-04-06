'use client';

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { useOnboardingMutation } from '@/hooks/queries/useAuth';
import { toast } from '@/lib/toast';
import { Button } from '@/components/ui/Button';
import { useMajorsQuery } from '@/hooks/queries/useMajor';
import { useMeQuery } from '@/hooks/queries/useUser';
import type { UserType, MajorType } from '@/type';
import { TopHeader } from '@/components/layout/TopHeader';
import { UserProfile } from '@/components/layout/UserProfile';
import { Select } from '@/components/ui/Select';
import { MAJOR_TYPES, getMajorTypeLabel } from '@/lib/major';
import { Card } from '@/components/ui/Card';
import { InfoBox } from '@/components/ui/InfoBox';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Input } from '@/components/ui/Input';
import { useManagementUnitQuery } from '@/hooks/queries/useManagementUnit';

export default function OnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: me } = useMeQuery();
  const { data: majorsList = [] } = useMajorsQuery();
  const { data: managementUnit } = useManagementUnitQuery();
  const onboardingMutation = useOnboardingMutation();

  const [name, setName] = useState('');
  const [userType, setUserType] = useState<Extract<UserType, 'STUDENT' | 'FACULTY'>>('STUDENT');
  const [studentId, setStudentId] = useState('');
  const [selectedMajors, setSelectedMajors] = useState<{ id: number; type: MajorType }[]>([
    { id: 0, type: 'FIRST' },
  ]);
  const [errors, setErrors] = useState<{ name?: string; studentId?: string; majors?: string }>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (me?.name && !name) {
      setName(me.name);
    }
  }, [me?.name, name]);

  useEffect(() => {
    if (majorsList.length === 1 && selectedMajors.some(m => m.id === 0)) {
      setSelectedMajors(prev => prev.map(m => (m.id === 0 ? { ...m, id: majorsList[0].id } : m)));
    }
  }, [majorsList, selectedMajors]);

  const handleAddMajor = () => {
    setSelectedMajors(prev => [...prev, { id: 0, type: 'FIRST' }]);
  };

  const handleRemoveMajor = (index: number) => {
    setSelectedMajors(prev => prev.filter((_, i) => i !== index));
  };

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
    const newErrors: { name?: string; studentId?: string; majors?: string } = {};

    if (!name.trim()) {
      newErrors.name = '이름을 입력해 주세요.';
    }
    if (userType === 'STUDENT') {
      if (!studentId.trim()) {
        newErrors.studentId = '학번을 입력해 주세요.';
      } else if (!/^\d{10}$/.test(studentId)) {
        newErrors.studentId = '학번은 10자리 숫자여야 합니다.';
      }
    }

    if (selectedMajors.some(m => m.id === 0)) {
      newErrors.majors = '전공을 선택해 주세요.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (selectedMajors.length === 0) {
      setShowConfirmModal(true);
      return;
    }

    setErrors({});
    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsConfirmOpen(false);
    handleOnboardingSubmit(selectedMajors);
  };

  const handleOnboardingSubmit = (validMajors: { id: number; type: MajorType }[]) => {
    onboardingMutation.mutate({
      name,
      userType,
      studentId: userType === 'STUDENT' ? studentId : undefined,
      majors: validMajors.map(m => ({
        id: m.id,
        type: userType === 'STUDENT' ? m.type : undefined
      })),
    }, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
        toast.success('회원가입이 완료되었습니다.');
        router.push('/');
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopHeader title="추가 정보 입력" rightElement={<UserProfile />} />
      <main className="flex-1 flex flex-col bg-bg-main items-center overflow-y-auto p-6 md:p-10 relative z-0">
        <div className="w-full max-w-[1024px] flex flex-col lg:flex-row items-start justify-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Form Card */}
          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <Card
              className="max-w-[560px] w-full"
              title="추가 정보 입력"
              subtitle="시스템 이용을 위해 아래 정보를 입력해 주세요."
              centerHeader
            >
              {/* User Type Selection (Student / Faculty) */}
              <div className="flex bg-bg-base p-1.5 rounded-2xl mb-8">
                <button
                  onClick={() => setUserType('STUDENT')}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${userType === 'STUDENT' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  학 생
                </button>
                <button
                  onClick={() => setUserType('FACULTY')}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${userType === 'FACULTY' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  교 원
                </button>
              </div>

              {/* Form Fields Section */}
              <div className="space-y-6">
                {/* Name Input Field */}
                <Input
                  label="이름"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  placeholder="이름을 입력하세요"
                  error={errors.name}
                />

                {/* Student ID Field (Only for Students) */}
                {userType === 'STUDENT' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <Input
                      label="학번"
                      type="text"
                      value={studentId}
                      onChange={(e) => {
                        setStudentId(e.target.value);
                        if (errors.studentId) setErrors(prev => ({ ...prev, studentId: undefined }));
                      }}
                      placeholder="학번 10자리를 입력하세요"
                      error={errors.studentId}
                    />
                  </div>
                )}

                {/* Major Selection Section */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xxs font-bold text-gray-400 uppercase tracking-widest ml-1">전공</label>
                    <button
                      onClick={handleAddMajor}
                      disabled={selectedMajors.length >= majorsList.length}
                      className="text-xxs font-bold text-brand-primary flex items-center gap-1 hover:underline cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline"
                    >
                      <Plus className="w-3 h-3" /> 전공 추가
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedMajors.map((major, index) => (
                      <div key={index} className="flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        {/* Major Dropdown */}
                        <div className="flex-1">
                          <Select
                            options={majorsList.map(m => ({ value: m.id, label: m.name }))}
                            value={major.id || 0}
                            onChange={(val) => {
                              handleMajorChange(index, val);
                              if (errors.majors) setErrors(prev => ({ ...prev, majors: undefined }));
                            }}
                            placeholder="전공 선택"
                            error={!!errors.majors}
                          />
                        </div>
                        {/* Major Type Dropdown (Only for Students) */}
                        {userType === 'STUDENT' && (
                          <div className="w-[120px]">
                            <Select
                              options={MAJOR_TYPES.map((type: MajorType) => ({
                                value: type,
                                label: getMajorTypeLabel(type)
                              }))}
                              value={major.type}
                              onChange={(val) => handleTypeChange(index, val)}
                            />
                          </div>
                        )}
                        {/* Remove Major Button */}
                        <button
                          onClick={() => handleRemoveMajor(index)}
                          className="w-12 h-[46px] flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {errors.majors && <p className="text-xs text-red-500 mt-2 ml-1">{errors.majors}</p>}
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    onClick={handleSubmit}
                    isLoading={onboardingMutation.isPending}
                    size="xl"
                    fullWidth
                  >
                    회원가입 완료
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Guide Section */}
          <div className="w-full lg:w-[360px] shrink-0 self-start lg:mt-0">
            <InfoBox
              items={[
                '회원가입 이후 관리자의 전공 승인을 거쳐야 시스템 이용이 가능합니다.',
                ...(managementUnit?.approvalMethod
                  ? managementUnit.approvalMethod.split('\n').filter(line => line.trim() !== '')
                  : ['...'])
              ]}
            />
          </div>
        </div>

        {/* Major Not Selected Warning Modal */}
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => {
            setShowConfirmModal(false);
            handleOnboardingSubmit([]);
          }}
          title="전공 미선택 안내"
          content={`전공이 선택되지 않았습니다.\n\n원활한 시스템 이용을 위해 하나 이상의 전공 등록이 권장됩니다.\n지금 선택하지 않으셔도 추후 '전공 추가 등록' 페이지에서 언제든지 신청하실 수 있습니다.\n\n정말 전공 없이 회원가입을 진행하시겠습니까?`}
          confirmText="진행하기"
          cancelText="취소"
        />

        {/* Signup Confirmation Modal */}
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmSubmit}
          title="입력 정보 확인"
          content={`입력하신 정보로 회원가입을 완료하시겠습니까?\n\n이름: ${name}\n${userType === 'STUDENT' ? `학번: ${studentId}\n` : ''}선택 전공:\n${selectedMajors
            .map(m => {
              const major = majorsList.find(ml => ml.id === m.id);
              return `- ${major?.name || ''}${userType === 'STUDENT' ? ` (${getMajorTypeLabel(m.type)})` : ''}`;
            })
            .join('\n')}`}
          confirmText="가입 완료"
        />
      </main>
    </div>
  );
}
