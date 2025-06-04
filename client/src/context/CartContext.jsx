// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";// Import the useAuth hook
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const BASE_URL = "http://localhost:5001";

export const CartProvider = ({ children }) => {
  const { user } = useAuth(); 
  const AUTH_HEADER = {
    "Content-Type": "application/json",
    Authorization:
      `Bearer ${user?.accessToken}`
  };

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
    if (!user?.accessToken) return;
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
        const result = await response.json();
        const message = typeof result === 'string' ? result : `${response.status} ${response.statusText}`;
        setNotification({ type: "error", message });
        throw new Error(message);
      }
  
      const result = await response.json();
      const updatedCart = result.updatedCart;

      setCartItems(updatedCart.products || []);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setCartLoading(false);
    }
  };

  const decreaseQuantity = async (productId) => {
    try {
      setCartLoading(true);
      //await new Promise((resolve) => setTimeout(resolve, 1500));
      const response = await fetch(`${BASE_URL}/carts/decrease-quantity`, {
        method: "POST",
        headers: AUTH_HEADER,
        body: JSON.stringify({ productId, quantity: 1 }),
      });
  
      const result = await response.json();
      const updatedCart = result.updatedCart;
  
      if (!updatedCart.products || updatedCart.products.length === 0) {
        setCartItems([]);
        return;
      }

      if (!response.ok) {
        const result = await response.json();
        const message = typeof result === 'string' ? result : `${response.status} ${response.statusText}`;
        setNotification({ type: "error", message });
        throw new Error(message);
      }

      setCartItems(updatedCart.products || []);
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    } finally {
      setCartLoading(false); // hide loader
    }
  };
  
  const deleteCart = async () => {
    try {
      setCartLoading(true);
      const response = await fetch(`${BASE_URL}/carts/empty-cart`, {
        method: "PUT",
        headers: AUTH_HEADER,
      });
      const result = await response.json();
      if (!response.ok) {
        const message = typeof result === 'string' ? result : `${response.status} ${response.statusText}`;
        throw new Error(message);
      }
      setCartItems(result.products || []);
    }
    catch (error) {
      console.error("Error deleting cart:", error);
      setNotification({ type: "error", message: "Failed to delete cart." });
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <CartContext.Provider
      //value={{ cartItems, addToCart, removeFromCart, clearCart }}
      value={{ cartItems, 
        addToCart, 
        decreaseQuantity,
        deleteCart, 
        notification, 
        setNotification, 
        cartLoading, 
        totalPrice, 
        totalQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
