/*
  Appellation: dashboard <timesheets>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import dynamic from 'next/dynamic';
// project
import { cn } from '@/utils';
// components
import { RefreshButton } from '@/components/common/buttons';
import { DetailHeader } from '@/components/common/cards';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
// feature-specific
import { ShiftCalendar, TimesheetFormDialog, TipsByDayChart, TipsOverTimeChart } from '../widgets';

export const ShiftDashboard: React.FC<
  React.ComponentProps<typeof Card> & {
    description?: React.ReactNode;
    title?: React.ReactNode;
  }
> = ({ className, description, title, ...props }) => {
  const LineChart = dynamic(async () => await import('@/features/shifts/widgets/charts/tips_over_time'), { ssr: false });
  const ListView = dynamic(
    async () => await import('../widgets/shift-list'),
    {
      ssr: false,
    }
  );
  return (
    <section className={cn('w-full mx-auto', className)} {...props}>
      <CardHeader className="flex flex-row flex-nowrap items-center gap-2 lg:gap-4">
        <div className="w-full">
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <div className="ml-auto inline-flex flex-row flex-nowrap items-center justify-end gap-2 lg:gap-4">
          <RefreshButton />
          <TimesheetFormDialog />
        </div>
      </CardHeader>
      <CardContent className="w-full flex flex-1 flex-wrap gap-2 lg:gap-4">
        {/*  */}
        <Card className="w-full flex items-center">
          <CardHeader className="w-full md:max-w-md">
            <ShiftCalendar className="mx-auto md:ml-0" />
          </CardHeader>

          {ListView && (
            <CardContent className="m-auto w-full hidden md:block">
              <ListView />
            </CardContent>
          )}
        </Card>
        {/* Display */}
        <Card className="flex flex-1 items-center">
          <CardContent className="w-full py-2">
            <div className="w-full flex flex-1 flex-col gap-2 lg:gap-4">
              <section className="flex-1">
                <DetailHeader
                  description="The average amount of tips recieved by day"
                  title="Tips by day"
                />
                <CardContent>
                  <TipsByDayChart />
                </CardContent>
              </section>
              <section className="flex-1">
                <DetailHeader
                  description="The average amount of tips recieved by day"
                  title="Tips over time"
                />

                {LineChart && (
                  <CardContent>
                    <LineChart />
                  </CardContent>
                )}
              </section>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </section>
  );
};
ShiftDashboard.displayName = 'ShiftDashboard';

export default ShiftDashboard;
