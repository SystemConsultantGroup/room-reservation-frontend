'use client';

export type ToastType = 'success' | 'error';

export interface ToastEventDetail {
  message: string;
  type: ToastType;
}

type ToastListener = (message: string, type: ToastType) => void;

let listener: ToastListener | null = null;

export const toast = {
  subscribe: (l: ToastListener) => {
    listener = l;
    return () => {
      if (listener === l) listener = null;
    };
  },
  success: (message: string) => {
    if (listener) {
      listener(message, 'success');
    }
  },
  error: (message: string | undefined) => {
    if (listener && message) {
      listener(message, 'error');
    }
  },
};
