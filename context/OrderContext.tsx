import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Order } from '../types';
import { mockOrders } from '../types';

interface OrderContextType {
  orders: Order[];
  addOrder: (newOrder: Order) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const addOrder = (newOrder: Order) => {
    // Add the new order to the beginning of the list
    setOrders(prevOrders => [newOrder, ...prevOrders]);
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
