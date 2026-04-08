import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { PublicEnvScript } from 'next-runtime-env';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchManagementUnit, prefetchManagementUnit } from "@/lib/prefetch";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const unit = await fetchManagementUnit();

    return {
      title: `${unit?.name || '성균관대학교'} 공간 예약`,
      description: `${unit?.name || '성균관대학교'}의 공간 예약을 위한 서비스입니다.`,
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return {
      title: "성균관대학교 공간 예약",
      description: "성균관대학교의 공간 예약을 위한 서비스입니다.",
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  await prefetchManagementUnit(queryClient);

  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <PublicEnvScript />
      </head>
      <body className="text-foreground bg-bg-base font-sans">
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}