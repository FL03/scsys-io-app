/*
  Appellation: checkout_button <checkout>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { CreditCardIcon } from 'lucide-react';
// project
import { cn } from '@/utils';
// components
import { Button } from '@/ui/button';

const actionUrl = '/api/stripe/checkout';

export const CheckoutButton: React.FC<React.ComponentProps<typeof Button>> = ({
  asChild,
  className,
  size = 'default',
  variant = 'ghost',
  ...props
}) => {
  return (
    <form action={actionUrl} method="POST">
      <Button
        asChild={asChild}
        className={cn('justify-start justify-items-center w-full', className)}
        role="link"
        type="submit"
        size={size}
        variant={variant}
        {...props}
      >
        <div className="flex flex-shrink items-center space-x-2">
          <CreditCardIcon className="w-6 h-6" />
          <span className="not-sr-only [[data-state=collapsed]_&]:sr-only">
            Checkout
          </span>
        </div>
      </Button>
    </form>
  );
};
CheckoutButton.displayName = 'CheckoutButton';

export const CheckoutCard: React.FC = () => {
  return (
    <div>
      <div className="block w-full text-foreground">
        <h1 className="text-2xl font-semi-bold">Checkout</h1>
        <span>Enter your payment details to complete your purchase.</span>
      </div>
      <section className="flex flex-col flex-1 rounded-lg border border-card bg-accent text-accent-foreground">
        <CheckoutButton />
      </section>
    </div>
  );
};
CheckoutCard.displayName = 'CheckoutCard';
