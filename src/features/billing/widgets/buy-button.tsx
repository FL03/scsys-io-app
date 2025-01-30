/*
  Appellation: buy_button <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { ShoppingCartIcon } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { ConfirmPaymentData, StripeElementsOptions } from '@stripe/stripe-js';
// project
import { getStripe } from '@/utils/stripe/config';
// components
import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
// feature-specific
import { purchaseOnClick } from '../utils';


export const StripePurchaseButton: React.FC<React.ComponentProps<typeof Button> & {
  confirmParams?: ConfirmPaymentData;
  label?: React.ReactNode;
}> = ({
  confirmParams,
  label = 'Purchase',
  ...props
}) => {
  const _href = { pathname: '/api/checkout', params: confirmParams };
  return (
    <Button onClick={async (event) => await purchaseOnClick(event)} {...props}>
      <ShoppingCartIcon />
      <span>{label}</span>
    </Button>
  );
};
StripePurchaseButton.displayName = 'StripePurchaseButton';

export const StripeProductCard: React.FC<
  React.ComponentProps<typeof Card> & { options?: StripeElementsOptions }
> = ({
  options = { amount: 10, currency: 'usd', mode: 'subscription' },
  ...props
}) => {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Buy</CardTitle>
        <CardDescription>Buy something</CardDescription>
      </CardHeader>
      <CardContent>
        <Elements
          options={{ amount: 10, currency: 'usd', mode: 'subscription' }}
          stripe={getStripe()}
        >
          <StripePurchaseButton />
        </Elements>
      </CardContent>
    </Card>
  );
};
StripeProductCard.displayName = 'StripeProductCard';