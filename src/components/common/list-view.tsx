/*
  Appellation: list_tile <module>
  Contrib: @FL03
*/
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/utils';

const tileVariants = cva(
  'w-full px-4 py-2 transition-colors duration-200 ease-in-out hover:cursor-pointer',
  {
    defaultVariants: {
      flavor: 'default',
      variant: 'default',
    },
    variants: {
      flavor: {
        default: 'bg-background text-foreground hover:bg-primary/10',
        accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
        primary: 'bg-primary text-primary-foreground',
      },
      variant: {
        default: cn(
          'flex flex-1 flex-row flex-nowrap gap-2 lg:gap-4 ',
          'focus:outline-none focus:ring focus:ring-ring/50'
        ),
      },
    },
  }
);

export const listVariants = cva('w-full gap-2 lg:gap-4', {
  defaultVariants: {
    variant: 'default',
  },
  variants: {
    variant: {
      default: 'h-fit w-full list-none',
      horizontal: 'flex flex-1 flex-row items-center',
    },
  },
});

export type ListVariants = VariantProps<typeof listVariants>;

export const OList = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement> & ListVariants
>(({ className, variant, ...props }, ref) => {
  return (
    <ol
      ref={ref}
      className={cn(listVariants({ variant }), className)}
      {...props}
    />
  );
});
OList.displayName = 'OList';

export const UList = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement> & ListVariants
>(({ className, variant, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      className={cn(listVariants({ variant }), className)}
      {...props}
    />
  );
});
UList.displayName = 'UList';

// ListTile
export const ListTile = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> &
    VariantProps<typeof tileVariants> & { asChild?: boolean }
>(({ asChild = false, className, flavor, variant, ...props }, ref) => {
  // render as Slot if asChild is true
  const Comp = asChild ? Slot : 'li';
  // return the component
  return (
    <Comp
      ref={ref}
      className={cn(tileVariants({ flavor, variant }), className)}
      {...props}
    />
  );
});
ListTile.displayName = 'ListTile';

// Tile Leading
export const TileLeading = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, ...props }, ref) => {
  const Comp = props.asChild ? Slot : 'div';
  // return the component
  return (
    <Comp
      ref={ref}
      className={cn('mr-auto items-center w-full max-w-[75px]', className)}
      {...props}
    />
  );
});
TileLeading.displayName = 'TileLeading';

// Tile Trailing
export const TileTrailing = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center justify-end max-w-[75px] ml-auto',
        className
      )}
      {...props}
    />
  );
});
TileTrailing.displayName = 'TileTrailing';

// TileBody
export const TileBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ asChild = false, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';
  return <Comp ref={ref} className={cn('w-full', className)} {...props} />;
});
TileBody.displayName = 'TileBody';
// TileContent
export const TileContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('w-full flex flex-1 flex-col gap-2 lg:gap-4', className)} {...props} />;
});
TileContent.displayName = 'TileContent';

// Tile Header
export const TileHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('w-full flex flex-col mb-2 ', className)} {...props} />;
});
TileHeader.displayName = 'TileHeader';

// TileFooter
export const TileFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('w-full inline-flex flex-row flex-nowrap gap-2 lg:gap-4', className)}
      {...props}
    />
  );
});
TileFooter.displayName = 'TileFooter';

// TileTitle
export const TileTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn('font-semibold', className)}
      {...props}
    />
  );
});
TileTitle.displayName = 'TileTitle';

// TileDescription
export const TileDescription = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});
TileDescription.displayName = 'TileDescription';

export default ListTile;
