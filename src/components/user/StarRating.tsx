import React, { useState } from 'react';

interface StarRatingProps {
  onRatingChange: (rating: number) => void;
  initialRating?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ onRatingChange, initialRating = 0 }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null); // To handle hover separately

  const handleMouseOver = (value: number) => {
    setHoveredRating(value);
  };

  const handleMouseOut = () => {
    setHoveredRating(null); // Reset hover
  };

  const handleClick = (value: number) => {
    setRating(value); // Persist the clicked rating
    onRatingChange(value); // Pass the selected rating back to the parent component
  };

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onMouseOver={() => handleMouseOver(star)}
          onMouseOut={handleMouseOut}
          onClick={() => handleClick(star)}
          className={`cursor-pointer text-3xl transition-colors duration-200 ease-in-out ${
            (hoveredRating || rating) >= star ? 'text-yellow-500' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
