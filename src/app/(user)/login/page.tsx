'use client';

import Image from 'next/image';
import { Shield } from 'lucide-react';
import { redirectToGoogleLogin } from '@/hooks/queries/useAuth';
import { TopHeader } from '@/components/layout/TopHeader';
import { UserProfile } from '@/components/layout/UserProfile';

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
        <div className="bg-white p-12 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-ui-border w-full max-w-[480px] text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-10">
            {/* Main Icon */}
            <div className="w-16 h-16 bg-bg-base rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-brand-primary" />
            </div>
            {/* Title & Description */}
            <h2 className="text-2xl font-extrabold text-black mb-2 tracking-tight leading-tight">
              서비스 이용을 위해<br />로그인이 필요합니다.
            </h2>
            <p className="text-gray-400 text-sm">구글 계정으로 로그인해 주세요.</p>
          </div>

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
        </div>
      </div>
    </div>
  );
}
