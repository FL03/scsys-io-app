/*
  Appellation: profile-header <module>
  Contrib: @FL03
*/
'use client';
// globals
import * as React from 'react';
// project
import { cn } from '@/utils';
// components
import { Badge } from '@/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/ui/card';
// feature-specific
import { ProfileAvatar, ProfileSettingsButton } from './profile-card';
import { useProfile } from '../provider';

export const ProfileSidebarHeader: React.FC<
  React.ComponentProps<typeof Card>
> = ({ className, ...props }) => {
  const { profile } = useProfile();

  if (!profile) return null;

  const { role, username } = profile;
  return (
    <Card className={cn('w-full flex flex-col', className)} {...props}>
      <CardHeader className="flex flex-row flex-nowrap items-center justify-start gap-2">
        <ProfileAvatar value={profile} />
        <div className="flex flex-1 flex-col">
          <CardTitle>@{username}</CardTitle>
          <CardDescription>
            <Badge variant="secondary" className="w-fit">
              {role}
            </Badge>
          </CardDescription>
        </div>
        <div className="my-auto ml-auto">
          <ProfileSettingsButton username={username} />
        </div>
      </CardHeader>
    </Card>
  );
};
ProfileSidebarHeader.displayName = 'UserProfileHeader';
