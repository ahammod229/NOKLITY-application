
import React, { useState, useEffect } from 'react';
import type { Product } from '../constants';
import { Icon } from './Icon';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { toast } from './Toast';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    // Reset quantity when product changes
    if (product) {
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    // Handle Esc key press to close modal
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!product) {
    return null;
  }
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} x ${product.name} added to cart!`);
    onClose();
  };

  const shortDescription = product.description.split('\n')[0]; // Get first paragraph

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10" aria-label="Close">
          <Icon name="x" className="w-6 h-6" />
        </button>
        
        {/* Image Section */}
        <div className="w-full md:w-1/2 p-4">
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
            <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain" />
          </div>
        </div>
        
        {/* Details Section */}
        <div className="w-full md:w-1/2 p-6 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
          
          <div className="mb-4">
            <p className="text-3xl font-bold text-orange-500">৳{product.price.toLocaleString()}</p>
            {product.originalPrice && (
              <div className="flex items-center text-base text-gray-500">
                <span className="line-through">৳{product.originalPrice.toLocaleString()}</span>
                <span className="ml-3 font-semibold">-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-600 mb-6 flex-grow">{shortDescription}</p>

          <div className="flex items-center gap-8 mb-6">
            <p className="font-semibold text-gray-700">Quantity</p>
            <div className="flex items-center border border-gray-200 rounded">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 text-gray-500 hover:bg-gray-100"><Icon name="minus" className="w-5 h-5"/></button>
              <span className="px-4 font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="p-2 text-gray-500 hover:bg-gray-100"><Icon name="plus" className="w-5 h-5"/></button>
            </div>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="w-full py-3 px-6 rounded-lg text-white font-semibold bg-orange-500 hover:bg-orange-600 transition-colors duration-300 mb-4"
          >
            Add to Cart
          </button>
          
          <Link to={`/product/${product.id}`} onClick={onClose} className="text-center text-sm text-noklity-red hover:underline">
            View Full Product Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
