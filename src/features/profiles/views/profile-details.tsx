/*
  Appellation: profile_details <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
// project
import { useAuth } from '@/features/auth';
import { TipsByDayChart } from '@/features/shifts';
// import { useSupaAuth } from '@/hooks/use-auth';
// components
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
  const { user } = useAuth();
  // providers
  const { profile } = useProfile();

  const isOwner = user?.id === profile?.id;

  if (!profile) return null;

  const { bio, username } = profile;

  return (
    <Card className="w-full flex flex-1 flex-col">
      <CardHeader className="flex flex-row flex-nowrap items-center gap-2 border-b ">
        <ProfileAvatar value={profile} />
        <div className="flex flex-col flex-shrink gap-2 mr-auto w-full">
          <CardTitle>@{username}</CardTitle>
          {bio && <CardDescription> bio </CardDescription>}
        </div>
        {isOwner && <ProfileSettingsButton username={username} />}
      </CardHeader>
      <CardContent className="w-full flex flex-1 flex-col gap-2">
        <section>
          
        </section>
      </CardContent>
    </Card>
  );
};
ProfileDetails.displayName = 'ProfileDetails';

export default ProfileDetails;
