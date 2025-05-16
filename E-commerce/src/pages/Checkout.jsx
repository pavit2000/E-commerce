import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Checkout({ handleCheckout }) {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="container">
      <h1 className="heading">Checkout</h1>

      <div className="cart-bar">
        <p>
          <strong>Cart:</strong> {totalItems} item(s)
        </p>
        {totalItems > 0 && (
          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout (${totalPrice})
          </button>
        )}
      </div>

      {totalItems === 0 ? (
        <p className="loading">Your cart is empty.</p>
      ) : (
        <div className="grid">
          {cartItems.map((item) => (
            <div className="card" key={item.id}>
              <img
                src={item.image}
                alt={item.title}
                className="product-image"
              />
              <div className="card-body">
                <h2 className="product-title">{item.title}</h2>
                <p className="product-price">Price: ${item.price.toFixed(2)}</p>
                <p className="product-quantity">Quantity: {item.quantity}</p>
                <p className="product-subtotal">
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </p>
                <div className="qty-controls">
                  <button
                    className="qty-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => addToCart(item)}
                  >
                    +
                  </button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link to="/" className="back-link">
        Back to Home
      </Link>
    </div>
  );
}

export default Checkout;
