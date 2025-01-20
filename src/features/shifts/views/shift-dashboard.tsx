/*
  Appellation: dashboard <timesheets>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import dynamic from 'next/dynamic';
// project
import { useProfile } from '@/features/profiles';
import { cn, formatAsCurrency } from '@/utils';
// components
import { StatCard } from '@/common/cards/stat-card';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
// feature-specific
import { EmployeeScheduleProvider, useEmployeeSchedule } from '../provider';
import { Timesheet } from '../types';
import { averageTips, fetchUsersTips, totalTips } from '../utils';
import { ShiftCalendar, ShiftTable, TipsOverTimeChart } from '../widgets';

export const TimesheetDashboard: React.FC<
  React.ComponentProps<"div">
> = ({ className, ...props }) => {
  // dynamically import the table
  const DynamicTable = dynamic(
    async () => await import('../widgets/shift-table'),
    {
      ssr: false,
    }
  );
  // dynamically import the chart
  const DynamicTipsOverTime = dynamic(
    async () => await import('../widgets/charts/tips_over_time'),
    {
      ssr: false,
    }
  );

  const { shifts } = useEmployeeSchedule();

  return (
    <div className={cn('w-full flex flex-col flex-1 container mx-auto', className)} {...props}>
      <CardHeader>
        <CardTitle>Shifts</CardTitle>
        <CardDescription>View and manage your shifts and tips.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-start gap-2 lg:gap-4">
        <div className="flex flex-row flex-1 flex-wrap items-center  gap-2 lg:gap-4">
          <div className="mx-auto">
            <ShiftCalendar />
          </div>
          <div className="flex flex-row flex-grow flex-nowrap items-center gap-2">
            <StatCard
              title="Average"
              description="Total average amount of tips recieved by the user per shift"
            >
              {formatAsCurrency(averageTips(shifts))}
            </StatCard>

            <StatCard
              title="Total Tips"
              description="Total amount of tips recieved by the user."
            >
              {formatAsCurrency(totalTips(shifts))}
            </StatCard>
          </div>
        </div>
        <section className="flex flex-1 flex-col">
          <CardHeader>
            <CardTitle>Tips Earned</CardTitle>
            <CardDescription>
              The total amount of tips earned by the user over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TipsOverTimeChart data={shifts}/>
          </CardContent>
        </section>
        {/* {DynamicTable && <DynamicTable />} */}
        <ShiftTable/>
      </CardContent>
    </div>
  );
};
TimesheetDashboard.displayName = 'TimesheetDashboard';

export default TimesheetDashboard;
