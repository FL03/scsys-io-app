/*
  Appellation: admin-dashboard <views>
  Contrib: @FL03
*/
'use client';
// globals
import * as React from 'react';
// project
import { cn } from '@/utils';

export const AdminDashboard: React.FC<React.ComponentProps<'div'>> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn('h-full w-full flex flex-1 flex-col gap-2 lg:gap-4', className)} {...props}>
      Admin
    </div>
  );
};
AdminDashboard.displayName = 'AdminDashboard';

export default AdminDashboard;
