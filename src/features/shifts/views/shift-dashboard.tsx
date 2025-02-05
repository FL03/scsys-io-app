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
import { cn, formatAsCurrency } from '@/utils';
// components
import { RefreshButton } from '@/common/buttons';
import { DetailHeader } from '@/common/details';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
// feature-specific
import { ShiftCalendar, ShiftList, TimesheetFormDialog } from '../widgets';
import { useSchedule } from '../provider';
import { averageTips, totalTips } from '../utils';
import { useShifts } from '@/hooks/use-shifts';
import { useUsername } from '@/hooks/use-profile';

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export const ShiftDashboard: React.FC<
  React.ComponentProps<typeof Card> & {
    description?: React.ReactNode;
    title?: React.ReactNode;
  }
> = ({ className, description, title, ...props }) => {
  // initialize the profile provider
  const { profile } = useProfile();
  // get the shifts
  const { shifts } = useShifts(profile?.username);

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
  const username = profile?.username;
  // determine if the description should be shown
  const showDescription = !isMobile && description;
  return (
    <ErrorBoundary>
      <React.Suspense fallback={null}>
        <div className={cn('relative h-full w-full', className)} {...props}>
          <CardHeader className="relative flex flex-row flex-nowrap items-center gap-2 lg:gap-4">
            <div className="w-full">
              {title && <CardTitle>{title}</CardTitle>}
              {showDescription && (
                <CardDescription>{description}</CardDescription>
              )}
            </div>
            <div className="ml-auto inline-flex flex-row flex-nowrap gap-2 items-center justify-end">
              <RefreshButton />
              {username && (
                <TimesheetFormDialog
                  defaultValues={{ assignee: username }}
                  variant="ghost"
                />
              )}
            </div>
          </CardHeader>
          <section className="flex flex-1 flex-row flex-wrap lg:flex-nowrap gap-2 lg:gap-4">
            <Card className="w-full flex flex-col flex-shrink-0 max-h-screen min-w-sm lg:max-w-md">
              <div className="h-full w-full flex lg:flex-col lg:h-full">
                <CardHeader className="w-full">
                  <ShiftCalendar className="mx-auto" />
                </CardHeader>
                <CardContent className="w-full hidden md:block">
                  <ShiftList descending className="w-full m-auto py-4" />
                </CardContent>
              </div>
            </Card>
            <div className="w-full flex flex-col flex-1 gap-2">
              {shifts && (
                <section className="flex flex-row flex-wrap gap-2 lg:gap-4 items-center">
                  <Card className="max-w-md w-full md:flex-1">
                    <DetailHeader
                      title="Average"
                      description="The average amount of tips recieved per shift."
                    />
                    <CardContent className="w-full flex items-center">
                      <span className="mx-auto">
                        {formatAsCurrency(averageTips(shifts))}
                      </span>
                    </CardContent>
                  </Card>
                  <Card className="max-w-md w-full md:flex-1">
                    <DetailHeader
                      title="Count"
                      description="The total number of shifts recorded in the system."
                    />
                    <CardContent className="w-full flex">
                      <span className="mx-auto">{shifts.length}</span>
                    </CardContent>
                  </Card>
                  <Card className="max-w-md w-full md:flex-1">
                    <DetailHeader
                      title="Total"
                      description="The total amount of tips recieved."
                    />
                    <CardContent className="w-full flex">
                      <span className="mx-auto">
                        {formatAsCurrency(totalTips(shifts))}
                      </span>
                    </CardContent>
                  </Card>
                </section>
              )}
              <Card className="w-full">
                <CardContent className="w-full py-2">
                  <div className="w-full flex flex-1 flex-col gap-2 lg:gap-4">
                    <section className="flex-1">
                      <DetailHeader
                        description="The average amount of tips recieved by day"
                        title="Tips by day"
                      />
                      {ByDayChart && <ByDayChart />}
                    </section>
                    <section className="flex-1">
                      <DetailHeader
                        description="Visualize the tips recieved over time"
                        title="Tips over time"
                      />
                      {LineChart && <LineChart />}
                    </section>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </React.Suspense>
    </ErrorBoundary>
  );
};
ShiftDashboard.displayName = 'ShiftDashboard';

export default ShiftDashboard;
