import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

function Home({ cartItems, addToCart, removeFromCart, handleCheckout }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  const triggerCheckout = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    handleCheckout();
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
          <div className="cart-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
            </div>
            ))}
            <div className="checkout-controls">
              <button className="checkout-btn" onClick={triggerCheckout}>
                Checkout (${totalPrice})
              </button>
              <Link to="/checkout" className="checkout-btn">
                Go to checkout
              </Link>
            </div>
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
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>Confirm Checkout</h2>
            <p>
              You're checking out{" "}
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)} item(s)
            </p>
            <p>Total: ${totalPrice}</p>
            <button onClick={closeModal} style={styles.confirmBtn}>
              Confirm
            </button>
            <button
              onClick={() => setShowModal(false)}
              style={styles.cancelBtn}
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
