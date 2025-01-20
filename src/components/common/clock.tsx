/*
  Appellation: clock <components>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip';
import { cn } from '@/utils';

interface ClockProps {
  key?: any;
  locals?: Intl.LocalesArgument;
  options?: Intl.DateTimeFormatOptions;
  refresh?: number; // refresh time in seconds
}

type ClockContext = {
  time?: number;
  setTime?: React.Dispatch<React.SetStateAction<number>>;
};

const ClockContext = React.createContext<ClockContext>({});

export const useClock = () => {
  const context = React.useContext(ClockContext);
  if (!context) {
    throw new Error('useClock must be used within a ClockProvider');
  }
  return context;
};

type ProviderProps = {
  interval?: number;
}

export const ClockProvider: React.FC<React.PropsWithChildren<ProviderProps>> = ({
  children,
  interval: intervalProp = 1000,
}) => {
  const [time, setTime] = React.useState<number>(Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, intervalProp);

    return () => clearInterval(interval);
  }, [setTime]);

  const ctx = React.useMemo(() => ({ time, setTime }), [time, setTime]);
  return <ClockContext.Provider value={ctx}>{children}</ClockContext.Provider>;
};

export const ClockWidget = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & ClockProps
>(
  (
    {
      className,
      locals = 'en-US',
      options = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      },
      refresh = 30,
      ...props
    },
    ref
  ) => {
    const [time, setTime] = React.useState(
      new Date().toLocaleTimeString(locals, options)
    );
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    const interval = intervalRef.current;

    const updateClock = () => {
      setTime(new Date().toLocaleTimeString(locals, options));
    };

    React.useEffect(() => {
      setInterval(updateClock, 1000 * refresh);
      updateClock(); // Update immediately on mount

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }, [, refresh]);

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              ref={ref}
              className={cn(
                'inline-flex items-center text-foreground font-semibold',
                className
              )}
              {...props}
            >
              {time}
            </span>
          </TooltipTrigger>
          <TooltipContent>{new Date().toLocaleDateString()}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);
ClockWidget.displayName = 'Clock';

export default ClockWidget;
