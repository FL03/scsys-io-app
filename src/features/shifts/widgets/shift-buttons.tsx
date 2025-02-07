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
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
// project
import { useProfile } from '@/features/profiles';
import { cn } from '@/utils';
// components
import { Button } from '@/ui/button';
// feature-specific
import { deleteTimesheet } from '../utils';

export const DeleteShiftButton: React.FC<
  React.ComponentProps<typeof Button>
> = ({ className, size = 'default', variant = 'destructive', ...props }) => {
  // use the router
  const router = useRouter();
  // get the id from the query
  const search = useSearchParams();
  const id = search.get('id');
  // get the alias from the query
  const alias = search.get('alias');

  return (
    <Button
      className={cn('gap-2 items-center justify-start px-1', className)}
      onClick={async () => {
        try {
          await deleteTimesheet(id);
          toast.success('Successfully deleted the shift!');
          // revalidate the cache
          revalidatePath(`/${alias}/shifts`, 'page');
          // redirect to the dashboard
          router.push(`/${alias}/shifts?view=dashboard`);
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
  React.ComponentProps<typeof Button> & { itemId?: string; }
> = ({ className, itemId, size = 'default', variant = 'ghost', ...props }) => {
  // use the router
  const router = useRouter();
  const { username } = useProfile();

  return (
    <Button
    asChild
      className={cn('w-full', className)}
      size={size}
      variant={variant}
      {...props}
    >
      <Link href={{
        pathname: `/${username}/shifts/${itemId}`,
        query: { action: 'update', view: 'form' },
      }}>
        <Edit2Icon />
        <span>Edit</span>
      </Link>
    </Button>
  );
};
DeleteShiftButton.displayName = 'DeleteShiftButton';