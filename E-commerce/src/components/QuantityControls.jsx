import React from "react";
import "../CSS/quantityControls.css"; // Optional for scoped styles

function QuantityControls({ product, quantity, addToCart, decreaseQuantity, cartLoading }) {
  const isInCart = quantity > 0;

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
          onClick={() => addToCart(product)}
          disabled={cartLoading}
        >
          {cartLoading ? "Processing..." : "Add to Cart"}
        </button>
      )}
    </div>
  );
}

export default QuantityControls;
