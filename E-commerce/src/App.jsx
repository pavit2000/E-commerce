import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Checkout from "./pages/Checkout";
import useCart from "./hooks/useCart";
import ProductPage from "./pages/ProductPage";

function App() {
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();  // use context

  useEffect(() => {
    console.log("Cart items in App:", cartItems);
  }, [cartItems]);

  const handleCheckout = () => {
    clearCart();
  };

  return (
    <BrowserRouter basename="/E-commerce">
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
        <Route
          path="/product/:id"
          element={
            <ProductPage 
              cartItems={cartItems}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
