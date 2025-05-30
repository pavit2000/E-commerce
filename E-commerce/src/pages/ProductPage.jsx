import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CartProvider, useCart } from "../context/CartContext";
import "../CSS/ProductPage.css"; // Import your CSS file

const BASE_URL = "http://localhost:5001";
const AUTH_HEADER = {
  "Content-Type": "application/json",
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODJkNjYzMmUwYzAyZGM1NWU5YmQ3Y2UiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzQ3ODA1Nzk5LCJleHAiOjE3NDc4OTIxOTl9.JjuCMOiury_6tOeSkXk3ICn5KYPK6_xtb_7IPFXI4HA",
};

function ProductPage() {
  const { id } = useParams();
  const { cartItems, addToCart, removeFromCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${BASE_URL}/products/${id}`, {
          method: "GET",
          headers: AUTH_HEADER,
        });
        const data = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading product:", err);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const cartItem = cartItems.find((item) => item.id === Number(id));
  const quantity = cartItem ? cartItem.quantity : 0;

  if (loading) return <p className="loading">Loading product...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="container">
      <h1 className="heading">{product.title}</h1>
      <div className="product-detail">
        <img
          src={product.image}
          alt={product.title}
          className="product-image-small"
        />
        <div className="product-info">
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>

          {quantity > 0 ? (
            <div className="qty-controls">
              <button onClick={() => removeFromCart(product.id)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => addToCart(product)}>+</button>
            </div>
          ) : (
            <button className="add-to-cart" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          )}
        </div>
      </div>
      <Link to="/" className="back-link">← Back to Home</Link>
    </div>
  );
}

export default ProductPage;
