/*
  Appellation: dashboard <timesheets>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import dynamic from 'next/dynamic';
// project
import { cn, formatAsCurrency } from '@/utils';
// components
import { RefreshButton } from '@/components/common/buttons';
import { DetailCard, StatCard } from '@/components/common/cards';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
// feature-specific
import { useEmployeeSchedule } from '../provider';
import { averageTips, totalTips } from '../utils';
import { ShiftCalendar, ShiftTable, TimesheetFormDialog, TipsByDayChart, TipsOverTimeChart } from '../widgets';

export const TimesheetDashboard: React.FC<
  React.ComponentProps<"div">
> = ({ className, ...props }) => {
  // dynamically import the table
  
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
          <div className="flex flex-1 flex-row flex-wrap items-center justify-center justify-items-center gap-2">
            <StatCard
              className="flex-1"
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

export const ShiftDashboard: React.FC<
  React.ComponentProps<typeof Card> & {
    description?: React.ReactNode;
    title?: React.ReactNode;
  }
> = ({ className, description, title, ...props }) => {
  const TableView = dynamic(
    async () => await import('../widgets/shift-table'),
    {
      ssr: false,
    }
  );
  return (
    <section
      className={cn('flex flex-1 flex-col w-full', className)}
      {...props}
    >
      <CardHeader className="flex flex-row flex-nowrap items-center gap-2 lg:gap-4">
        <div className="w-full">
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <div className="ml-auto inline-flex flex-row flex-nowrap items-center justify-end gap-2 lg:gap-4">
          <RefreshButton />
          <TimesheetFormDialog/>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col md:flex-row flex-nowrap items-start gap-2 lg:gap-4">
        {/* Profile Feed */}
        <div className="h-fit w-full md:h-full md:w-fit flex flex-row md:flex-col flex-wrap gap-2 lg:gap-4">
          <DetailCard
            className="h-full w-full"
            title="Calendar"
            description="View your schedule"
            breakpoint="md"
          >
            <ShiftCalendar className="mx-auto" />
          </DetailCard>
          <DetailCard
            className="hidden md:flex flex-1 flex-col min-w-sm w-full"
            title="Feed"
            breakpoint="md"
          ></DetailCard>
        </div>
        {/* Profile Details */}
        <Card className="h-full w-full flex flex-1 flex-col">
          <CardContent className="flex flex-1 flex-col gap-2 lg:gap-4">
            <div>
              <CardHeader>
                <CardTitle>Tips by day</CardTitle>
                <CardDescription>
                  Visualize your average tips recieved by day
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-2 lg:gap-4">
                <TipsOverTimeChart className="mx-auto" />
                <TipsByDayChart className="mx-auto" />
                {TableView && <TableView />}
              </CardContent>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </section>
  );
};
ShiftDashboard.displayName = 'ShiftDashboard';

export default ShiftDashboard;
