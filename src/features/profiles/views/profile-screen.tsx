/*
  Appellation: profile-dashboard <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
// project
import { TitledProps } from '@/types';
// feature-specific
import ProfileDashboard from './profile-dashboard';
import ProfileDetails from './profile-details';

export const ProfileScreen: React.FC<TitledProps> = ({ ...props }) => {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  switch (view) {
    case 'details':
      return <ProfileDetails />;
    default:
      return <ProfileDashboard />;
  }
};
ProfileScreen.displayName = 'ProfileScreen';

export default ProfileScreen;