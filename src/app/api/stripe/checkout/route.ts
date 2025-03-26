/*
  Appellation: route <module>
  Contrib: @FL03
*/
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

import Stripe from 'stripe';

const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const loadPriceId = () => {
  return process.env.NEXT_PUBLIC_STRIPE_PRICE_ID ?? 'price_1QSmsHIzcUpdxAib0bJ4xuxG';
}

export const POST = async (req: NextRequest) => {
  const data = await req.json().catch((error) => {
    console.error('Error parsing request body', error);
  });
  const price_id = loadPriceId();
  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: price_id,
        quantity: data?.quantity || 1,
      },
    ],
    mode: 'subscription',
    success_url: `${origin}/?success=true`,
    cancel_url: `${origin}/?canceled=true`,
    automatic_tax: { enabled: true },
    ui_mode: 'hosted',
  });
  // Redirect to Checkout.
  redirect(session.url || origin);
};
