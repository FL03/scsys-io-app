/*
  Appellation: buy_button <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
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

type ButtonProps = {
  confirmParams?: ConfirmPaymentData;
  label?: string;
};

export const StripePurchaseButton: React.FC<ButtonProps> = ({
  confirmParams,
  label,
}) => {
  confirmParams = confirmParams || { return_url: 'http://localhost:3000' };
  label = label || 'Purchase';

  return (
    <Button onClick={async (event) => await purchaseOnClick(event)}>Buy</Button>
  );
};

type CardProps = {
  options?: StripeElementsOptions;
};

export const StripeProductCard: React.FC<CardProps> = ({ options }) => {
  options = options || { amount: 10, currency: 'usd', mode: 'subscription' };

  return (
    <Card>
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
