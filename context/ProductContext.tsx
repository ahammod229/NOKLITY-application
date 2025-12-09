
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { PRODUCTS as INITIAL_PRODUCTS } from '../types';
import type { Product } from '../constants';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      if (data && data.length > 0) {
        // Map Supabase data to Product interface
        // Note: Ensure your Supabase schema matches or maps correctly to these fields
        const mappedProducts: Product[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          originalPrice: item.originalPrice,
          imageUrl: item.imageUrl,
          categoryId: item.categoryId || 'electronics', // Default fallback
          brand: item.brand,
          // Add defaults for fields that might not be in simple admin form
          colors: [],
          sizes: [],
          rating: { stars: 0, count: 0 },
          freeShipping: false,
          sold: 0
        }));
        
        // Combine with initial mock products if you want to keep them, or replace them.
        // For this demo, we'll append new products to the mock list so the site isn't empty if DB is empty.
        // To make it fully dynamic, you would replace setProducts(mappedProducts).
        setProducts([...INITIAL_PRODUCTS, ...mappedProducts]);
      }
    } catch (error) {
      console.error('Unexpected error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        console.log('Product change received!', payload);
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ProductContext.Provider value={{ products, isLoading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
