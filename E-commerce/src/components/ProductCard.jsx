import React from "react";

export default function ProductCard({ product }) {
  return (
    <div className="card">
      <img src={product.image} alt={product.title} className="product-image" />
      <div className="card-body">
        <h2 className="product-title">{product.title}</h2>
        <p className="product-price">${product.price}</p>
        <button className="add-to-cart">Add to Cart</button>
      </div>
    </div>
  );
}
