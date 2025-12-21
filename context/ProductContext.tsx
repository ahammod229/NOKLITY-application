
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PRODUCTS as initialProducts } from '../types';
import type { Product } from '../constants';

interface ProductContextType {
  products: Product[];
  refreshProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = () => {
    try {
      const stored = localStorage.getItem('admin_products');
      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        // Fallback to static data if no admin data exists yet
        setProducts(initialProducts);
      }
    } catch (e) {
      console.error("Failed to parse products from storage", e);
      setProducts(initialProducts);
    }
  };

  useEffect(() => {
    loadProducts();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_products') {
        loadProducts();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Listen for custom event for tab-internal updates if necessary
    window.addEventListener('products-updated', loadProducts);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('products-updated', loadProducts);
    };
  }, []);

  return (
    <ProductContext.Provider value={{ products, refreshProducts: loadProducts }}>
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
