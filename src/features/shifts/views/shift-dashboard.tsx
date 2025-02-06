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
import { InfoCard } from '@/common/cards';
import { DetailHeader } from '@/common/details';
import { ErrorBoundary } from '@/common/error';
import { Button } from '@/ui/button';
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
      <Card className="h-full w-full relative flex flex-col">
        <TabsList
          defaultValue={'daily'}

          className="absolute bottom-0 right-0 left-0 max-w-sm mx-auto my-2"
        >
          <div className="flex flex-row flex-nowrap gap-2">
            <TabsTrigger value="daily" asChild>
              <Button size="sm" variant="ghost">
                By Day
              </Button>
            </TabsTrigger>
            <TabsTrigger asChild value="historical">
              <Button size="sm" variant="ghost">
                Over Time
              </Button>
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="daily">
          <CardContent className="w-full flex flex-col flex-1">
            <DetailHeader
              description="The average amount of tips recieved by day"
              title="Tips by day"
            />
            <ByDayChart />
          </CardContent>
        </TabsContent>
        <TabsContent value="historical">
          <CardContent>
            <DetailHeader
              description="Visualize the tips recieved over time"
              title="Tips over time"
            />
            <OverTimeChart />
          </CardContent>
        </TabsContent>
      </Card>
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

  // determine if the description should be shown
  const showDescription = !isMobile && description;
  return (
    <ErrorBoundary>
      <React.Suspense fallback={null}>
        <div className={cn('relative h-full w-full', className)} {...props}>
          <CardHeader className="relative flex flex-row flex-nowrap items-center gap-2 lg:gap-4">
            <div className="flex flex-col mr-auto">
              <CardTitle>{title}</CardTitle>
              {showDescription && (
                <CardDescription>{description}</CardDescription>
              )}
            </div>
            <div className="ml-auto inline-flex flex-row flex-nowrap gap-2 items-center justify-end">
              <RefreshButton />
              {profile && (
                <ShiftFormSheet
                  defaultValues={{ assignee: profile.username }}
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
                <section className="w-full flex flex-row justify-between flex-wrap gap-2 items-center">
                  <InfoCard
                    title="Average"
                    description="The average amount of tips recieved per shift."
                    className="max-w-md flex-auto"
                  >
                    <span className="mx-auto">
                      {formatAsCurrency(averageTips(shifts))}
                    </span>
                  </InfoCard>
                  {/* total tips */}
                  <InfoCard
                    title="Total"
                    description="The total amount of tips recieved throughout all shifts."
                    className="max-w-md flex-auto"
                  >
                    <span className="mx-auto">
                      {formatAsCurrency(totalTips(shifts))}
                    </span>
                  </InfoCard>
                  {/* Count */}
                  <InfoCard
                    title="Count"
                    description="The total number of shifts recorded."
                    className="max-w-md flex-auto"
                  >
                    <span className="mx-auto">{shifts.length}</span>
                  </InfoCard>
                </section>
              )}
              <ChartTabs className="h-full" />
            </div>
          </section>
        </div>
      </React.Suspense>
    </ErrorBoundary>
  );
};
ShiftDashboard.displayName = 'ShiftDashboard';

export default ShiftDashboard;
