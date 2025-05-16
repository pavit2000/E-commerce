import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import "../CSS/home.css"; 

function Home({ handleCheckout }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const { cartItems, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  const triggerCheckout = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    //handleCheckout(); 
    navigate("/checkout"); 
  };

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <h1 className="heading">Holiday Specials</h1>

      <div className="cart-bar">
        <p>
          <strong>Cart:</strong>{" "}
          {cartItems.reduce((acc, item) => acc + item.quantity, 0)} item(s)
        </p>

        {cartItems.length > 0 && (
          <div className="checkout-controls">
            <button className="checkout-btn" onClick={triggerCheckout}>
              Checkout (${totalPrice})
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartItems={cartItems}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Confirm Checkout</h2>
            <p>
              You're checking out{" "}
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)} item(s)
            </p>
            <p>Total: ${totalPrice}</p>
            <button className="modal-btn" onClick={closeModal}>
              Confirm
            </button>
            <button
              className="modal-btn modal-cancel"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
