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
// components
import { DashboardScaffold } from '@/components/dashboard';
import { EmployeeScheduleProvider } from '@/features';

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  const { alias } = useParams<{ alias: string }>();
  return (
    <ProfileProvider username={alias}>
      <EmployeeScheduleProvider username={alias}>
        <DashboardScaffold>{children}</DashboardScaffold>
      </EmployeeScheduleProvider>
    </ProfileProvider>
  );
}
Layout.displayName = 'ProfileLayout';
