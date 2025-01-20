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

export default function Layout({
  children,
}: Readonly<PropsWithChildren>) {
  const { alias } = useParams<{ alias: string }>();
  return <ProfileProvider username={alias}>{children}</ProfileProvider>;
}
Layout.displayName = 'ProfileLayout';
