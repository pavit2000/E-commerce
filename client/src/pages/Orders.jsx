import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../CSS/Orders.css";
import LogoutButton from "../components/LogoutButton";

const BASE_URL = "http://localhost:5001";

function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BASE_URL}/orders/user-orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      }
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const handlePay = (orderId) => {
    navigate(`/pay/${orderId}`);
  };

  if (loading) return <p className="loading">Loading orders...</p>;

  return (
    <div className="container">
      {user && (
        <>
          <LogoutButton />
          <div className="user-display">
            Welcome, <strong>{user.username}</strong>
          </div>
        </>
      )}
      <h1 className="heading">Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <p>Order ID: {order.paymentIntent.id}</p>
            <p>Status: {order.paymentIntent.status}</p>
            <ul>
              {order.products.map((item) => (
                <li key={item._id || item.productId?._id || item.productId}>
                  {item.title} - Qty: {item.quantity} x ${item.price}
                </li>
              ))}
            </ul>
            <p className="order-total">Total: ${order.totalPrice?.toFixed(2) || order.paymentIntent.amount}</p>
            {order.paymentIntent.status !== 'Paid' && (
              <button onClick={() => handlePay(order._id)}>Pay Now</button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
