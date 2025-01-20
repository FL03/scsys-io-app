/*
  Appellation: checkout_form <checkout>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import {
  useStripe,
  useElements,
  Elements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { ConfirmPaymentData } from '@stripe/stripe-js';
import { fetchStripeSecret } from '@/utils/stripe/config';

type CheckoutFormProps = {
  confirmParams?: ConfirmPaymentData;
  clientSecret?: string;
};

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret, confirmParams }) => {
  confirmParams = confirmParams || { return_url: 'http://localhost:3000' };

  const stripe = useStripe();
  stripe?.elements({clientSecret})
  const elements = useElements();

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      clientSecret: await fetchStripeSecret(1000), // Replace with the actual amount in cents
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams,
      
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button disabled={!stripe} type="submit">Submit</button>
      </form>
  );
};

export default CheckoutForm;