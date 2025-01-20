/*
  Appellation: layout <(dashboard)>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import { DashboardScaffold } from '@/components/dashboard/scaffold';

export default function Layout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return <DashboardScaffold>{children}</DashboardScaffold>;
}
Layout.displayName = 'DashboardLayout';
