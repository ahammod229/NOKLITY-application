
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Order } from '../types';
import { mockOrders } from '../types';

interface OrderContextType {
  orders: Order[];
  addOrder: (newOrder: Order) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
        const stored = localStorage.getItem('admin_orders');
        return stored ? JSON.parse(stored) : mockOrders;
    } catch {
        return mockOrders;
    }
  });

  // Listen for changes from other tabs (e.g. Admin updating status)
  useEffect(() => {
      const handleStorageChange = (e: StorageEvent) => {
          if (e.key === 'admin_orders' && e.newValue) {
              setOrders(JSON.parse(e.newValue));
          }
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addOrder = (newOrder: Order) => {
    // Read fresh from storage to avoid race conditions with other tabs/admin
    let currentOrders = [];
    try {
        const stored = localStorage.getItem('admin_orders');
        currentOrders = stored ? JSON.parse(stored) : mockOrders;
    } catch {
        currentOrders = orders;
    }
    
    const updatedOrders = [newOrder, ...currentOrders];
    setOrders(updatedOrders);
    localStorage.setItem('admin_orders', JSON.stringify(updatedOrders));
    // Dispatch event so other tabs/windows (like admin panel) update immediately
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
