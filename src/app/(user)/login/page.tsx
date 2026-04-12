'use client';

import Image from 'next/image';
import { Shield } from 'lucide-react';
import { redirectToGoogleLogin } from '@/hooks/queries/useAuth';
import { TopHeader } from '@/components/layout/TopHeader';
import { UserProfile } from '@/components/layout/UserProfile';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    redirectToGoogleLogin();
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top Header */}
      <TopHeader title="로그인" rightElement={<UserProfile />} />
      <div className="flex-1 flex flex-col bg-bg-main items-center justify-center overflow-y-auto p-10">
        {/* Login Card Container */}
        <Card 
          className="max-w-[480px]" 
          icon={
            <div className="w-16 h-16 bg-bg-base rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-brand-primary" />
            </div>
          }
          title={<>서비스 이용을 위해<br />로그인이 필요합니다.</>}
          subtitle="구글 계정으로 로그인해 주세요."
          centerHeader
        >

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 border border-gray-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all font-bold group shadow-sm cursor-pointer"
          >
            <Image
              src="/images/google-logo.svg"
              alt="Google Logo"
              width={20}
              height={20}
            />
            Google로 계속하기
          </button>
        </Card>
      </div>
    </div>
  );
}
