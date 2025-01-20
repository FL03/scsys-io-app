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
import { DetailCard } from '@/components/common/cards';
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
        {/* Profile Feed */}
        <Card className="w-full flex flex-col md:flex-row ">
          <CardHeader className="w-full max-w-sm">
            <ShiftCalendar className="mx-auto" />
          </CardHeader>
          <CardContent className="m-auto w-full">
            <ListView/>
          </CardContent>
        </Card>
        {/* Profile Details */}
        <section className="w-full flex flex-1 flex-col gap-2 lg:gap-4">
          <DetailCard
            description="The average amount of tips recieved by day"
            title="Tips by day"
          >
            <TipsByDayChart className="mx-auto" />
          </DetailCard>
          <DetailCard
            description="The average amount of tips recieved by day"
            title="Tips by day"
          >
            <LineChart className="mx-auto" />
          </DetailCard>
        </section>
      </CardContent>
    </section>
  );
};
ShiftDashboard.displayName = 'ShiftDashboard';

export default ShiftDashboard;
