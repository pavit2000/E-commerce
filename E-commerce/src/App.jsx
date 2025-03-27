import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Checkout from "./pages/Checkout";

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
  };

  useEffect(() => {
    console.log("Cart items in App:", cartItems);
  }, [cartItems]);

  const handleCheckout = () => {
    alert(
      `Checking out ${cartItems.length} items. Total: $${cartItems
        .reduce((acc, item) => acc + item.price, 0)
        .toFixed(2)}`
    );
    setCartItems([]);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              cartItems={cartItems}
              addToCart={addToCart}
              handleCheckout={handleCheckout}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <Checkout cartItems={cartItems} handleCheckout={handleCheckout} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
