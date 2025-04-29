// src/components/shared/ProductCard.jsx
import React from "react";
import { Card } from "../ui/Card";
import RatingStars from "./RatingStars";
import "./../../css/components.css";

export default function ProductCard({ product }) {
  return (
    <Card className="product-card">
      <div className="product-card-content">
        <img src={product.image} alt={product.name} className="product-image" />
        <div>
          <h3 className="product-title">{product.name}</h3>
          <RatingStars rating={product.rating} />
          <p className="product-price">
            <span className="price-dollar">$</span>
            <span className="price-number">{product.price.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </Card>
  );
}