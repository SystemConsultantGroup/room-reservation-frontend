'use client';

import { useState, useEffect } from 'react';
import { TopHeader } from '@/components/layout/TopHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { InfoBox } from '@/components/ui/InfoBox';
import { useNoticeQuery, useUpdateNoticeMutation } from '@/hooks/queries/useNotice';
import { toast } from '@/lib/toast';
import { Loader2 } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function AdminNoticePage() {
  const { data: notice, isLoading: queryLoading } = useNoticeQuery();
  const updateNoticeMutation = useUpdateNoticeMutation();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (notice) {
      setTitle(notice.title || '');
      setContent(notice.content || '');
    }
  }, [notice]);

  const handleSave = () => {
    setIsConfirmOpen(true);
  };

  const executeSave = () => {
    updateNoticeMutation.mutate(
      { title, content },
      {
        onSuccess: () => {
          toast.success('공지사항이 성공적으로 업데이트되었습니다.');
          setIsConfirmOpen(false);
        },
        onError: () => {
          toast.error('공지 업데이트에 실패했습니다.');
        },
      }
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopHeader title="공지 관리" />

      <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-bg-main flex flex-col items-center">
        <div className="w-full max-w-[1200px] flex flex-col lg:flex-row items-start gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Edit Form */}
          <div className="flex-1 w-full">
            <Card
              title="공지사항 수정"
              subtitle="사용자 메인 페이지에 노출되는 공지입니다."
            >
              {queryLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                  <p className="text-xs font-bold text-gray-400">공지 데이터를 불러오고 있습니다...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Title Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                      공지 제목
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="제목을 입력하세요"
                      className="w-full bg-bg-base border border-ui-border rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary/20 transition-all placeholder:text-gray-300"
                    />
                  </div>

                  {/* Content Textarea */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                      공지 내용
                    </label>
                    <textarea
                      rows={10}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="공지 내용을 입력하세요"
                      className="w-full bg-bg-base border border-ui-border rounded-2xl px-5 py-4 text-sm font-medium leading-relaxed text-gray-700 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary/20 transition-all placeholder:text-gray-300 min-h-[300px]"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-ui-border">
                    <Button
                      onClick={handleSave}
                      isLoading={updateNoticeMutation.isPending}
                      size="xl"
                      fullWidth
                      className="shadow-xl shadow-brand-primary/10"
                    >
                      공지 적용하기
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Guide section */}
          <div className="w-full lg:w-[360px] shrink-0 self-start">
            <InfoBox
              items={[
                '현재 시스템은 한 번에 하나의 메인 공지만 유지합니다.',
                '공지사항을 표시하고 싶지 않다면 제목과 내용을 모두 빈 칸으로 둔 상태로 적용해 주세요.',
              ]}
            />
          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeSave}
        isLoading={updateNoticeMutation.isPending}
        title="공지사항 적용 확인"
        content="입력하신 제목과 내용으로 사용자 메인 페이지 공지를 교체하시겠습니까?"
      />
    </div>
  );
}
