/*
  Appellation: checkout_form <checkout>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions } from '@stripe/stripe-js';
import { getStripe } from '@/utils/stripe/config';

import { CheckoutForm } from '../widgets/checkout-form';

type CheckoutProps = {
  options?: StripeElementsOptions;
};

export const CheckoutScreen: React.FC<CheckoutProps> = ({ options }) => {
  options = options || { amount: 10, currency: 'usd', mode: 'subscription' };
  return (
    <Elements options={options} stripe={getStripe()}>
      <CheckoutForm />
    </Elements>
  );
};
CheckoutScreen.displayName = 'CheckoutScreen';

export default CheckoutScreen;
