import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface WishlistContextType {
  wishlist: number[];
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  getWishlistItemCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const getInitialWishlist = (): number[] => {
  try {
    const item = window.localStorage.getItem('wishlist');
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error('Error reading wishlist from localStorage', error);
    return [];
  }
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<number[]>(getInitialWishlist);

  useEffect(() => {
    try {
      window.localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage', error);
    }
  }, [wishlist]);

  const addToWishlist = (productId: number) => {
    setWishlist(prev => [...prev, productId]);
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist(prev => prev.filter(id => id !== productId));
  };

  const isInWishlist = (productId: number) => {
    return wishlist.includes(productId);
  };
  
  const getWishlistItemCount = () => {
    return wishlist.length;
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, getWishlistItemCount }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
