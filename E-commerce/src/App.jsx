import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import ProductPage from "./pages/ProductPage";
import { CartProvider } from "./context/CartContext";
import Snackbar from "./components/Snackbar";

function App() {
  return (
    <CartProvider>
      <BrowserRouter basename="/E-commerce">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </BrowserRouter>
      <Snackbar />
    </CartProvider>
  );
}

export default App;
