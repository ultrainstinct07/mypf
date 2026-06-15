'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import type { Toast as ToastType } from '@/types';

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(
        () => onClose(toast.id),
        toast.duration || 3000
      );
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  };

  const colors = {
    success: 'border-green-500 text-green-600 dark:text-green-450',
    error: 'border-red-500 text-red-600 dark:text-red-450',
    info: 'border-crimson text-crimson',
  };

  const Icon = icons[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`flex items-center gap-3 p-4 border-2 border-black dark:border-white rounded-none shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.25)] bg-white dark:bg-dark-card ${colors[toast.type]}`}
    >
      <Icon size={20} />
      <p className="flex-1 text-sm font-bold uppercase tracking-wider">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="p-1 hover:text-crimson transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center touch-manipulation"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: ToastType[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}

