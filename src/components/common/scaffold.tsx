/*
  Appellation: scaffold <scaffolds>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

const scaffoldVariants = cva(
  'flex flex-col justify-items-center justify-start',
  {
    defaultVariants: {
      flavor: 'default',
      variant: 'default',
    },
    variants: {
      flavor: {
        default: 'bg-background text-foreground',
        accent: 'bg-accent text-accent-foreground',
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
      },
      variant: {
        default: '',
        rounded: 'rounded',
      },
    },
  }
);

type ScaffoldContext = {
  flavor?: string | null;
  variant?: string | null;
};

const ScaffoldContext = React.createContext<ScaffoldContext>({
  flavor: 'default',
  variant: 'default',
});

export const useScaffold = () => {
  const ctx = React.useContext(ScaffoldContext);
  if (!ctx) {
    throw new Error('useScaffold must be used within a ScaffoldProvider');
  }
  return ctx;
};

// Scaffold
export const Scaffold = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof scaffoldVariants>
>(({ className, flavor, variant, ...props }, ref) => {
  const ctx = React.useMemo(() => ({ flavor, variant }), [flavor, variant]);
  return (
    <ScaffoldContext.Provider value={ctx}>
      <div
        ref={ref}
        className={cn(scaffoldVariants({ flavor, variant }), className)}
        {...props}
      />
    </ScaffoldContext.Provider>
  );
});
Scaffold.displayName = 'Scaffold';

// ScaffoldContent
export const ScaffoldContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn('container mx-auto w-full', className)}
      {...props}
    />
  );
});
ScaffoldContent.displayName = 'ScaffoldContent';
