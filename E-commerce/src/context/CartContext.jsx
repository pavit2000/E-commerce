// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
//import { useAuth } from "../Auth/AuthContext"; // Import the useAuth hook

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const userId = 1;

//   useEffect(() => {
//     const saveCartToAPI = async () => {
//       try {
//         const token = localStorage.getItem("token"); // or get from useAuth
//         await fetch("/api/cart", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(cartItems),
//         });
//       } catch (err) {
//         console.error("Failed to save cart:", err);
//       }
//     };
  
//     if (cartItems.length > 0) saveCartToAPI();
//   }, [cartItems]);

// useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await fetch("https://fakestoreapi.com/users/1");
//         const user = await res.json();
//         console.log(" User info:", user);
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };
  
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     const userId = localStorage.getItem("userId") || 1; // ✅ define it here
  
//     const saveCart = async () => {
//       try {
//         const payload = {
//           userId,
//           date: new Date().toISOString(),
//           products: cartItems.map((item) => ({
//             productId: item.id,
//             quantity: item.quantity,
//           })),
//         };
  
//         await fetch("https://fakestoreapi.com/carts", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         });
//         console.log(" Cart saved to FakeStoreAPI");
//       } catch (error) {
//         console.error(" Error saving cart:", error);
//       }
//     };
  
//     if (cartItems.length > 0) {
//       saveCart();
//     }
//   }, [cartItems]);


  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

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
