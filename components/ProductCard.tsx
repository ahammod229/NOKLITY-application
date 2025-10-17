import React from 'react';
// FIX: Imported Product type from `constants.ts` where it is defined.
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
          <strong key={i} className="font-bold bg-yellow-200">{part}</strong>
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
    ? "flex flex-col h-full bg-white group" 
    : "group block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col";

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

  return (
    <Link to={`/product/${product.id}`} className={cardClasses}>
      <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-1.5 bg-white/75 rounded-full text-gray-500 hover:text-noklity-red hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-noklity-red z-10"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Icon name="heart" className={`w-5 h-5 ${isWishlisted ? 'text-noklity-red fill-current' : ''}`} />
        </button>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={handleQuickView}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 font-semibold rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
              aria-label="Quick view"
            >
              <Icon name="eye" className="w-5 h-5" />
              <span>Quick View</span>
            </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm text-gray-700 flex-grow mb-2 h-10 overflow-hidden">
          <HighlightedText text={product.name} highlight={highlight} />
        </h3>
        <div>
            <p className="text-lg font-semibold text-orange-500">৳{product.price.toLocaleString()}</p>
            {product.originalPrice && (
                <div className="flex items-center text-xs text-gray-500">
                    <span className="line-through">৳{product.originalPrice.toLocaleString()}</span>
                    <span className="ml-2">-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>
                </div>
            )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
