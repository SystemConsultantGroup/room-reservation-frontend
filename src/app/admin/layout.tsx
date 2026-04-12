import { AdminLayoutWrapper } from '@/components/layout/admin/AdminLayoutWrapper';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
