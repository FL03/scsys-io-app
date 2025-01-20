'use client';
import * as React from 'react';
import * as Lucide from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/ui/sheet";

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
export const FormOverlay: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  defaultOpen = false,
  description,
  title,
}) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState<boolean>(defaultOpen);
 

  if (isMobile) {
    return (
      <Sheet defaultOpen={defaultOpen} open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <OverlayTrigger />
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
        <OverlayTrigger/>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
FormOverlay.displayName = 'FormDialog';
