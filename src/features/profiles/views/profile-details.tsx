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
import { DetailHeader } from '@/common/details';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { Separator } from '@/ui/separator';
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

  const { bio, username } = profile;

  return (
    <Card className="w-full flex flex-1 flex-col">
      <CardHeader>
        <div className="w-full inline-flex flex-row flex-nowrap items-center gap-2  ">
          <ProfileAvatar />
          <div className="flex flex-col flex-shrink gap-2 mr-auto w-full">
            <CardTitle className="text-lg">@{username}</CardTitle>
            {bio && <CardDescription>{bio}</CardDescription>}
          </div>
          {isOwner && (
            <ProfileSettingsButton
              href={{
                pathname: `/${username}/settings`,
                query: { tab: 'profile' },
              }}
            />
          )}
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="w-full flex flex-1 flex-col gap-2">
        <Card>
          <DetailHeader title="Count" description="" />
        </Card>
      </CardContent>
    </Card>
  );
};
ProfileDetails.displayName = 'ProfileDetails';

export default ProfileDetails;
