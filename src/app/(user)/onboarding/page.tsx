'use client';

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { useOnboardingMutation } from '@/hooks/queries/useAuth';
import { toast } from '@/lib/toast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useMajorsQuery } from '@/hooks/queries/useMajor';
import { useMeQuery } from '@/hooks/queries/useUser';
import type { UserType, MajorType } from '@/type';
import { TopHeader } from '@/components/layout/TopHeader';
import { UserProfile } from '@/components/layout/UserProfile';
import { Select } from '@/components/ui/Select';

export default function OnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: me } = useMeQuery();
  const { data: majorsList = [] } = useMajorsQuery();
  const onboardingMutation = useOnboardingMutation();

  const [name, setName] = useState('');
  const [userType, setUserType] = useState<Extract<UserType, 'STUDENT' | 'FACULTY'>>('STUDENT');
  const [studentId, setStudentId] = useState('');
  const [selectedMajors, setSelectedMajors] = useState<{ id: number; type: MajorType }[]>([
    { id: 0, type: 'FIRST' },
  ]);
  const [errors, setErrors] = useState<{ name?: string; studentId?: string; majors?: string }>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (me?.name && !name) {
      setName(me.name);
    }
  }, [me?.name, name]);

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
        toast.success('회원가입이 완료되었습니다!');
        router.push('/');
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopHeader title="추가 정보 입력" rightElement={<UserProfile />} />
      <main className="flex-1 flex flex-col bg-bg-main items-center justify-center overflow-y-auto p-6 md:p-10 pb-4 h-full relative z-0">
        <div className="bg-white p-12 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-ui-border w-full max-w-[560px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Title Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-extrabold text-black tracking-tight text-center">추가 정보 입력</h2>
            <p className="text-gray-400 text-sm mt-1 text-center">시스템 이용을 위해 아래 정보를 입력해 주세요.</p>
          </div>

          {/* User Type Selection (Student / Faculty) */}
          <div className="flex bg-bg-base p-1.5 rounded-2xl mb-8">
            <button
              onClick={() => setUserType('STUDENT')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${userType === 'STUDENT' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              학 생
            </button>
            <button
              onClick={() => setUserType('FACULTY')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${userType === 'FACULTY' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              교 원
            </button>
          </div>

          {/* Form Fields Section */}
          <div className="space-y-6">
            {/* Name Input Field */}
            <div>
              <label className="block text-xxs font-bold text-gray-400 uppercase tracking-widest mb-2">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                }}
                placeholder="이름을 입력하세요"
                className={`w-full bg-bg-base border ${errors.name ? 'border-red-400 focus:ring-red-400/10' : 'border-ui-border focus:ring-brand-primary/10'
                  } rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 transition-all placeholder:text-gray-300`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-2 ml-1">{errors.name}</p>}
            </div>

            {/* Student ID Field (Only for Students) */}
            {userType === 'STUDENT' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xxs font-bold text-gray-400 uppercase tracking-widest mb-2">학번</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => {
                    setStudentId(e.target.value);
                    if (errors.studentId) setErrors(prev => ({ ...prev, studentId: undefined }));
                  }}
                  placeholder="학번 10자리를 입력하세요"
                  className={`w-full bg-bg-base border ${errors.studentId ? 'border-red-400 focus:ring-red-400/10' : 'border-ui-border focus:ring-brand-primary/10'
                    } rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 transition-all placeholder:text-gray-300`}
                />
                {errors.studentId && <p className="text-xs text-red-500 mt-2 ml-1">{errors.studentId}</p>}
              </div>
            )}

            {/* Major Selection Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xxs font-bold text-gray-400 uppercase tracking-widest">전공</label>
                <button
                  onClick={handleAddMajor}
                  className="text-xxs font-bold text-brand-primary flex items-center gap-1 hover:underline cursor-pointer"
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
                          options={[
                            { value: 'FIRST', label: '제1전공' },
                            { value: 'SECOND', label: '제2전공' },
                            { value: 'THIRD', label: '제3전공' },
                          ]}
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
        </div>

        {/* Major Confirmation Modal */}
        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="전공 미선택 안내"
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
                fullWidth
              >
                취소
              </Button>
              <Button
                onClick={() => {
                  setShowConfirmModal(false);
                  handleOnboardingSubmit([]);
                }}
                fullWidth
              >
                진행하기
              </Button>
            </>
          }
        >
          전공이 선택되지 않았습니다.{"\n\n"}
          원활한 시스템 이용을 위해 하나 이상의 전공 등록이 권장됩니다.
          지금 선택하지 않으셔도 추후 '전공 추가 등록' 페이지에서 언제든지 신청하실 수 있습니다.{"\n\n"}
          정말 전공 없이 회원가입을 진행하시겠습니까?
        </Modal>
      </main>
    </div>
  );
}
