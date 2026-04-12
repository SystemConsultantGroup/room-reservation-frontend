'use client';

import Link from 'next/link';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 select-none overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary opacity-[0.03] rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary opacity-[0.03] rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
          <span className="text-[200px] md:text-[300px] font-black text-brand-primary opacity-[0.03] tracking-tighter">
            404
          </span>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              페이지를 찾을 수 없습니다
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
              요청하신 페이지가 삭제되었거나 잘못된 경로입니다.<br />
              입력하신 주소가 정확한지 다시 한번 확인해 주세요.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button
              size="lg"
              leftIcon={<Home className="w-4 h-4" />}
              className="px-8 shadow-lg shadow-brand-primary/10"
            >
              메인으로 이동
            </Button>
          </Link>
        </div>

      </div>

      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
