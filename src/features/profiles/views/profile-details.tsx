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

  const { bio, email, display_name, username } = profile;

  return (
    <Card className="w-full flex flex-1 flex-col">
      <CardHeader className="border-b">
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
      <CardContent className="relative font-sans h-full w-full pt-2">
        <div className="flex flex-col flex-1 gap-2">
          <div className="inline-flex flex-row flex-nowrap gap-2">
            <span className="font-semibold">Name</span>
            <span>{display_name}</span>
          </div>
          {email && (
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Email</span>
              <ul className="inline-flex flex-col gap-2">
                {email.map((e, index) => (
                  <li key={index}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
ProfileDetails.displayName = 'ProfileDetails';

export default ProfileDetails;
