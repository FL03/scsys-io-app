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
import { cn, logger } from '@/utils';
// components
import { Button } from '@/ui/button';
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
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>;
  size?: 'icon' | 'default' | 'lg' | 'sm';
  variant?: 'outline' | 'link' | 'ghost' | 'secondary' | 'destructive';
};

export const FormSheetTrigger: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Button>, 'children'>
> = ({ ref, size = 'icon', variant = 'outline', ...props }) => {
  return (
    <Button ref={ref} size={size} variant={variant} {...props}>
      <Lucide.PlusIcon />
      <span className="sr-only">Create</span>
    </Button>
  );
};
FormSheetTrigger.displayName = 'FormSheetTrigger';

type OverlayProps = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>;
}

type TitledProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export const FormSheet: React.FC<
  React.ComponentProps<typeof Sheet> & TitledProps & {
    size?: 'icon' | 'default' | 'lg' | 'sm';
    variant?: 'outline' | 'link' | 'ghost' | 'secondary' | 'destructive';
  }
> = ({
  children,
  defaultOpen = false,
  description,
  size = 'icon',
  variant = 'outline',
  title,
  ...props
}) => {
  // const { isOpen, setOpen } = useFormSheet();
  logger.info('Rendering FormOverlay');
  // call the useIsMobile hook
  const isMobile = useIsMobile();
  // if the form contains a header
  const showHeader = !!title || !!description;
  // render the form sheet
  return (
    <Sheet defaultOpen={defaultOpen} {...props}>
      <SheetTrigger asChild>
        <FormSheetTrigger size={size} variant={variant} />
      </SheetTrigger>
      <SheetContent
        side={isMobile ? 'bottom' : 'right'}
        className={cn(
          'relative flex flex-1 flex-col gap-2 max-w-sm',
          'bg-card text-card-foreground border border-mute',
        )}
      >
        {showHeader && (
          <SheetHeader>
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}
        <div className="h-full w-full">{children}</div>
      </SheetContent>
    </Sheet>
  );
};
FormSheet.displayName = 'FormSheet';

type FormOverlayContext = {
  isOpen: boolean;
  closeOverlay: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const FormOverlayContext = React.createContext<FormOverlayContext | null>(null);

export const useFormSheet = () => {
  const ctx = React.useContext(FormOverlayContext);
  if (!ctx) {
    throw new Error('useFormOverlay must be used within a FormOverlayProvider');
  }
  return ctx;
};

export const FormOverlayProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => {
  const [open, setOpen] = React.useState(false);

  const closeOverlay = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const ctx = React.useMemo(
    () => ({ closeOverlay, isOpen: open, setOpen }),
    [closeOverlay, open, setOpen]
  );
  return (
    <FormOverlayContext.Provider value={ctx}>
      <div ref={ref} {...props} />
    </FormOverlayContext.Provider>
  );
});
FormOverlayProvider.displayName = 'FormOverlayProvider';
