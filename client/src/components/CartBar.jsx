import React from "react";
import { useCart } from "../context/CartContext";

function CartBar({ onCheckout, showCheckout = true, showDelete = true }) {
  const { cartItems, cartLoading, totalQuantity, totalPrice, deleteCart } = useCart();

  return (
    <div className="cart-bar">
      <p>
        <strong>Cart:</strong> {totalQuantity} item(s)
      </p>

      {cartItems.length > 0 && showDelete && (
        <div className="cart-actions">
          <button 
            className="clear-cart-btn" 
            onClick={deleteCart}
            disabled={cartLoading}
          >
            {cartLoading ? "Clearing..." : "Delete Cart"}
          </button>
        </div>
      )}

      {totalQuantity > 0 && showCheckout && (
        <div className="checkout-controls">
          <button className="checkout-btn" onClick={onCheckout}>
            Checkout (${totalPrice})
          </button>
        </div>
      )}
    </div>
  );
}

export default CartBar;
