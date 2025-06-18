import React from "react";
import "../CSS/QuantityControls.css"; // Optional for scoped styles
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function QuantityControls({ product, quantity }) {
  const { addToCart, decreaseQuantity, cartLoading } = useCart();
  const isInCart = quantity > 0;
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login");
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="qty-controls">
      {isInCart ? (
        <>
          <button
            onClick={() => decreaseQuantity(product._id || product.productId)}
            disabled={cartLoading}
            className={cartLoading ? "disabled" : ""}
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => addToCart(product)}
            disabled={cartLoading}
            className={cartLoading ? "disabled" : ""}
          >
            +
          </button>
        </>
      ) : (
        <button
          className={`add-to-cart ${cartLoading ? "disabled" : ""}`}
          onClick={() => handleAddToCart(product)}
          disabled={cartLoading}
        >
          {cartLoading ? "Processing..." : "Add to Cart"}
        </button>
      )}
    </div>
  );
}

export default QuantityControls;
