/*
  Appellation: config <stripe>
  Contrib: @FL03
*/

import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
    if (!publicKey) {
      throw new Error('Stripe publishable key is missing');
    }
    stripePromise = loadStripe(publicKey, {});
  }

  return stripePromise;
};

export const loadOptions = () => {
  return {
    amount: 10,
    clientSecret: process.env.STRIPE_SECRET_KEY,
    currency: 'usd',
  };
};

export const fetchStripeSecret = async (amount?: number) => {
  const response = await fetch('/api/stripe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amount ?? 1000 }), // Replace with the actual amount in cents
  });

  const { clientSecret } = await response.json();
  return clientSecret;
};