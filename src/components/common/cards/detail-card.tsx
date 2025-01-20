/*
  Appellation: detail-card <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as Lucide from 'lucide-react';
import * as React from 'react';
// project
import { cn } from '@/utils';
// components
import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover';

export type DescriptiveProps = {
  description?: React.ReactNode;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  breakpoint?: 'sm' | 'md' | 'lg';
  hideDescription?: boolean;
};

export const DetailHeader: React.FC<
  React.ComponentProps<typeof CardHeader> & DescriptiveProps
> = ({
  breakpoint = 'md',
  children,
  className,
  description,
  footer,
  hideDescription = false,
  title,
  ...props
}) => {
  const showDescription = description && !hideDescription;
  const showHeader = !(!title && !description && hideDescription);
  if (!showHeader && !children) {
    return null;
  }
  return (
    <CardHeader className={cn("flex flex-row flex-nowrap items-center gap-2 lg:gap-4", className)} {...props}>
      <div className="inline-flex flex-col flex-1 w-full mr-auto">
        <CardTitle className="text-nowrap">{title}</CardTitle>
        {showDescription && (
          <CardDescription
            className={`text-sm sr-only ${breakpoint}:not-sr-only`}
          >
            {description}
          </CardDescription>
        )}
      </div>
      {/* Informative Popover */}
      {description && (
        <div
          className={cn(
            'ml-auto items-center justify-end inline-flex',
            !showDescription && `${breakpoint}:hidden`
          )}
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost">
                <Lucide.Info />
                <span className="sr-only">{title}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              {description && <span>{description}</span>}
            </PopoverContent>
          </Popover>
        </div>
      )}
    </CardHeader>
  );
};
DetailHeader.displayName = 'DetailHeader';

export const DetailCard: React.FC<
  React.ComponentProps<typeof Card> & DescriptiveProps
> = ({
  breakpoint = 'md',
  children,
  className,
  description,
  footer,
  hideDescription = false,
  title,
  ...props
}) => {
  const showDescription = description && !hideDescription;
  const showHeader = !(!title && !description && hideDescription);
  return (
    <Card className={cn('h-full w-full', className)} {...props}>
      {showHeader && (
        <CardHeader className="flex flex-row flex-nowrap items-center gap-2 lg:gap-4">
          <div className="inline-flex flex-col flex-1 w-full mr-auto">
            <CardTitle className="text-nowrap">{title}</CardTitle>
            {showDescription && (
              <CardDescription
                className={`text-sm sr-only ${breakpoint}:not-sr-only`}
              >
                {description}
              </CardDescription>
            )}
          </div>
          {/* Informative Popover */}
          {description && (
            <div
              className={cn(
                'ml-auto items-center justify-end inline-flex',
                !showDescription && `${breakpoint}:hidden`
              )}
            >
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Lucide.Info />
                    <span className="sr-only">{title}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  {description && <span>{description}</span>}
                </PopoverContent>
              </Popover>
            </div>
          )}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};
DetailCard.displayName = 'DetailCard';
