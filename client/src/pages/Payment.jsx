import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useAuth } from "../context/AuthContext";
import "../CSS/Payment.css";

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;
const BASE_URL = "http://localhost:5001";

function CheckoutForm({ orderId }) {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const createIntent = async () => {
      const res = await fetch(`${BASE_URL}/orders/${orderId}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setClientSecret(data.clientSecret);
      } else {
        setErrorMsg(data.msg || 'Unable to create payment');
      }
    };
    if (user) createIntent();
  }, [orderId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: { card: elements.getElement(CardElement) },
      }
    );
    if (!error && paymentIntent.status === "succeeded") {
      await fetch(`${BASE_URL}/orders/${orderId}/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
      });
      navigate("/orders");
    } else if (error) {
        setErrorMsg(error.message);
      }
  };

  return (
    <div className="payment-page">
      <div className="payment-box">
        <h2 className="payment-title">Complete Payment</h2>
        <form onSubmit={handleSubmit} className="payment-form">
          <CardElement className="payment-card" />
          <button type="submit" disabled={!stripe} className="payment-button">
            Pay
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Payment() {
  const { id } = useParams();
  if (!stripePromise) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        Stripe keys are missing. Set <code>VITE_STRIPE_PUBLIC_KEY</code> in
        <code>client/.env</code>.
      </div>
    );
  }
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm orderId={id} />
    </Elements>
  );
}
