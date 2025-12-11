import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Review } from '../constants';
import { REVIEWS as initialReviews } from '../types';

interface NewReviewData {
  rating: number;
  comment: string;
  author: string;
  date: string;
  verifiedPurchase: boolean;
  imageUrls?: string[];
  variantInfo?: string;
  sellerRating?: 'Positive' | 'Neutral' | 'Negative';
  isAnonymous?: boolean;
}

interface ReviewContextType {
  reviews: Review[];
  getReviewsForProduct: (productId: number) => Review[];
  addReview: (productId: number, reviewData: NewReviewData) => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage or fallback to mock data
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const savedReviews = localStorage.getItem('site_reviews');
      return savedReviews ? JSON.parse(savedReviews) : initialReviews;
    } catch (error) {
      console.error("Error parsing reviews from local storage", error);
      return initialReviews;
    }
  });

  // Save to localStorage whenever reviews change
  useEffect(() => {
    localStorage.setItem('site_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const getReviewsForProduct = (productId: number) => {
    return reviews.filter(review => review.productId === productId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const addReview = (productId: number, reviewData: NewReviewData) => {
    const newReview: Review = {
      id: `rev${Date.now()}`,
      productId,
      ...reviewData,
    };
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };

  return (
    <ReviewContext.Provider value={{ reviews, getReviewsForProduct, addReview }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReview must be used within a ReviewProvider');
  }
  return context;
};