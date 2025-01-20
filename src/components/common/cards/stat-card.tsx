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
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/ui/hover-card';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip';

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

const InsightHoverCard: React.FC<
  React.HTMLAttributes<HTMLButtonElement> & StatProps
> = ({ title, description, ...props }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button size="icon" variant="ghost" {...props}>
          <Lucide.Info />
          <span className="sr-only">{title}</span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">{description}</div>
      </HoverCardContent>
    </HoverCard>
  );
};
InsightHoverCard.displayName = 'InsightHoverCard';

const StatTooltip: React.FC<StatProps> = ({ title, description }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost">
            <Lucide.Info />
            <span className="sr-only">{title}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{description}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
StatTooltip.displayName = 'StatTooltip';

export const StatCard: React.FC<
  React.ComponentProps<typeof Card> & StatProps
> = ({
  children,
  className,
  title,
  description,
  showDescription = false,
  ...props
}) => {
  return (
    <Card className={cn('flex flex-col flex-1 w-full', className)} {...props}>
      <CardHeader className="flex flex-1 flex-row flex-nowrap items-center justify-between">
        <div className="inline-flex flex-col flex-1 w-full mr-auto">
          <CardTitle className="text-nowrap">{title}</CardTitle>
          {showDescription && (
            <CardDescription className="text-sm sr-only md:not-sr-only">
              {description}
            </CardDescription>
          )}
        </div>
        {/* Informative Popover */}
        <div
          className={cn(
            'ml-auto items-center justify-end',
            showDescription && 'inline-flex md:hidden',
            !showDescription && 'inline-flex',
          )}
        >
          <InsightPopover
            className="m-auto"
            title={title}
            description={description}
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 items-center justify-end w-full">
        {children}
      </CardContent>
    </Card>
  );
};
StatCard.displayName = 'StatCard';

export default StatCard;
