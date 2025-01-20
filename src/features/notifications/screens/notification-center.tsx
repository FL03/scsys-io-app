/*
  Appellation: notification-center <module>
  Contrib: @FL03
*/
'use client';
//imports
import * as React from 'react';
import { cn } from '@/utils';
import { useUserProfile } from '@/hooks/use-profile';
// components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';

export const NotificationCenter: React.FC<React.ComponentProps<'div'>> = ({
  children,
  className,
  ...props
}) => {
  const { profile } = useUserProfile();

  if (!profile) return null;

  return (
    <Card
      className={cn('w-ful flex flex-1 flex-col gap-2 lg:gap-4', className)}
      {...props}
    >
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Welcome back, {profile.username}!</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
NotificationCenter.displayName = 'NotificationCenter';

export default NotificationCenter;
