
import React, { useState, useEffect } from 'react';
import { Icon, IconName } from './Icon';
import StarRating from './StarRating';
import ToggleSwitch from './ToggleSwitch';
import type { Product } from '../constants';

type SellerRatingValue = 'Negative' | 'Neutral' | 'Positive' | null;

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: {
    rating: number;
    comment: string;
    sellerRating: SellerRatingValue;
    isAnonymous: boolean;
  }) => void;
  product: Product;
}

const SellerRatingInput: React.FC<{ value: SellerRatingValue; onChange: (value: SellerRatingValue) => void; }> = ({ value, onChange }) => {
  const sellerRatingOptions: { name: SellerRatingValue, icon: IconName, label: string }[] = [
      { name: 'Negative', icon: 'smiley-sad', label: 'Negative' },
      { name: 'Neutral', icon: 'smiley-neutral', label: 'Neutral' },
      { name: 'Positive', icon: 'smiley-positive', label: 'Positive' }
  ];

  return (
    <div className="flex items-center justify-center gap-6 py-2">
      {sellerRatingOptions.map(opt => (
          <button key={opt.name} type="button" onClick={() => onChange(opt.name)} className={`flex flex-col items-center gap-2 transition-transform duration-200 ${value === opt.name ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}>
              <Icon name={opt.icon} className={`w-10 h-10 ${value === opt.name ? (opt.name === 'Positive' ? 'text-yellow-500' : 'text-gray-700') : 'text-gray-400' }`} />
              <span className={`text-xs font-medium ${value === opt.name ? 'text-gray-800' : 'text-gray-500'}`}>{opt.label}</span>
          </button>
      ))}
    </div>
  );
};

const WriteReviewModal: React.FC<WriteReviewModalProps> = ({ isOpen, onClose, onSubmit, product }) => {
  const [productRating, setProductRating] = useState(0);
  const [sellerRating, setSellerRating] = useState<SellerRatingValue>(null);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProductRating(0);
      setSellerRating(null);
      setComment('');
      setIsAnonymous(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {
    if (productRating > 0 && comment.trim()) {
      onSubmit({ rating: productRating, sellerRating, comment, isAnonymous });
    } else {
      alert('Please provide a product rating and a comment.');
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close"
        >
          <Icon name="x" className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">Rate and Review</h2>
        
        <div className="flex items-center gap-4 p-4 border rounded-md mb-6 bg-gray-50">
          <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-contain flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-800">{product.name}</p>
            <p className="text-sm text-gray-500">Sold by: {product.brand || 'N/A'}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 border rounded-md">
            <label className="block text-md font-semibold text-gray-800 mb-3 text-center">How would you rate the product?</label>
            <div className="flex items-center justify-center gap-2">
              <StarRating rating={productRating} onRatingChange={setProductRating} interactive size="h-8 w-8" />
              {productRating > 0 && <span className="font-semibold text-gray-700">{['', 'Poor', 'Fair', 'Average', 'Good', 'Delightful'][productRating]}</span>}
            </div>
          </div>
          
          <div className="p-4 border rounded-md">
            <label className="block text-md font-semibold text-gray-800 mb-3 text-center">How was the seller?</label>
            <SellerRatingInput value={sellerRating} onChange={setSellerRating} />
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Review</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-noklity-red focus:border-noklity-red"
              placeholder="Share your thoughts on the product, seller, and delivery..."
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700">Add Photos (Optional)</label>
             <div className="mt-1 flex justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <Icon name="camera" className="mx-auto h-10 w-10 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-noklity-red hover:text-red-700 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
            </div>
          </div>
          
          <div className="border-t pt-4 flex items-center justify-between">
             <span className="text-sm text-gray-700">Review Anonymously</span>
             <ToggleSwitch checked={isAnonymous} onChange={setIsAnonymous} />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-medium text-white bg-noklity-red border border-transparent rounded-md hover:bg-red-700"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default WriteReviewModal;