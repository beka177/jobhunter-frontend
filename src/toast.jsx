import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

let toastSeq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const show = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++toastSeq;
    setToasts(prev => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => remove(id), duration);
    }
    return id;
  }, [remove]);

  const api = {
    show,
    success: (msg, d) => show(msg, 'success', d),
    error: (msg, d) => show(msg, 'error', d),
    info: (msg, d) => show(msg, 'info', d),
    dismiss: remove,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ toasts, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onClose={() => onClose(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(r);
  }, []);

  const palette = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />,
      bg: 'bg-white dark:bg-gray-800 border-green-200 dark:border-green-800/50',
      text: 'text-gray-900 dark:text-gray-100',
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />,
      bg: 'bg-white dark:bg-gray-800 border-red-200 dark:border-red-800/50',
      text: 'text-gray-900 dark:text-gray-100',
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
      bg: 'bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800/50',
      text: 'text-gray-900 dark:text-gray-100',
    },
  };
  const p = palette[toast.type] || palette.info;

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 min-w-[280px] max-w-md px-4 py-3 rounded-xl shadow-lg border ${p.bg} ${p.text} transform transition-all duration-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
      role="status"
    >
      <div className="flex-shrink-0 mt-0.5">{p.icon}</div>
      <div className="flex-1 text-sm font-medium leading-snug whitespace-pre-line">{toast.message}</div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        title="Закрыть"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      show: (m) => console.warn('Toast outside provider:', m),
      success: (m) => console.warn('Toast outside provider:', m),
      error: (m) => console.warn('Toast outside provider:', m),
      info: (m) => console.warn('Toast outside provider:', m),
      dismiss: () => {},
    };
  }
  return ctx;
}
