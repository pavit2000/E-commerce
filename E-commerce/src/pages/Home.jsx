import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

function Home({cartItems, addToCart, handleCheckout}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <p><strong>Cart:</strong> {cartItems.length} item(s)</p>
            {cartItems.length > 0 && (
                <button className="checkout-btn" onClick={handleCheckout}>
                    Checkout (${cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)})
                    <Link to="/checkout" className="checkout-btn">
                      Go to checkout
                    </Link>
                </button>
            )}
        </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;