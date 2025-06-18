import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import ProductPage from "./pages/ProductPage";
import Orders from "./pages/Orders";
import { CartProvider } from "./context/CartContext";
import Snackbar from "./components/Snackbar";
import Payment from "./pages/Payment";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/pay/:id" element={<Payment />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
        <Snackbar />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
