
import React from 'react';
import type { Review, Product } from '../constants';
import StarRating from './StarRating';
import { Icon } from './Icon';

interface ProductReviewsProps {
  product: Product;
  reviews: Review[];
  onWriteReview: () => void;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ product, reviews, onWriteReview }) => {
  const { rating, name } = product;

  const totalRatings = rating?.count || reviews.length;
  const averageRating = rating?.stars || 0;

  const ratingBreakdown = rating?.breakdown;
  const displayRatingCounts = ratingBreakdown ? {
    5: ratingBreakdown['5'],
    4: ratingBreakdown['4'],
    3: ratingBreakdown['3'],
    2: ratingBreakdown['2'],
    1: ratingBreakdown['1'],
  } : null;


  const getPercentage = (count: number) => {
    return totalRatings > 0 ? (count / totalRatings) * 100 : 0;
  };
  
  const maskAuthor = (author: string) => {
    if (author.length <= 3) return author;
    return `${author.substring(0, 1)}***`;
  }

  return (
    <div id="reviews" className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm mt-8 transition-colors duration-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Ratings & Reviews of {name}</h2>
      
      {/* Summary Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        {/* Left Side: Average */}
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-5xl font-light text-gray-800 dark:text-white">{averageRating.toFixed(1)}<span className="text-3xl text-gray-400">/5</span></p>
          <div className="my-2">
            <StarRating rating={averageRating} size="h-7 w-7"/>
          </div>
          <p className="text-gray-500 dark:text-gray-400">{totalRatings} Ratings</p>
        </div>
        
        {/* Right Side: Breakdown */}
        {displayRatingCounts && (
            <div className="flex-1">
            {Object.entries(displayRatingCounts).reverse().map(([star, count]) => {
                const starNum = parseInt(star);
                return (
                <div key={star} className="flex items-center gap-4 my-1">
                    <StarRating rating={starNum} size="h-4 w-4" />
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 flex-1">
                    <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${getPercentage(count)}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">{count}</span>
                </div>
                );
            })}
            </div>
        )}
      </div>

      {/* Product Reviews Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Product Reviews</h3>
             <div className="flex items-center gap-4 text-sm">
                <button
                    onClick={onWriteReview}
                    className="bg-noklity-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-xs"
                >
                    Write a Review
                </button>
                <button className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <Icon name="sort" className="w-5 h-5" />
                    <span>Sort: Relevance</span>
                </button>
                <button className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <Icon name="filter" className="w-5 h-5" />
                    <span>Filter: All star</span>
                </button>
            </div>
        </div>

        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.id} className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <StarRating rating={review.rating} />
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>by {maskAuthor(review.author)}</span>
                    {review.verifiedPurchase && (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <Icon name="verified" className="w-4 h-4" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-400">{new Date(review.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 my-3">{review.comment}</p>
              {review.imageUrls && review.imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {review.imageUrls.map((url, index) => (
                    <img 
                      key={index} 
                      src={url} 
                      alt={`Review image ${index + 1}`} 
                      loading="lazy"
                      decoding="async"
                      className="w-20 h-20 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity" />
                  ))}
                </div>
              )}
              {review.variantInfo && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 bg-gray-100 dark:bg-gray-700 inline-block px-2 py-1 rounded">{review.variantInfo}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
