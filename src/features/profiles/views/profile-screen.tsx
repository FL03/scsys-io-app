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

export const ProfileScreen: React.FC<TitledProps> = ({ ...props }) => {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  switch (view) {
    case 'details':
      const Details = dynamic(async () => await import('./profile-details'), {
        ssr: false,
      });
      return Details ? <Details /> : null;
    default:
      const Dashboard = dynamic(
        async () => await import('@/features/shifts/views/shift-dashboard'),
        {
          ssr: false,
        }
      );
      return Dashboard ? (
        <Dashboard
          description="The dashboard for user's to view and manage their shifts."
          title="Shifts"
        />
      ) : null;
  }
};
ProfileScreen.displayName = 'ProfileScreen';

export default ProfileScreen;
