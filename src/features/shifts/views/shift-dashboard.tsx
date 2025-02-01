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
import { useIsMobile } from '@/hooks/use-mobile';
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
import { ShiftCalendar, ShiftList, TimesheetFormDialog } from '../widgets';

export const ShiftDashboard: React.FC<
  React.ComponentProps<typeof Card> & {
    description?: React.ReactNode;
    title?: React.ReactNode;
  }
> = ({ className, description, title, ...props }) => {
  // declare a reference to the profile provider
  const { profile } = useProfile();
  // use mobile hook
  const isMobile = useIsMobile();
  // dynamic imports
  const ByDayChart = dynamic(
    async () => await import('../widgets/charts/tips_by_day'),
    { ssr: false }
  );
  const LineChart = dynamic(
    async () => await import('../widgets/charts/tips_over_time'),
    { ssr: false }
  );
  const ListView = dynamic(async () => await import('../widgets/shift-list'), {
    ssr: false,
  });

  const username = profile?.username;

  const showDescription = !isMobile && description;
  return (
    <div className={cn('relative w-full', className)} {...props}>
      <CardHeader className="flex flex-row flex-nowrap items-center gap-2 lg:gap-4">
        <div className="w-full">
          {title && <CardTitle>{title}</CardTitle>}
          {showDescription && <CardDescription>{description}</CardDescription>}
        </div>
        <div className="ml-auto inline-flex flex-row flex-nowrap items-center justify-end gap-2 lg:gap-4">
          <RefreshButton />
          {username && (
            <TimesheetFormDialog
              title="Add a shift"
              values={{ assignee: username, date: new Date() }}
            />
          )}
        </div>
      </CardHeader>
      <section className="h-full flex flex-row flex-wrap lg:flex-nowrap gap-2 lg:gap-4">
        <Card
          className={cn('w-full flex lg:flex-col', 'lg:max-w-md lg:h-full')}
        >
          <CardHeader className="w-full">
            <ShiftCalendar className="mx-auto" />
          </CardHeader>
          <CardContent className="w-full hidden md:block">
            <ShiftList descending className="m-auto py-4" />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="w-full py-2">
            <div className="w-full flex flex-1 flex-col gap-2 lg:gap-4">
              <section className="flex-1">
                <DetailHeader
                  description="The average amount of tips recieved by day"
                  title="Tips by day"
                />
                {ByDayChart && (
                  <CardContent>
                    <ByDayChart />
                  </CardContent>
                )}
              </section>
              <section className="flex-1">
                <DetailHeader
                  description="Visualize the tips recieved over time"
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
      </section>
    </div>
  );
};
ShiftDashboard.displayName = 'ShiftDashboard';

export default ShiftDashboard;
