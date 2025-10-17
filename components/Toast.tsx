
import React, { useState, useEffect } from 'react';

// A simple event emitter for showing toasts
type ToastListener = (message: string) => void;
let listener: ToastListener | null = null;

export const toast = {
  show: (message: string) => {
    if (listener) {
      listener(message);
    }
  },
  subscribe: (l: ToastListener) => {
    listener = l;
  },
  unsubscribe: () => {
    listener = null;
  }
};

const ToastContainer: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  
  // Using a key to re-trigger the animation on each new message
  const [key, setKey] = useState(0); 

  useEffect(() => {
    const handleShow = (msg: string) => {
      setMessage(msg);
      setKey(prevKey => prevKey + 1); // Trigger re-render and animation
      const timer = setTimeout(() => {
        setMessage(null);
      }, 2300); // This duration should match the animation duration in index.html
      
      // Cleanup the timer if a new toast comes in before the old one disappears
      return () => clearTimeout(timer);
    };

    toast.subscribe(handleShow);
    return () => toast.unsubscribe();
  }, []);

  if (!message) return null;

  return (
    <div key={key} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in-out-toast">
      {message}
    </div>
  );
};

export default ToastContainer;