/*
  Appellation: layout <module>
  Contrib: @FL03
*/
'use client';
// imports
import { PropsWithChildren } from 'react';
import { useParams } from 'next/navigation';
// features
import { ScheduleProvider } from '@/features/shifts';
// components

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  const { alias } = useParams<{ alias: string }>();
  return (
      <ScheduleProvider username={alias}>
        {children}
      </ScheduleProvider>
  );
}
Layout.displayName = 'ProfileLayout';
