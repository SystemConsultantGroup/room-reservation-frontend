import Link from 'next/link';

export function AdminSidebarHeader() {
  return (
    <div className="p-8 pb-10">
      <Link href="/admin" className="block">
        <h1 className="text-white text-2xl font-bold leading-tight tracking-[-0.5px]">
          ADMIN<br />PANEL
        </h1>
        <p className="text-xxs text-gray-500 mt-2 uppercase tracking-widest font-bold">
          Space Management System
        </p>
      </Link>
    </div>
  );
}
