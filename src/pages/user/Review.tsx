import React, { useState } from "react";
import { addReview } from "../../api/user_api";

const ReviewForm: React.FC<{ providerId: string }> = ({ providerId }) => {
  const [rating, setRating] = useState<number>(1);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addReview(providerId, rating, comment);
      setSuccess("Review added successfully!");
      setComment("");
      setRating(1); // Reset rating to default
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to add review");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a Review</h3>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <label>
        Rating:
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </label>

      <label>
        Comment:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </label>

      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
