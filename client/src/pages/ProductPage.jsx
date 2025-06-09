import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CartProvider, useCart } from "../context/CartContext";
import "../CSS/ProductPage.css"; // Import your CSS file
import { useAuth } from "../context/AuthContext";
import QuantityControls from "../components/QuantityControls";

const BASE_URL = "http://localhost:5001";

function ProductPage() {
  const { user } = useAuth();
  const AUTH_HEADER = {
    "Content-Type": "application/json",
    Authorization:
      `Bearer ${user?.accessToken}`
  };  
  const { id } = useParams();
  const { cartItems, cartLoading, addToCart, decreaseQuantity } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sizeMap, setSizeMap] = useState({});

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

  useEffect(() => {
    if (!product) return;
    const parent = product.parentProduct || product._id;
    const fetchVariants = async () => {
      try {
        const res = await fetch(`${BASE_URL}/products?parent=${parent}`);
        const data = await res.json();
        setVariants(data);
        const map = {};
        data.forEach((v) => {
          if (v.size && !map[v.size]) {
            map[v.size] = v._id;
          }
        });
        setSizeMap(map);
      } catch (err) {
        console.error("Error fetching variants:", err);
      }
    };
    fetchVariants();
  }, [product]);

  const cartItem = cartItems.find((item) => item.productId === id);
  const quantity = cartItem ? cartItem.quantity : 0;

  if (loading) return <p className="loading">Loading product...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="container">
      <h1 className="heading">{product.title}</h1>
      <h2 className="product-brand"> {product.brand}</h2>
      <h3 className="product-category"> {product.categories}</h3>
      <div className="product-detail">
        <img
          src={product.image}
          alt={product.title}
          className="product-image-small"
        />
        <div className="product-info">
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-description">{product.desc}</p>

          {variants.length > 0 && (
            <div className="color-options">
              {variants.map((v) => (
                <button
                  key={v._id}
                  className="color-option"
                  onClick={() => navigate(`/product/${v._id}`)}
                >
                  {v.color}
                </button>
              ))}
            </div>
          )}

          {Object.keys(sizeMap).length > 0 && (
            <div className="size-options">
              {Object.entries(sizeMap).map(([size, id]) => (
                <button
                  key={id}
                  className="size-option"
                  onClick={() => navigate(`/product/${id}`)}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          <QuantityControls
            product={product}
            quantity={quantity}
          />
        </div>
      </div>
      <Link to="/" className="back-link">← Back to Home</Link>
    </div>
  );
}

export default ProductPage;
