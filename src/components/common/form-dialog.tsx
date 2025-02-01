/*
  Appellation: form-dialog <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import * as Lucide from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
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
};

export const OverlayTrigger: React.FC<React.ComponentProps<typeof Button>> = ({
  size = 'icon',
  variant = 'outline',
  ...props
}) => {
  return (
    <Button size={size} variant={variant} {...props}>
      <Lucide.PlusIcon />
      <span className="sr-only">Create</span>
    </Button>
  );
};
export const FormOverlay: React.FC<React.ComponentProps<typeof Button> & Props> = ({
  children,
  defaultOpen = false,
  description,
  size = 'icon',
  variant = 'outline',
  title,
}) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState<boolean>(defaultOpen);

  if (isMobile) {
    return (
      <Sheet defaultOpen={defaultOpen} open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <OverlayTrigger size={size} variant={variant}/>
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
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={setOpen}>
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
