// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
//import { useAuth } from "../Auth/AuthContext"; // Import the useAuth hook

const CartContext = createContext();
const BASE_URL = "http://localhost:5001";
const AUTH_HEADER = {
  "Content-Type": "application/json",
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODJkNjYzMmUwYzAyZGM1NWU5YmQ3Y2UiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzQ3ODA1Nzk5LCJleHAiOjE3NDc4OTIxOTl9.JjuCMOiury_6tOeSkXk3ICn5KYPK6_xtb_7IPFXI4HA",
};


export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const userId = 1;
  const cartId = 1;

//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/carts/get-cart`, {
//             method: "GET",
//             headers: AUTH_HEADER
//           });
//         const data = await res.json();
//         if (!data.length) return;

//         const latestCart = data[data.length - 1];
//         const hydrated = await Promise.all(
//           latestCart.products.map(async ({ productId, quantity }) => {
//             const p = await fetch(`${BASE_URL}/products/${productId}`);
//             const pd = await p.json();
//             return { ...pd, quantity };
//           })
//         );
//         setCartItems(hydrated);
//       } catch (err) {
//         console.error("Error fetching cart:", err);
//       }
//     };

//     fetchCart();
//   }, []);

//   const updateCartAPI = async (items) => {
//     const payload = {
//       userId,
//       date: new Date().toISOString(),
//       products: items.map((item) => ({
//         productId: item.id,
//         quantity: item.quantity,
//       })),
//     };

//     try {
//       await fetch(`${BASE_URL}/carts/`, {
//         method: "POST",
//         headers: { 
//             "Content-Type": "application/json" 

//         },
//         body: JSON.stringify(payload),
//       });
//     } catch (error) {
//       console.error("Failed to update cart:", error);
//     }
//   };


//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
