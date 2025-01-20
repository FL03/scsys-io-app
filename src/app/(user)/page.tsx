/*
  Appellation: page <home>
  Contrib: @FL03
*/

import * as React from 'react';
import dynamic from 'next/dynamic';
// project
import { EmployeeScheduleProvider } from '@/features/shifts';
import { ProfileProvider } from '@/features/profiles';

export default function Page() {
  const Dashboard = dynamic(
    async () => (await import('@/features/profiles')).ProfileDashboard,
    { ssr: true }
  );
  
  return (
    <ProfileProvider>
      <EmployeeScheduleProvider>
        {Dashboard && <Dashboard />}
      </EmployeeScheduleProvider>
    </ProfileProvider>
  );
}
Page.displayName = 'Dashboard';
