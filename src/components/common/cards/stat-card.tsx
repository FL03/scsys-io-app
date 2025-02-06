/*
  Appellation: stat-card <module>
  Contrib: @FL03
*/
'use client';
// globals
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
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

type StatProps = {
  description?: React.ReactNode;
  title?: React.ReactNode;
  showTooltip?: boolean;
  showDescription?: boolean;
};

export const InsightPopover: React.FC<
  React.HTMLAttributes<HTMLButtonElement> & StatProps
> = ({ description, title, ...props }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" {...props}>
          <Lucide.Info />
          <span className="sr-only">{title}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <span>{description}</span>
      </PopoverContent>
    </Popover>
  );
};
InsightPopover.displayName = 'InsightPopover';


export const InfoCard: React.FC<
  React.ComponentProps<typeof Card> & {
    description?: React.ReactNode;
    title?: React.ReactNode;
    hideDescription?: boolean;
  }
> = ({ className, description, hideDescription, title, ...props }) => {
  // hooks
  const isMobile = useIsMobile();
  // determine how the description should be displayed
  const showDescription = description && !hideDescription && !isMobile;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={cn('flex flex-col flex-1 w-full', className)}
            {...props}
          >
            <CardHeader className="flex flex-row flex-nowrap items-center gap-2">
              <div className="inline-flex flex-col mr-auto">
                <CardTitle>{title}</CardTitle>
                {showDescription && (
                  <CardDescription>{description}</CardDescription>
                )}
              </div>
              {!showDescription && (
                <InsightPopover
                  className={cn(showDescription ? 'hidden' : 'inline-flex')}
                  title={title}
                  description={description}
                />
              )}
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center">
              {props.children}
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          {title}: {description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
InfoCard.displayName = 'InfoCard';

export default InfoCard;
