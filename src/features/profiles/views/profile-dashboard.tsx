/*
  Appellation: profile-dashboard <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
// project
import { cn } from '@/utils';
// components
import { RefreshButton } from '@/common/buttons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
// feature-specific
import { useProfile } from '../provider';

export const ProfileDashboard: React.FC<
  React.ComponentProps<typeof Card> & {
    description?: React.ReactNode;
    title?: React.ReactNode;
  }
> = ({ className, description = 'Your digital workspace', title = 'Profile', ...props }) => {
  const { profile } = useProfile();
  
  return (
    <section
      className={cn('h-full w-full', className)}
      {...props}
    >
      <div className="h-full flex flex-row flex-wrap lg:flex-nowrap gap-2 lg:gap-4">
        <Card className="hidden lg:block w-full h-fit min-w-sm lg:max-w-md lg:h-full">
          <CardHeader className="border-b">
            <CardTitle>Profile</CardTitle>
            {profile?.username && <CardDescription>@{profile.username}</CardDescription>}
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-2 lg:gap-4 pt-2">
            <Card>
              <CardHeader>
                <CardTitle>{new Date().toLocaleDateString()}</CardTitle>
              </CardHeader>
            </Card>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Workspace</CardTitle>
          </CardHeader>
          <CardContent className=""></CardContent>
        </Card>
      </div>
    </section>
  );
};
ProfileDashboard.displayName = 'ProfileDashboard';

export default ProfileDashboard;
