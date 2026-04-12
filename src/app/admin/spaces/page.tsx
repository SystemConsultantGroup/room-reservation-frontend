'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TopHeader } from '@/components/layout/TopHeader';
import { Button } from '@/components/ui/Button';
import {
  useRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation
} from '@/hooks/queries/useRoom';
import { RoomInfo, RoomCreateRequest, RoomUpdateRequest } from '@/types';
import { AdminSpaceTable } from '@/components/admin/spaces/AdminSpaceTable';
import { AdminSpaceModal } from '@/components/admin/spaces/AdminSpaceModal';
import { AdminSpaceDeleteModal } from '@/components/admin/spaces/AdminSpaceDeleteModal';
import { AdminRoomReservationsModal } from '@/components/admin/spaces/AdminRoomReservationsModal';
import { toast } from '@/lib/toast';

export default function AdminSpacesPage() {
  const [page, setPage] = useState(0);
  const { data: roomsPage, isLoading } = useRoomsQuery({ page });
  const rooms = roomsPage?.content || [];

  const createMutation = useCreateRoomMutation();
  const updateMutation = useUpdateRoomMutation();
  const deleteMutation = useDeleteRoomMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomInfo | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<RoomInfo | null>(null);

  const [isReservationsModalOpen, setIsReservationsModalOpen] = useState(false);
  const [selectedRoomForReservations, setSelectedRoomForReservations] = useState<RoomInfo | null>(null);

  const handleAddClick = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (room: RoomInfo) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (room: RoomInfo) => {
    setRoomToDelete(room);
    setIsDeleteModalOpen(true);
  };

  const handleViewReservationsClick = (room: RoomInfo) => {
    setSelectedRoomForReservations(room);
    setIsReservationsModalOpen(true);
  };

  const confirmDelete = () => {
    if (!roomToDelete) return;
    deleteMutation.mutate(roomToDelete.id, {
      onSuccess: () => {
        toast.success('공간이 삭제되었습니다.');
        setIsDeleteModalOpen(false);
        setRoomToDelete(null);
      },
    });
  };

  const handleSave = (data: RoomCreateRequest | RoomUpdateRequest) => {
    if (selectedRoom) {
      updateMutation.mutate({ roomId: selectedRoom.id, data }, {
        onSuccess: () => {
          toast.success('공간 정보가 수정되었습니다.');
          setIsModalOpen(false);
        },
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('새 공간이 등록되었습니다.');
          setIsModalOpen(false);
        },
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopHeader
        title="공간 관리"
        rightElement={
          <Button
            size="lg"
            leftIcon={<Plus className="w-4 h-4" />}
            className="h-10 px-6 shadow-lg shadow-brand-primary/20"
            onClick={handleAddClick}
          >
            새 공간 추가
          </Button>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-bg-main">
        <div className="space-y-6">
          <AdminSpaceTable
            rooms={rooms}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onViewReservations={handleViewReservationsClick}
            currentPage={roomsPage?.pageNumber}
            totalPages={roomsPage?.totalPages}
            onPageChange={setPage}
          />
        </div>
      </main>

      <AdminSpaceModal
        key={selectedRoom?.id || 'new'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        room={selectedRoom}
        onSave={handleSave}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <AdminSpaceDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        spaceName={roomToDelete?.name || ''}
        isPending={deleteMutation.isPending}
      />

      <AdminRoomReservationsModal
        isOpen={isReservationsModalOpen}
        onClose={() => setIsReservationsModalOpen(false)}
        room={selectedRoomForReservations}
      />
    </div>
  );
}
