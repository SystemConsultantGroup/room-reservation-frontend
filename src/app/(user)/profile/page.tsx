'use client';

import { useState, useEffect } from 'react';
import { useMeQuery, useUpdateMeMutation } from '@/hooks/queries/useUser';
import { toast } from '@/lib/toast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { TopHeader } from '@/components/layout/TopHeader';
import { UserProfile } from '@/components/layout/UserProfile';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function ProfilePage() {
  const { data: me } = useMeQuery();
  const updateMeMutation = useUpdateMeMutation();

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (me?.name) {
      setName(me.name);
    }
  }, [me]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('이름을 입력해 주세요.');
      return;
    }

    if (name.trim() === me?.name) {
      setError('변경된 내용이 없습니다.');
      return;
    }

    setError('');
    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsConfirmOpen(false);
    updateMeMutation.mutate(
      { data: { name: name.trim() } },
      {
        onSuccess: () => {
          toast.success('내 정보가 수정되었습니다.');
        },
        onError: () => {
          toast.error('정보 수정에 실패했습니다.');
        }
      }
    );
  };

  return (
    <AuthGuard>
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopHeader title="내 정보 수정" rightElement={<UserProfile />} />

        <main className="flex-1 flex flex-col items-center bg-bg-main overflow-y-auto p-6 md:p-10">
          <div className="w-full max-w-[600px] flex flex-col items-start gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex-1 flex flex-col gap-8 w-full">
              <Card
                title="내 정보 수정"
                subtitle="기본 정보를 수정할 수 있습니다."
              >
                <div className="space-y-8">
                  <div>
                    <Input
                      label="이름"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="이름을 입력하세요"
                      maxLength={50}
                      error={error}
                      disabled={updateMeMutation.isPending}
                    />
                  </div>

                  <div className="pt-6 border-t border-ui-border">
                    <Button
                      onClick={handleSubmit}
                      isLoading={updateMeMutation.isPending}
                      size="xl"
                      fullWidth
                    >
                      저장하기
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmSubmit}
          title="내 정보 수정 확인"
          content={`이름을 '${name.trim()}'(으)로 수정하시겠습니까?`}
          confirmText="수정하기"
          isLoading={updateMeMutation.isPending}
        />
      </div>
    </AuthGuard>
  );
}
