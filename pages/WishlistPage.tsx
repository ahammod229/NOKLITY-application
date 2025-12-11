
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
// FIX: Imported PRODUCTS constant from `types.ts` where it is defined.
import { PRODUCTS } from '../types';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import type { Product } from '../constants';

const WishlistPage: React.FC = () => {
  const { wishlist } = useWishlist();
  const wishlistedProducts = PRODUCTS.filter(product => wishlist.includes(product.id));
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg min-h-[60vh] transition-colors duration-200">
      <h1 className="text-3xl font-bold mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 text-gray-900 dark:text-white">My Wishlist</h1>
      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400 text-lg">Your wishlist is empty.</p>
          <p className="text-gray-500 dark:text-gray-500 mt-2">Add items you love to your wishlist to save them for later.</p>
          <Link to="/" className="mt-6 inline-block bg-noklity-red text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors">
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistedProducts.map(product => (
            <ProductCard key={product.id} product={product} onQuickViewClick={handleQuickView} />
          ))}
        </div>
      )}
      <QuickViewModal product={quickViewProduct} onClose={closeQuickView} />
    </div>
  );
};

export default WishlistPage;
