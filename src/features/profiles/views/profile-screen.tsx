/*
  Appellation: profile-dashboard <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
// project
import { ProfileDashboard, ProfileDetails } from '@/features/profiles';
import { TitledProps } from '@/types';
// feature-specific

export const ProfileScreen: React.FC<TitledProps> = ({ ...props }) => {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  switch (view) {
    case 'details':
      return <ProfileDetails/>
    default:
      
      return <ProfileDashboard/>;
  }
};
ProfileScreen.displayName = 'ProfileScreen';

export default ProfileScreen;
