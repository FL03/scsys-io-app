/*
  Appellation: layout <module>
  Contrib: @FL03
*/
import * as React from 'react';
import { cn } from '@/utils';

export default function Layout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <div
      className={cn(
        'min-h-svh container mx-auto px-4 py-8',
        'flex flex-1 flex-col items-center justify-center'
      )}
    >
      {children}
    </div>
  );
};
Layout.displayName = 'AuthLayout';