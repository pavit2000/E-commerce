// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
//import { useAuth } from "../Auth/AuthContext"; // Import the useAuth hook

const CartContext = createContext();
const BASE_URL = "http://localhost:5001";
const AUTH_HEADER = {
  "Content-Type": "application/json",
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODJkNjYzMmUwYzAyZGM1NWU5YmQ3Y2UiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzQ4NDAxMDA4LCJleHAiOjE3NDg0ODc0MDh9.jgv4e4DiQ4QuJY7yaBKIRMbh36EvK2ogNqw0A28AdiY",
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);

  const calculateTotalPrice = (items) =>
    items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  const calculateTotalQuantity = (items) =>
    items.reduce((acc, item) => acc + item.quantity, 0);

  const totalPrice = useMemo(() => calculateTotalPrice(cartItems), [cartItems]);
  const totalQuantity = useMemo(() => calculateTotalQuantity(cartItems), [cartItems]);
  
  const userId = 1;
  const cartId = 1;

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${BASE_URL}/carts/get-cart`, {
          method: "GET",
          headers: AUTH_HEADER,
        });
        const cartData = await res.json();

        if (!cartData.cart || !cartData.cart.products?.length) {
          setCartItems([]);
          return;
        }

        setCartItems(cartData.cart.products);
      } catch (error) {
        console.error("Error loading cart on refresh:", error);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (product) => {
    try {
      setCartLoading(true);
      const data = {
        productId: product._id,
        quantity: 1,
        title: product.title,
        price: product.price,
        image: product.image,
      };
      // Call backend API to add product to cart
      const response = await fetch(`${BASE_URL}/carts`, {
        method: "POST",
        headers: AUTH_HEADER,
        body: JSON.stringify(data), // use _id from MongoDB
      });
  
      if (!response.ok) {
        // const errorData = await response.json();
        // const message = errorData?.message || "Failed to add product to cart";
        // setNotification({ type: "error", message });
        // throw new Error(message);
        setNotification({ type: "error", message: "Failed to add product to cart" });
        throw new Error("Failed to add product to cart");
      }
  
      // Fetch updated cart from backend
      const cartRes = await fetch(`${BASE_URL}/carts/get-cart`, {
        method: "GET",
        headers: AUTH_HEADER,
      });
  
      const cartData = await cartRes.json();

      setCartItems(cartData.cart.products || []);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setCartLoading(false);
    }
  };

  const decreaseQuantity = async (productId) => {
    try {
      setCartLoading(true);
      const response = await fetch(`${BASE_URL}/carts/decrease-quantity`, {
        method: "POST",
        headers: AUTH_HEADER,
        body: JSON.stringify({ productId, quantity: 1 }),
      });
  
      if (!response.ok) {
        setNotification({ type: "error", message: "Failed to decrease item quantity" });
        throw new Error("Failed to decrease item quantity");
      }
  
      const result = await response.json();
      const updatedCart = result.updatedCart;
  
      if (!updatedCart.products || updatedCart.products.length === 0) {
        setCartItems([]);
        return;
      }

      if (!response.ok) {
        let message = "Failed to decrease item quantity";
        try {
          const errorData = await response.json();
          if (errorData?.message) message = errorData.message;
        } catch {}
        setNotification({ type: "error", message });
        throw new Error(message);
      }

      const cartRes = await fetch(`${BASE_URL}/carts/get-cart`, {
        method: "GET",
        headers: AUTH_HEADER,
      });
  
      const cartData = await cartRes.json();
  
      setCartItems(cartData.cart.products || []);
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    } finally {
      setCartLoading(false); // hide loader
    }
  };
  

  // const removeFromCart = (productId) => {
  //   setCartItems((prev) =>
  //     prev
  //       .map((item) =>
  //         item.id === productId
  //           ? { ...item, quantity: item.quantity - 1 }
  //           : item
  //       )
  //       .filter((item) => item.quantity > 0)
  //   );
  // };

  // const clearCart = () => {
  //   setCartItems([]);
  // };

  return (
    <CartContext.Provider
      //value={{ cartItems, addToCart, removeFromCart, clearCart }}
      value={{ cartItems, 
        addToCart, 
        decreaseQuantity, 
        notification, 
        setNotification, 
        cartLoading, 
        setCartLoading, 
        totalPrice, 
        totalQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
