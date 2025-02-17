/*
  Appellation: shift-buttons <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { DeleteIcon, Edit2Icon } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { VariantProps, cva } from 'class-variance-authority';
import { toast } from 'sonner';
// project
import { useProfile } from '@/features/profiles';
import { cn } from '@/utils';
// components
import { Button } from '@/ui/button';
// feature-specific
import { deleteTimesheet } from '../utils';

type ActionButtonProps = { itemId?: string; };

const actionButtonVariants = cva('', {
  defaultVariants: {
    flavor: 'default',
    variant: 'default',
  },
  variants: {
    flavor: {
      default: 'bg-background text-foreground',
      accent: 'bg-accent border-accent text-accent-foreground',
      destructive: 'bg-destructive border-destructive text-destructive-foreground hover:bg-destructive/80 hover:border-destructive/80',
      primary: 'bg-primary border-primary text-primary-foreground',
      secondary: 'bg-secondary border-secondary text-secondary-foreground',
      ghost: 'bg-transparent border-none text-foreground',
    },
    variant: {
      default: '',
      menu: ''
    },
  },
});

export const DeleteShiftButton: React.FC<
  React.ComponentProps<typeof Button> & ActionButtonProps
> = ({ className, itemId, size = 'default', variant = 'destructive', ...props }) => {
  // use the profile provider
  const { username } = useProfile();
  // use the router
  const router = useRouter();

  return (
    <Button
      className={cn('gap-2 items-center justify-start px-1', className)}
      onClick={async () => {
        try {
          await deleteTimesheet(itemId);
          toast.success('Successfully deleted the shift!');
          // revalidate the cache
          revalidatePath(`/${username}/shifts`, 'page');
          // redirect to the dashboard
          router.push(`/${username}/shifts?view=dashboard`);
        } catch (error) {
          toast.error('Failed to delete shift');
        }
      }}
      size={size}
      variant={variant}
      {...props}
    >
      <DeleteIcon />
      <span className="text-destructive-foreground">Delete</span>
    </Button>
  );
};
DeleteShiftButton.displayName = 'DeleteShiftButton';


export const EditShiftButton: React.FC<
  React.ComponentProps<typeof Button> & ActionButtonProps
> = ({ className, itemId, size = 'default', variant = 'ghost', ...props }) => {
  // use the profile provider to get a reference to the current username
  const { username } = useProfile();

  return (
    <Button
      asChild
      className={cn('gap-2 items-center justify-start px-1', className)}
      size={size}
      variant={variant}
      {...props}
    >
      <Link
        href={{
          pathname: `/${username}/shifts/${itemId}`,
          query: { action: 'update', view: 'form' },
        }}
      >
        <Edit2Icon />
        <span>Edit</span>
      </Link>
    </Button>
  );
};
DeleteShiftButton.displayName = 'DeleteShiftButton';