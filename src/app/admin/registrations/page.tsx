'use client';

import { useState } from 'react';
import { TopHeader } from '@/components/layout/TopHeader';
import { useApplicationsQuery, majorKeys } from '@/hooks/queries/useMajor';
import { AdminRegistrationsTable } from '@/components/admin/registrations/AdminRegistrationsTable';
import { useCachedSearchDebounce } from '@/hooks/useCachedSearchDebounce';
import { PageResponse, MajorApplicationDetail } from '@/type';

export default function AdminRegistrationsPage() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const { debouncedValue, cachedData, isDebouncing } = useCachedSearchDebounce<PageResponse<MajorApplicationDetail>>({
    searchTerm,
    resolveQueryKey: (keyword) => majorKeys.applicationList({ page: 0, size: 8, ...(keyword && { keyword }) }),
  });

  const { data: applicationsPage, isLoading } = useApplicationsQuery({
    page,
    keyword: debouncedValue,
  });

  const finalData = page === 0 && cachedData?.content || applicationsPage?.content || [];
  const finalLoading = (isLoading && !cachedData) || isDebouncing;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(0);
  };
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopHeader title="전공 신청 관리" />

      <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-bg-main">
        <div className="space-y-6">
          <AdminRegistrationsTable
            applications={finalData}
            isLoading={finalLoading}
            currentPage={page}
            totalPages={applicationsPage?.totalPages || 0}
            onPageChange={setPage}
            onSearch={handleSearch}
          />
        </div>
      </main>
    </div>
  );
}
