/*
  Appellation: server <actions>
  Contrib: @FL03
*/
import { getStripe } from '@/utils/stripe/config';

const return_url = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const purchaseOnClick = async (event: React.FormEvent | any) => {
  const stripe = await getStripe();
  event.preventDefault();

  if (!stripe) return;

  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify({ amount: 1000 }), // Replace with the actual amount in cents
  });

  const { clientSecret } = await response.json();

  const { error: stripeError } = await stripe.confirmPayment({
    clientSecret,
    confirmParams: {
      return_url, // Replace with the actual return URL
    },
  });

  if (stripeError) {
    console.error(stripeError);
  }
};