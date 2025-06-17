import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');
const BASE_URL = 'http://localhost:5001';

function CheckoutForm({orderId}) {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const createIntent = async () => {
      const res = await fetch(`${BASE_URL}/orders/${orderId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setClientSecret(data.clientSecret);
      }
    };
    if (user) createIntent();
  }, [orderId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });
    if (!error && paymentIntent.status === 'succeeded') {
      await fetch(`${BASE_URL}/orders/${orderId}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({ paymentIntentId: paymentIntent.id })
      });
      navigate('/orders');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <CardElement />
      <button type="submit" disabled={!stripe}>Pay</button>
    </form>
  );
}

export default function Payment() {
  const { id } = useParams();
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm orderId={id} />
    </Elements>
  );
}