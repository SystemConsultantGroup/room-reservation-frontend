'use client';

import { useState } from 'react';
import { TopHeader } from '@/components/layout/TopHeader';
import { useUsersQuery, userKeys } from '@/hooks/queries/useUser';
import { AdminUsersTable } from '@/components/admin/users/AdminUsersTable';
import { AdminUserDetailModal } from '@/components/admin/users/AdminUserDetailModal';
import { useCachedSearchDebounce } from '@/hooks/useCachedSearchDebounce';
import { PageResponse, UserInfo } from '@/types';

export default function AdminUsersPage() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { debouncedValue, cachedData, isDebouncing } = useCachedSearchDebounce<PageResponse<UserInfo>>({
    searchTerm,
    resolveQueryKey: (keyword) => userKeys.list({ page: 0, size: 8, ...(keyword && { keyword }) }),
  });

  const { data: usersPage, isLoading } = useUsersQuery({
    page,
    keyword: debouncedValue,
  });

  const finalData = page === 0 && cachedData?.content || usersPage?.content || [];
  const finalLoading = (isLoading && !cachedData) || isDebouncing;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleManageUser = (user: UserInfo) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopHeader title="유저 관리" />

      <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-bg-main">
        <div className="space-y-6">
            <AdminUsersTable
              users={finalData}
              isLoading={finalLoading}
              currentPage={page}
              totalPages={usersPage?.totalPages || 0}
              onPageChange={setPage}
              onSearch={handleSearch}
              onManageUser={handleManageUser}
            />
          </div>
        </main>

        <AdminUserDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedUser}
        />
      </div>
    );
  }
