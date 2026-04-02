'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[4px] animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-ui-border">
          <h3 className="text-lg font-extrabold text-black tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-base rounded-xl transition-colors cursor-pointer group"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-sm font-medium text-gray-600 leading-relaxed whitespace-pre-wrap">
            {children}
          </div>
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex gap-3 p-6 bg-bg-base/50 border-t border-ui-border">
            {footer}
          </div>
        )}
      </div>
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
    </div>,
    document.body
  );
}
