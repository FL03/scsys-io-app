/*
  Appellation: shift-buttons <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { DeleteIcon, Edit2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cva } from 'class-variance-authority';
import { toast } from 'sonner';
// project
import { useProfile } from '@/features/profiles';
import { cn } from '@/utils';
// components
import { Button } from '@/ui/button';
// feature-specific
import { deleteTimesheet } from '../utils';

type ActionButtonProps = { itemId?: string; };

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
          // revalidatePath(`/${username}/shifts`, 'page');
          // redirect to the dashboard
          router.push(`/${username}/shifts?view=dashboard`);
        } catch (error) {
          toast.error('Failed to delete shift: ' + error);
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