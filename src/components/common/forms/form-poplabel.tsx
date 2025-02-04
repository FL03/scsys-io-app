/*
  Appellation: form-tooltip <module>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import { InfoIcon } from 'lucide-react';
// hooks
import { useIsMobile } from '@/hooks/use-mobile';
// components
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


export const FormItemDescription: React.FC<React.PropsWithChildren<{ showDescription?: boolean }>> = ({ children, showDescription }) => {
  const isMobile = useIsMobile();

  const hideDescription  = isMobile || !showDescription;
  return (
    <>
      {hideDescription ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost">
              <InfoIcon />
              <span className="sr-only">Info</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent>{children}</PopoverContent>
        </Popover>
      ) : (
        <span>{children}</span>
      )}
    </>
  );
}