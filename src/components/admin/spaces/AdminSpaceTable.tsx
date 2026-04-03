'use client';

import { Table, TableColumn } from '@/components/ui/Table';
import { RoomInfo } from '@/type';
import { getAccessPolicyLabel } from '@/lib/room';
import { Badge } from '@/components/ui/Badge';

interface AdminSpaceTableProps {
  rooms: RoomInfo[];
  isLoading: boolean;
  onEdit: (room: RoomInfo) => void;
  onDelete: (room: RoomInfo) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function AdminSpaceTable({
  rooms,
  isLoading,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange
}: AdminSpaceTableProps) {
  const columns: TableColumn<RoomInfo>[] = [
    {
      header: '이름',
      className: 'whitespace-nowrap',
      render: (room) => (
        <span className="text-sm font-bold text-gray-900">{room.name}</span>
      ),
    },
    {
      header: '위치',
      className: 'whitespace-nowrap',
      render: (room) => (
        <span className="text-sm text-gray-500 font-medium">{room.roomNumber}</span>
      ),
    },
    {
      header: '수용 인원',
      className: 'whitespace-nowrap',
      render: (room) => (
        <span className="text-sm text-gray-600">{room.capacity}명</span>
      ),
    },
    {
      header: '이용 권한',
      className: 'whitespace-nowrap',
      render: (room) => (
        <span className="text-sm text-gray-500 font-medium">
          {getAccessPolicyLabel(room.accessPolicy)}
        </span>
      ),
    },
    {
      header: '전공',
      className: 'whitespace-nowrap min-w-[120px]',
      render: (room) => (
        <div className="flex flex-wrap gap-1">
          {room.majors && (
            room.majors.map((m) => (
              <Badge key={m.id} variant="primary" size="xs">
                {m.name}
              </Badge>
            ))
          )}
        </div>
      ),
    },
    {
      header: '작업',
      headerClassName: 'text-center',
      className: 'text-center whitespace-nowrap w-[120px]',
      render: (room) => (
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onEdit(room)}
            className="text-brand-primary font-bold text-xs hover:underline transition-all active:scale-95 cursor-pointer"
          >
            수정
          </button>
          <button
            onClick={() => onDelete(room)}
            className="text-red-400 font-bold text-xs hover:underline transition-all active:scale-95 cursor-pointer"
          >
            삭제
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table<RoomInfo>
      title="공간 목록"
      data={rooms}
      columns={columns}
      isLoading={isLoading}
      showSearch={false}
      emptyMessage="등록된 공간이 없습니다."
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
