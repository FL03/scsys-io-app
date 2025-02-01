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
  // dynamically import the tips by day chart
  const ByDayChart = dynamic(
    async () => await import('../widgets/charts/tips_by_day'),
    { ssr: false }
  );
  // dynamically import the historical tips chart
  const LineChart = dynamic(
    async () => await import('../widgets/charts/tips_over_time'),
    { ssr: false }
  );
  // get the username from the profile
  const username = profile?.username;
  // determine if the description should be shown
  const showDescription = !isMobile && description;
  return (
    <div className={cn('relative w-full ', className)} {...props}>
      <CardHeader className="relative flex flex-row flex-nowrap items-center gap-2 lg:gap-4">
        <div className="w-full">
          {title && <CardTitle>{title}</CardTitle>}
          {showDescription && <CardDescription>{description}</CardDescription>}
        </div>
        <div className="ml-auto inline-flex flex-row flex-nowrap gap-2 items-center justify-end">
          <RefreshButton />
          {username && (
            <TimesheetFormDialog
              values={{ assignee: username }}
              variant="ghost"
            />
          )}
        </div>
      </CardHeader>
      <section className="flex flex-grow flex-row flex-wrap md:flex-nowrap gap-2 lg:gap-4">
        <Card className='h-full w-full max-w-md'>
          <div className={cn('h-full w-full flex', 'lg:flex-col lg:h-full')}>
            <CardHeader className="w-full">
              <ShiftCalendar className="mx-auto" />
            </CardHeader>
            <CardContent className="w-full hidden md:block">
              <ShiftList descending className="w-full m-auto py-4" />
            </CardContent>
          </div>
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
