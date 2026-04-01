import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const toast = {
  success: (message: string, duration = 3000) => {
    // This will be implemented by the provider
    console.log('Toast success:', message);
  },
  error: (message: string, duration = 5000) => {
    console.log('Toast error:', message);
  },
  info: (message: string, duration = 4000) => {
    console.log('Toast info:', message);
  },
  warning: (message: string, duration = 4000) => {
    console.log('Toast warning:', message);
  }
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, type, message, duration };
    
    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Override the toast functions
  React.useEffect(() => {
    toast.success = (message: string, duration = 3000) => addToast(message, 'success', duration);
    toast.error = (message: string, duration = 5000) => addToast(message, 'error', duration);
    toast.info = (message: string, duration = 4000) => addToast(message, 'info', duration);
    toast.warning = (message: string, duration = 4000) => addToast(message, 'warning', duration);
  }, [addToast]);

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20 text-green-100';
      case 'error':
        return 'bg-red-500/10 border-red-500/20 text-red-100';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-100';
      default:
        return 'bg-blue-500/10 border-blue-500/20 text-blue-100';
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, toast: addToast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.3 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.5 }}
              className={`flex items-center space-x-3 p-4 rounded-lg border backdrop-blur-lg ${getToastStyles(toast.type)}`}
            >
              {getToastIcon(toast.type)}
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}; 