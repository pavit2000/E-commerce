import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CartProvider, useCart } from "../context/CartContext";
import "../CSS/ProductPage.css"; // Import your CSS file

function ProductPage() {
  const { id } = useParams();
  const { cartItems, addToCart, removeFromCart } = useCart();

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
