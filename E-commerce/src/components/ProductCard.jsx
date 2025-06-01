import React from "react";
import { Link } from "react-router-dom";
import { CartProvider, useCart } from "../context/CartContext";
import QuantityControls from "./QuantityControls";

function ProductCard({ product }) {
  const { cartItems, addToCart, decreaseQuantity, cartLoading } = useCart();
  const cartItem = cartItems.find((item) => item.productId === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;


  return (
    <div className="card">
      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={product.title} className="product-image" />
      </Link>
      <p className="product-price">${product.price.toFixed(2)}</p>
      <p className="product-description">{product.desc}</p>
      <QuantityControls
        product={product}
        quantity={quantity}
        addToCart={addToCart}
        decreaseQuantity={decreaseQuantity}
        cartLoading={cartLoading}
      />
    </div>
  );
}

export default ProductCard;
