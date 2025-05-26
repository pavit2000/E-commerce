// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
//import { useAuth } from "../Auth/AuthContext"; // Import the useAuth hook

const CartContext = createContext();
const BASE_URL = "http://localhost:5001";
const AUTH_HEADER = {
  "Content-Type": "application/json",
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODJkNjYzMmUwYzAyZGM1NWU5YmQ3Y2UiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzQ4MjIxNTQyLCJleHAiOjE3NDgzMDc5NDJ9.28jyRHWix_xHvqOBReCResJuyfe7lCyj1_-NPc6ggnc",
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState(null);
  
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

        const hydrated = await Promise.all(
          cartData.cart.products.map(async ({ productId, quantity }) => {
            const pRes = await fetch(`${BASE_URL}/products/${productId}`);
            const pData = await pRes.json();
            return { ...pData, quantity };
          })
        );

        setCartItems(hydrated);
      } catch (error) {
        console.error("Error loading cart on refresh:", error);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (product) => {
    try {
      const data = {
        productId: product._id,
        quantity: 1,
      };
      // Call backend API to add product to cart
      const response = await fetch(`${BASE_URL}/carts`, {
        method: "POST",
        headers: AUTH_HEADER,
        body: JSON.stringify(data), // use _id from MongoDB
      });
  
      if (!response.ok) {
        setNotification({ type: "error", message: "Failed to add product to cart" });
        throw new Error("Failed to add product to cart");
      }
  
      // Fetch updated cart from backend
      const cartRes = await fetch(`${BASE_URL}/carts/get-cart`, {
        method: "GET",
        headers: AUTH_HEADER,
      });
  
      const cartData = await cartRes.json();
  
      if (!cartData.cart || !cartData.cart.products || !cartData.cart.products.length) {
        console.log("Cart is empty");
        setCartItems([]);
        return;
      }
  
      const hydrated = await Promise.all(
        cartData.cart.products.map(async ({ productId, quantity }) => {
          const pRes = await fetch(`${BASE_URL}/products/${productId}`);
          const pData = await pRes.json();
          return { ...pData, quantity };
        })
      );

      setNotification({ type: "success", message: "Added to cart!" });
      setCartItems(hydrated);
      console.log("Hydrated cart:", hydrated);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const decreaseQuantity = async (productId) => {
    try {
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
  
      const hydrated = await Promise.all(
        updatedCart.products.map(async ({ productId, quantity }) => {
          const res = await fetch(`${BASE_URL}/products/${productId}`);
          const data = await res.json();
          return { ...data, quantity };
        })
      );
  
      setCartItems(hydrated);
      setNotification({ type: "success", message: "Quantity decreased!" });
    } catch (error) {
      console.error("Error decreasing quantity:", error);
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
      value={{ cartItems, addToCart, decreaseQuantity, notification, setNotification }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
