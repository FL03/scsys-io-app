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
import { useIsMobile } from '@/hooks/use-mobile';

export type DetailProps = {
  description?: React.ReactNode;
  title?: React.ReactNode;
  breakpoint?: 'sm' | 'md' | 'lg';
  hideDescription?: boolean;
};

export const DetailHeader: React.FC<
  React.ComponentProps<typeof CardHeader> & DetailProps
> = ({
  breakpoint = 'md',
  children,
  className,
  description,
  hideDescription = false,
  title,
  ...props
}) => {
  
  const isMobile = useIsMobile();
  
  const showDescription = description && !hideDescription && !isMobile;
  const showHeader = title && showDescription;
  
  return (
    <CardHeader
      className={cn(
        'flex flex-row flex-nowrap items-center gap-2 lg:gap-4',
        className
      )}
      {...props}
    >
      <div className="inline-flex flex-col flex-1 w-full mr-auto">
        <CardTitle className="text-nowrap">{title}</CardTitle>
        {showDescription && (
          <CardDescription
            className={`text-sm sr-only ${breakpoint}:not-sr-only`}
          >
            {description}
          </CardDescription>
        )}
        {children}
      </div>
      {/* Informative Popover */}
      {!showDescription && (
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
  React.ComponentProps<typeof Card> & DetailProps & { 
  footer?: React.ReactNode;
  contentClassName?: string;}
> = ({
  breakpoint = 'md',
  children,
  className,
  contentClassName,
  description,
  footer,
  hideDescription,
  title,
  ...props
}) => {
  const isMobile = useIsMobile();
  const showDescription = description && !hideDescription;
  const showHeader = !isMobile || !(!title && !showDescription);
  return (
    <Card className={cn('w-full', className)} {...props}>
      <DetailHeader description={description} hideDescription={hideDescription} title={title}/>
      <CardContent
        className={cn(
          'flex flex-1 flex-col items-center justify-center justify-items-center',
          contentClassName
        )}
      >
        {children}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};
DetailCard.displayName = 'DetailCard';
