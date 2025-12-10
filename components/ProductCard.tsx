import React from 'react';
import type { Product } from '../constants';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { Icon } from './Icon';

interface ProductCardProps {
  product: Product;
  flashSale?: boolean;
  highlight?: string;
  onQuickViewClick: (product: Product) => void;
}

const HighlightedText: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
  if (!highlight || !highlight.trim()) {
    return <>{text}</>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <strong key={i} className="font-bold bg-yellow-200 dark:bg-yellow-600 dark:text-white">{part}</strong>
        ) : (
          part
        )
      )}
    </>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({ product, flashSale = false, highlight = '', onQuickViewClick }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const cardClasses = flashSale 
    ? "flex flex-col h-full bg-white dark:bg-gray-800 group" 
    : "group block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col";

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickViewClick(product);
  };
  
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <Link to={`/product/${product.id}`} className={cardClasses}>
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-noklity-red text-white text-[10px] font-bold px-2 py-1 rounded-md z-10">
            -{discount}%
          </div>
        )}
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300 bg-white"
        />
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-1.5 bg-white/75 dark:bg-gray-800/75 rounded-full text-gray-500 dark:text-gray-400 hover:text-noklity-red hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-noklity-red z-10 opacity-0 group-hover:opacity-100"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Icon name="heart" className={`w-5 h-5 ${isWishlisted ? 'text-noklity-red fill-current' : ''}`} />
        </button>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={handleQuickView}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-semibold rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-sm shadow-md"
              aria-label="Quick view"
            >
              <Icon name="eye" className="w-5 h-5" />
              <span>Quick View</span>
            </button>
        </div>
      </div>
      <div className="p-2 flex flex-col flex-grow text-left">
        <h3 className="text-sm text-gray-700 dark:text-gray-200 flex-grow mb-2 h-10 overflow-hidden">
          <HighlightedText text={product.name} highlight={highlight} />
        </h3>
        {product.freeShipping && (
            <div className="my-1">
                <span className="bg-teal-600/10 text-teal-700 dark:text-teal-400 text-[10px] font-semibold px-2 py-1 rounded-sm flex items-center gap-1 w-fit">
                    <Icon name="truck" className="w-3 h-3"/>
                    FREE DELIVERY
                </span>
            </div>
        )}
        <div className="mt-auto">
            <p className="text-lg font-semibold text-orange-500">৳{product.price.toLocaleString()}</p>
            {product.originalPrice && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span className="line-through">৳{product.originalPrice.toLocaleString()}</span>
                    <span className="ml-2">-{discount}%</span>
                </div>
            )}
            {product.rating && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 gap-2">
                    <div className="flex items-center gap-1">
                        <Icon name="star" className="w-3 h-3 text-yellow-400"/>
                        <span>{product.rating.stars.toFixed(1)} ({product.rating.count})</span>
                    </div>
                    {product.sold && (
                        <>
                         <span className="text-gray-300 dark:text-gray-600">|</span>
                         <span>{product.sold} Sold</span>
                        </>
                    )}
                </div>
            )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;