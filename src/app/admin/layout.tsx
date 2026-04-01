import type { Metadata } from 'next';
import { AdminLayoutWrapper } from '@/components/layout/admin/AdminLayoutWrapper';

export const metadata: Metadata = {
  title: 'ACADEMIC ATELIER - 관리자 패널',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
