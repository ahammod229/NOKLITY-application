
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Order } from '../types';
import { mockOrders } from '../types';
import { supabase } from '../lib/supabase';

interface OrderContextType {
  orders: Order[];
  addOrder: (newOrder: Order) => Promise<void>;
  isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      if (data) {
        // Map Supabase orders to our Order type
        // Assuming Supabase 'orders' table has a JSONB column 'items' and fields matching Order type
        const mappedOrders: Order[] = data.map((item: any) => ({
          id: item.id.toString(), // Ensure ID is string
          sellerName: item.seller_name || 'NOKLITY',
          status: item.status,
          items: item.items || [], // Assuming items are stored as JSON
          estimatedDelivery: item.estimated_delivery,
          deliveryPartner: item.delivery_partner,
          trackingHistory: item.tracking_history || []
        }));
        
        // Merge with mock orders for demo purposes, prioritize real data
        setOrders([...mappedOrders, ...mockOrders]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Realtime subscription for Orders
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        console.log('Order update:', payload);
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addOrder = async (newOrder: Order) => {
    // Optimistic update
    setOrders(prevOrders => [newOrder, ...prevOrders]);

    try {
      // Map to Supabase DB schema
      const dbOrder = {
        // id: is auto-generated usually, but if you generate it on client:
        // id: newOrder.id, 
        customer_name: 'Guest User', // You should get this from AuthContext
        total: newOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: newOrder.status,
        items: newOrder.items, // Stores as JSONB
        seller_name: newOrder.sellerName,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('orders')
        .insert([dbOrder]);

      if (error) {
        console.error('Error adding order to Supabase:', error);
        // Handle rollback if needed
      }
    } catch (err) {
      console.error('Error adding order:', err);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, isLoading }}>
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
