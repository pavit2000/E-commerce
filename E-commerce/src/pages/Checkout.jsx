import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../CSS/checkout.css";

function Checkout({ handleCheckout }) {
  const { cartItems, addToCart, decreaseQuantity, totalQuantity, cartLoading, totalPrice, deleteCart } = useCart();

  return (
    <div className="container">
      <h1 className="heading">Checkout</h1>

      <div className="cart-bar">
        <p>
          <strong>Cart:</strong> {totalQuantity} item(s)
        </p>

        {cartItems.length > 0 && (
          <button
            className="delete-cart-btn"
            onClick={deleteCart}
            disabled={cartLoading}
          >
            {cartLoading ? "Clearing..." : "Delete Cart"}
          </button>
        )}

        {totalQuantity > 0 && (
          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout (${totalPrice})
          </button>
        )}
      </div>

      {totalQuantity === 0 ? (
        <p className="loading">Your cart is empty.</p>
      ) : (
        <div className="grid">
          {cartItems.filter(item => item.quantity > 0).map((item) => (
            <div className="card" key={item._id}>
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
                    onClick={() => decreaseQuantity(item.productId)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => addToCart({
                      _id: item.productId,
                      title: item.title,
                      price: item.price,
                      image: item.image,
                    })}
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
