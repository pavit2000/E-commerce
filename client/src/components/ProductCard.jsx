import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartProvider, useCart } from "../context/CartContext";
import QuantityControls from "./QuantityControls";
import { useAuth } from "../context/AuthContext";

function ProductCard({ product }) {
  const { cartItems, addToCart, decreaseQuantity, cartLoading } = useCart();
  const cartItem = cartItems.find((item) => item.productId === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="card">
      <p className="product-title">{product.title}</p>
      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={product.title} className="product-image" />
      </Link>
      <p className="product-price">${product.price.toFixed(2)}</p>
      <QuantityControls
        product={product}
        quantity={quantity}
      />
    </div>
  );
}

export default ProductCard;
