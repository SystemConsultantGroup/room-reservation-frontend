import Link from 'next/link';
import Image from 'next/image';

export function SidebarHeader() {
  return (
    <div className="pt-8 pb-7 px-6 bg-white border-b border-gray-100">
      <Link href="/" className="flex flex-col items-center group">
        <Image
          src="/logo.webp"
          alt="성균관대학교 로고"
          width={170}
          height={46}
          className="object-contain mb-4 transition-opacity duration-300 group-hover:opacity-80"
          priority
        />
        <div className="text-center w-full">
          <span className="block text-base font-extrabold text-gray-400 tracking-[0.1em] mb-1">
            반도체시스템공학과
          </span>
          <span className="block text-xl font-extrabold text-gray-500 tracking-tight">
            공간 예약
          </span>
        </div>
      </Link>
    </div>
  );
}
