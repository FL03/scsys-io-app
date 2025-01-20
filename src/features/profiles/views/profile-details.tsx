/*
  Appellation: profile_details <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
// project
import { useSupaAuth } from '@/hooks/use-auth';
// components
import { Badge } from '@/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
// feature-specific
import { useProfile } from '../provider';
import { ProfileAvatar, ProfileSettingsButton } from '../widgets';

export const ProfileDetails: React.FC = () => {
  // hooks
  const { user } = useSupaAuth();
  // providers
  const { profile } = useProfile();

  const isOwner = user?.id === profile?.id;

  if (!profile) return null;

  const { bio, role, username } = profile;

  return (
    <Card className="flex flex-col flex-1 gap-2 lg:gap-4 w-full ">
      <CardHeader className="flex flex-row flex-nowrap items-center gap-2 border-b ">
        <ProfileAvatar value={profile} />
        <div className="flex flex-col flex-shrink gap-2 mr-auto w-full">
          <CardTitle>@{username}</CardTitle>
          <CardDescription>
            <Badge variant="secondary">{role}</Badge>
          </CardDescription>
        </div>
        {isOwner && <ProfileSettingsButton username={username} />}
      </CardHeader>
      <CardContent className="w-full flex flex-1 flex-col gap-2">
        {bio && <span>{bio}</span>}
      </CardContent>
    </Card>
  );
};
ProfileDetails.displayName = 'ProfileDetails';

export default ProfileDetails;
