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
import { ErrorBoundary } from '@/common/error';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
// feature-specific
import { ShiftCalendar, ShiftList, ShiftFormSheet } from '../widgets';
import { useSchedule } from '../provider';
import { averageTips, totalTips } from '../utils';

const ChartTabs: React.FC<React.ComponentProps<typeof Tabs>> = ({
  ...props
}) => {
  const [tab, setTab] = React.useState<string>('daily');
  const ByDayChart = dynamic(
    async () => await import('../widgets/charts/daily-averages'),
    { ssr: false }
  );
  const OverTimeChart = dynamic(
    async () => await import('../widgets/charts/tips-over-time'),
    { ssr: false }
  );
  return (
    <Tabs {...props} onValueChange={setTab} value={tab}>
      <TabsList defaultValue={'daily'}>
        <TabsTrigger value="daily">By Day</TabsTrigger>
        <TabsTrigger value="historical">Over Time</TabsTrigger>
      </TabsList>
      <TabsContent value="daily">
        <section>
          <DetailHeader
            description="The average amount of tips recieved by day"
            title="Tips by day"
          />
          <ByDayChart />
        </section>
      </TabsContent>
      <TabsContent value="historical">
        <section>
          <DetailHeader
            description="Visualize the tips recieved over time"
            title="Tips over time"
          />
          <OverTimeChart />
        </section>
      </TabsContent>
    </Tabs>
  );
};

export const ShiftDashboard: React.FC<
  React.ComponentProps<typeof Card> & {
    description?: React.ReactNode;
    title?: React.ReactNode;
  }
> = ({ className, description, title, ...props }) => {
  // hooks
  const isMobile = useIsMobile();
  // providers
  const { profile } = useProfile();
  const { shifts } = useSchedule();
  // dynamically import the tips by day chart
  const ByDayChart = dynamic(
    async () => await import('../widgets/charts/daily-averages'),
    { ssr: false }
  );
  // dynamically import the historical tips chart
  const LineChart = dynamic(
    async () => await import('../widgets/charts/tips-over-time'),
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
            <DetailHeader title={title} description={description} />
            <div className="ml-auto inline-flex flex-row flex-nowrap gap-2 items-center justify-end">
              <RefreshButton />
              {username && (
                <ShiftFormSheet
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
                  <ChartTabs />
                  {/* <div className="w-full flex flex-1 flex-col gap-2 lg:gap-4">
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
                  </div> */}
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
