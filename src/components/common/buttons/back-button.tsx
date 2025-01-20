/*
  Appellation: back_button <misc>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip';

export const BackButton: React.FC<React.ComponentProps<typeof Button> & {}> = ({
  onClick,
  size = 'icon',
  variant = 'ghost',
  ...props
}) => {
  // Use the router to navigate back
  const router = useRouter();
  // If an onClick prop is provided, use it, otherwise use the router.back function
  const handleClick = onClick ?? router.back;
  // return the back button with a tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleClick}
            size={size}
            variant={variant}
            {...props}
          >
            <ArrowLeftIcon size={24} />
            <span className="sr-only">Back</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Return to the previous page</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
BackButton.displayName = 'BackButton';

export default BackButton;
