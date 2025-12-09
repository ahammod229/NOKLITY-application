
import React, { useState, useEffect } from 'react';
import { Icon, IconName } from './Icon';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastState {
  message: string;
  type: ToastType;
}

// Event emitter
type ToastListener = (message: string, type: ToastType) => void;
let listener: ToastListener | null = null;

export const toast = {
  show: (message: string, type: ToastType = 'info') => {
    if (listener) {
      listener(message, type);
    }
  },
  success: (message: string) => toast.show(message, 'success'),
  error: (message: string) => toast.show(message, 'error'),
  warning: (message: string) => toast.show(message, 'warning'),
  subscribe: (l: ToastListener) => { listener = l; },
  unsubscribe: () => { listener = null; }
};

const ToastContainer: React.FC = () => {
  const [toastState, setToastState] = useState<ToastState | null>(null);
  const [key, setKey] = useState(0); 

  useEffect(() => {
    const handleShow = (message: string, type: ToastType) => {
      setToastState({ message, type });
      setKey(prevKey => prevKey + 1);
      const timer = setTimeout(() => {
        setToastState(null);
      }, 2300); // This duration should match the animation duration
      
      // Cleanup the timer if a new toast comes in
      return () => clearTimeout(timer);
    };

    toast.subscribe(handleShow);
    return () => toast.unsubscribe();
  }, []);

  if (!toastState) return null;

  const typeStyles: { [key in ToastType]: { bg: string; icon: IconName } } = {
    success: { bg: 'bg-green-600', icon: 'check-circle' },
    error: { bg: 'bg-red-600', icon: 'x-circle' },
    warning: { bg: 'bg-yellow-500', icon: 'exclamation-triangle' },
    info: { bg: 'bg-gray-800', icon: 'info' },
  };

  const styles = typeStyles[toastState.type];

  return (
    <div 
      key={key} 
      className={`fixed bottom-10 left-1/2 -translate-x-1/2 ${styles.bg} text-white px-6 py-3 rounded-full shadow-lg animate-fade-in-out-toast flex items-center gap-3 z-[100]`}
    >
      <Icon name={styles.icon} className="w-5 h-5" />
      <span>{toastState.message}</span>
    </div>
  );
};

export default ToastContainer;
