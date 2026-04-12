'use client';

import { Table, TableColumn } from '@/components/ui/Table';
import { UserInfo } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { getMajorTypeLabel, sortMajors } from '@/lib/major';
import { getUserTypeLabel } from '@/lib/user';

interface AdminUsersTableProps {
  users: UserInfo[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch: (keyword: string) => void;
  onManageUser: (user: UserInfo) => void;
}

export function AdminUsersTable({
  users,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  onManageUser,
}: AdminUsersTableProps) {
  const columns: TableColumn<UserInfo>[] = [
    {
      header: '이름',
      className: 'whitespace-nowrap min-w-[100px]',
      render: (item) => (
        <span className="text-sm font-bold text-gray-900">{item.name}</span>
      ),
    },
    {
      header: '학번',
      className: 'whitespace-nowrap min-w-[120px]',
      render: (item) => (
        <span className="text-sm font-medium text-gray-500">{item.studentId || '-'}</span>
      ),
    },
    {
      header: '유형',
      className: 'whitespace-nowrap min-w-[80px]',
      render: (item) => (
        <span className="text-sm font-medium text-gray-600">
          {getUserTypeLabel(item.type)}
        </span>
      ),
    },
    {
      header: '이메일',
      className: 'whitespace-nowrap min-w-[200px]',
      render: (item) => (
        <span className="text-sm font-medium text-gray-400">{item.email}</span>
      ),
    },
    {
      header: '소속 전공',
      className: 'min-w-[250px]',
      render: (item) => {
        const sortedMajors = sortMajors(item.majors);
        const isStudent = item.type === 'STUDENT';

        return (
          <div className="flex flex-wrap gap-2 py-1">
            {sortedMajors.map((m, idx) => (
              <Badge key={idx} variant="outline" size="sm">
                {m.name} {isStudent && m.type && `(${getMajorTypeLabel(m.type)})`}
              </Badge>
            ))}
            {sortedMajors.length === 0 && <span className="text-xs text-gray-300">-</span>}
          </div>
        );
      },
    },
    {
      header: '작업',
      headerClassName: 'text-center',
      className: 'text-center whitespace-nowrap w-[100px]',
      render: (item) => (
        <button
          onClick={() => onManageUser(item)}
          className="text-brand-primary font-bold text-xs hover:underline transition-all active:scale-95 cursor-pointer"
        >
          관리
        </button>
      ),
    },
  ];

  return (
    <Table
      data={users}
      columns={columns}
      showSearch
      onSearch={onSearch}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      title="가입 사용자 목록"
      searchPlaceholder="이름, 학번, 이메일 검색"
    />
  );
}
