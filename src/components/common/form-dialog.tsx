/*
  Appellation: form-dialog <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import * as Lucide from 'lucide-react';
// project
import { useIsMobile } from '@/hooks/use-mobile';
import { logger } from '@/utils';
// components
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/ui/sheet';

type Props = {
  defaultValues?: any;
  values?: any;
  description?: React.ReactNode;
  title?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: 'icon' | 'default' | 'lg' | 'sm';
  variant?: 'outline' | 'link' | 'ghost' | 'secondary' | 'destructive';
};

export const OverlayTrigger: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Button>, 'children'>
> = ({ ref, size = 'icon', variant = 'outline', ...props }) => {
  return (
    <Button ref={ref} size={size} variant={variant} {...props}>
      <Lucide.PlusIcon />
      <span className="sr-only">Create</span>
    </Button>
  );
};
OverlayTrigger.displayName = 'OverlayTrigger';


export const FormOverlay: React.FC<
  React.PropsWithChildren<Props>
> = ({
  children,
  defaultOpen = false,
  description,
  size = 'icon',
  variant = 'outline',
  open,
  onOpenChange,
  title,
}) => {
  logger.info("Rendering FormOverlay");

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <OverlayTrigger size={size} variant={variant} />
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="bg-card text-card-foreground flex flex-shrink flex-col gap-2"
        >
          <SheetHeader>
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          <div className="mx-auto">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <OverlayTrigger size={size} variant={variant} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
FormOverlay.displayName = 'FormDialog';
