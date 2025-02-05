/*
  Appellation: details_scaffold <module>
  Contrib: @FL03
*/
'use client';
import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { Appbar, AppbarLeading } from '@/common/appbar';
import { BackButton } from '@/components/common/buttons/back-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { cn } from '@/utils';

const detailVariants = cva('w-full', {
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
      default: 'flex flex-col flex-1 gap-2 lg:gap-4',
    },
  },
});

type SkeletonProps = {
  description?: any;
  title?: any;
} & React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof detailVariants>;

// DetailScaffold
export const DetailSkeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    { className, children, flavor, variant, description, title, ...props },
    ref
  ) => {
    const showHeader = title || description;
    return (
      <div
        ref={ref}
        className={cn(detailVariants({ flavor, variant }), className)}
        {...props}
      >
        <Appbar variant="inherit">
          <AppbarLeading>
            <BackButton />
          </AppbarLeading>
        </Appbar>
        <div className="bg-inherit ring-0 drop-shadow-none inner-shadow-none border-none flex flex-col flex-1 gap-2 lg:gap-4 w-full">
          {showHeader && (
            <div className="block w-full px-4 py-2">
              {title && <h1 className="text-2xl font-semibold">{title}</h1>}
              {description && (
                <span className="text-lg font-semibold text-muted-foreground">
                  {description}
                </span>
              )}
            </div>
          )}
          <section className="relative h-full w-full flex flex-1 flex-col gap-2 lg:gap-4 px-4 py-2">
            {children}
          </section>
        </div>
      </div>
    );
  }
);
DetailSkeleton.displayName = 'DetailSkeleton';

export default DetailSkeleton;
