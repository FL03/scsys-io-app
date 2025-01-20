/*
  Appellation: heading <module>
  Contrib: @FL03
*/
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

const headingVariants = cva('items-center text-nowrap w-full', {
  variants: {
    flavor: {
      default: 'text-foreground',
      accent: 'text-accent-foreground',
      destructive: 'text-destructive-foreground',
      primary: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
    },
    size: {
      default: 'text-md',
      sm: 'text-sm',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl'
    },
    weight: {
      default: 'font-normal',
      light: 'font-light',
      bold: 'font-bold',
      semibold: 'font-semibold',
    },
  },
  defaultVariants: {
    flavor: 'default',
    size: 'default',
    weight: 'default',
  },
});

type HeadingProps = VariantProps<typeof headingVariants>;

// Typograpphy: Heading 1
export const H1 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & HeadingProps
>(({ className, flavor, size, weight, ...props }, ref) => {
  return (
    <h1
      ref={ref}
      className={cn(headingVariants({ flavor, size, weight }), className)}
      {...props}
    />
  );
});
H1.displayName = 'H1';

// Typograpphy: Heading 3
export const H2 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & HeadingProps
>(({ className, flavor, size, weight, ...props }, ref) => {
  return (
    <h2
      ref={ref}
      className={cn(headingVariants({ flavor, size, weight }), className)}
      {...props}
    />
  );
});
H2.displayName = 'H2';

// Typograpphy: Heading 3
export const H3 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & HeadingProps
>(({ className, flavor, size, weight, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn(headingVariants({ flavor, size, weight }), className)}
      {...props}
    />
  );
});
H3.displayName = 'H3';

// Typograpphy: Heading 4
export const H4 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & HeadingProps
>(({ className, flavor, size, weight, ...props }, ref) => {
  return (
    <h4
      ref={ref}
      className={cn(headingVariants({ flavor, size, weight }), className)}
      {...props}
    />
  );
});
H4.displayName = 'H4';

// Typograpphy: Heading 5
export const H5 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & HeadingProps
>(({ className, flavor, size, weight, ...props }, ref) => {
  return (
    <h5
      ref={ref}
      className={cn(headingVariants({ flavor, size, weight }), className)}
      {...props}
    />
  );
});
H5.displayName = 'H5';
