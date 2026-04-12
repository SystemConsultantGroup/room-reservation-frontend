'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

interface AdminSpaceDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  spaceName: string;
  isPending: boolean;
}

export function AdminSpaceDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  spaceName, 
  isPending 
} : AdminSpaceDeleteModalProps) {
  const footer = (
    <>
      <Button variant="outline" onClick={onClose} fullWidth className="h-12 border-ui-border text-gray-500 rounded-2xl">
        취소
      </Button>
      <Button 
        onClick={onConfirm} 
        isLoading={isPending} 
        fullWidth 
        className="h-12 bg-red-500 hover:bg-red-600 border-none shadow-lg shadow-red-500/10 rounded-2xl text-white font-bold"
      >
        삭제하기
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="공간 삭제" footer={footer} maxWidth="max-w-[400px]">
      <div className="flex flex-col items-center text-center p-4 space-y-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">'{spaceName}' 공간을<br/>정말 삭제하시겠습니까?</h3>
          <p className="text-sm text-gray-500 leading-relaxed font-medium">
            공간을 삭제하면 관련 예약 및 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
          </p>
        </div>
      </div>
    </Modal>
  );
}
