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

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  const { alias } = useParams<{ alias: string }>();
  return (
    <ProfileProvider username={alias}>
      <DashboardScaffold>{children}</DashboardScaffold>
    </ProfileProvider>
  );
}
Layout.displayName = 'ProfileLayout';
