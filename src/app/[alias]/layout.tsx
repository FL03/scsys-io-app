/*
  Appellation: layout <module>
  Contrib: @FL03
*/
'use client';
// imports
import { PropsWithChildren } from 'react';
import { useParams } from 'next/navigation';
// features
import { ProfileProvider } from '@/features/profiles';
import { ScheduleProvider } from '@/features/shifts';
// components
import { DashboardScaffold } from '@/components/dashboard';

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  const { alias } = useParams<{ alias: string }>();
  return (
    <ProfileProvider username={alias}>
      <ScheduleProvider username={alias}>
        <DashboardScaffold>{children}</DashboardScaffold>
      </ScheduleProvider>
    </ProfileProvider>
  );
}
Layout.displayName = 'ProfileLayout';
