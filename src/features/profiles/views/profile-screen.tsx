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
import { TitledProps } from '@/types';
// feature-specific
// import { ProfileDashboard } from './profile-dashboard';
// import { ProfileDetails } from './profile-details';

export const ProfileScreen: React.FC<TitledProps> = ({ ...props }) => {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  const Dashboard = dynamic(async () => await import('./profile-dashboard'), {
    ssr: false,
  });
  const Details = dynamic(async () => await import('./profile-details'), { ssr: false });
  switch (view) {
    case 'details':
      return <Details />;
    default:
      
      return <Dashboard/>;
  }
};
ProfileScreen.displayName = 'ProfileScreen';

export default ProfileScreen;
