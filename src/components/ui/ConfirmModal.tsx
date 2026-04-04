'use client';

import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'primary' | 'danger';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  content,
  confirmText = '확인',
  cancelText = '취소',
  isLoading = false,
  variant = 'primary'
}: ConfirmModalProps) {
  const footer = (
    <div className="flex gap-3 w-full">
      <Button
        variant="outline"
        onClick={onClose}
        fullWidth
        className="h-12 border-ui-border text-gray-500 rounded-2xl"
      >
        {cancelText}
      </Button>
      <Button
        variant={variant === 'danger' ? 'danger' : 'primary'}
        onClick={onConfirm}
        isLoading={isLoading}
        fullWidth
        className={`h-12 rounded-2xl font-bold ${variant === 'primary' ? 'shadow-lg shadow-brand-primary/20' : ''
          }`}
      >
        {confirmText}
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} maxWidth="max-w-[500px]">
      <p className="text-sm font-medium text-gray-500 leading-relaxed whitespace-pre-wrap">
        {content}
      </p>
    </Modal>
  );
}
