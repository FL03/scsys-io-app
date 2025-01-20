/*
  Appellation: page <shifts>
  Contrib: @FL03
*/
import * as React from 'react';
import { EmployeeScheduleProvider, TimesheetDashboard } from '@/features/shifts';
import { NextMetaGenerator, PagePropsWithParams } from '@/types';


type PageProps = PagePropsWithParams<{ alias: string }>;

export default async function Page({ params }: PageProps) {
  const { alias } = await params;

  return (
    <EmployeeScheduleProvider username={alias}>
      <TimesheetDashboard/>
    </EmployeeScheduleProvider>
  );
}
Page.displayName = 'ShiftPage';

export const generateMetadata: NextMetaGenerator<PageProps> = async (
  { params },
  _parent
) => {
  const { alias: _username } = await params;
  return {
    title: 'Shifts',
    description: 'View and manage your shifts and tips.',
  };
};
