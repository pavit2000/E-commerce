import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import "../CSS/snackbar.css"; // Add your styles here

const Snackbar = () => {
  const { notification, setNotification } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setNotification(null); // Clear after showing
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!notification || !visible) return null;

  return (
    <div className={`snackbar ${notification.type}`}>
      {notification.message}
    </div>
  );
};

export default Snackbar;
