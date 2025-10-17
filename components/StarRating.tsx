import React, { useState } from 'react';
import { Icon } from './Icon';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  totalStars?: number;
  size?: string;
  interactive?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  totalStars = 5,
  size = 'h-5 w-5',
  interactive = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index: number) => {
    if (!interactive) return;
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (!interactive || !onRatingChange) return;
    onRatingChange(index + 1);
  };

  return (
    <div className={`flex items-center ${interactive ? 'cursor-pointer' : ''}`}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const displayRating = hoverRating || rating;
        
        const colorClass =
          starValue <= displayRating
            ? 'text-yellow-400'
            : 'text-gray-300';

        return (
          <div
            key={index}
            className={`${size} ${colorClass}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
          >
            <Icon name="star" />
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
