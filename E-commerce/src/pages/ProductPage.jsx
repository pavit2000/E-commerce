import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function ProductPage({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="loading">Loading product...</p>;

  if (!product) return <p>Product not found.</p>;

  return (
    <div className="container">
      <h1 className="heading">{product.title}</h1>
      <div className="product-detail">
        <img src={product.image} alt={product.title} className="product-image-large" />
        <div className="product-info">
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>
          <button className="add-to-cart" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
      <Link to="/" className="back-link">← Back to Home</Link>
    </div>
  );
}

export default ProductPage;
