'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { toast, type ToastType } from '@/lib/toast';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => {
      const next = [...prev, { id, message, type }];
      return next.length > 3 ? next.slice(1) : next;
    });

    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, [removeToast]);

  useEffect(() => {
    return toast.subscribe(addToast);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-3 w-full max-w-md px-4 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 p-4 rounded-2xl shadow-xl border animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto ${t.type === 'success'
              ? 'bg-white border-green-100 text-green-800'
              : 'bg-white border-red-100 text-red-800'
              }`}
          >
            {t.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            )}
            <p className="text-sm font-bold flex-1">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-300 hover:text-gray-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
