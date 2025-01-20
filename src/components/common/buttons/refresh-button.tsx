/*
  Appellation: refresh-button <module>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import { RefreshCwIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip';


export const RefreshButton: React.FC<React.ComponentProps<typeof Button>> = ({ size = 'icon', variant = 'ghost', ...props }) => {
  // Use the router to refresh the page
  const router = useRouter();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={router.refresh} size={size} variant={variant} {...props}>
            <RefreshCwIcon />
            <span className="sr-only">Refresh</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Refresh the page</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
RefreshButton.displayName = 'RefreshButton';

export default RefreshButton;