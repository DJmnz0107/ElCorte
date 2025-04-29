// src/components/shared/RatingStars.jsx
import React from "react";
import { Star } from "lucide-react";

export default function RatingStars({ rating }) {
  return (
    <div className="rating-stars">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className={i < rating ? "filled-star" : "empty-star"} />
      ))}
    </div>
  );
}