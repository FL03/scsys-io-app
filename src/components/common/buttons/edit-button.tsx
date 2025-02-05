/*
  Appellation: edit-button <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { EditIcon } from 'lucide-react';
import Link from 'next/link';
// project
import { Url } from '@/types';
// components
import { Button } from '@/ui/button';

export const EditButton: React.FC<
  React.ComponentProps<typeof Button> & { href?: Url }
> = ({ href, size = 'icon', variant = 'ghost', ...props }) => {
  const InnerButton = () => (
    <>
      <EditIcon />
      <span className="sr-only">Edit</span>
    </>
  );
  return (
    <Button asChild={!!href} size={size} variant={variant} {...props}>
      {href ? (
        <Link href={href}>
          <InnerButton />
        </Link>
      ) : (
        <InnerButton />
      )}
    </Button>
  );
};
EditButton.displayName = 'EditButton';

export default EditButton;
