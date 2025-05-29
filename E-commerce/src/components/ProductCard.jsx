import React from "react";
import { Link } from "react-router-dom";
import { CartProvider, useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { cartItems, addToCart, decreaseQuantity, cartLoading } = useCart();
  const cartItem = cartItems.find((item) => item.productId === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;


  return (
    <div className="card">
      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={product.title} className="product-image" />
      </Link>
      <div className="card-body">
        <h2 className="product-title">{product.title}</h2>
        <p className="product-price">${product.price.toFixed(2)}</p>

        {quantity > 0 ? (
          <div className="qty-controls">
            <button onClick={() => decreaseQuantity(product._id)}
              disabled={cartLoading}
              className={cartLoading ? "disabled" : ""}
              >
                -</button>
            <span className="qty-count">{quantity}</span>
            <button onClick={() => addToCart(product)}
              disabled={cartLoading}
              className={cartLoading ? "disabled" : ""}
              >
                +</button>
          </div>
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
    </div>
  );
}

export default ProductCard;
