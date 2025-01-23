/*
  Appellation: profile-dashboard <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
// project
import { ShiftCalendar, TipsByDayChart } from '@/features/shifts';
import { cn } from '@/utils';
// components
import { RefreshButton } from '@/common/buttons';
import { DetailCard, DetailHeader } from '@/common/cards';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';

export const ProfileDashboard: React.FC<
  React.ComponentProps<typeof Card> & {
    description?: React.ReactNode;
    title?: React.ReactNode;
  }
> = ({ className, description, title, ...props }) => {
  
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
          <Card></Card>
        </div>
        {/* Profile Details */}
        <Card className="h-full w-full flex flex-1 flex-col">
          <CardContent className="flex-1 gap-2 lg:gap-4">
            <div className="flex-1">
              <DetailHeader title="Tips by day" description="The average amount of tips recieved per day."/>
              <CardContent className="flex flex-1 flex-col gap-2 lg:gap-4">
                <TipsByDayChart className="mx-auto" />
              </CardContent>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </section>
  );
};
ProfileDashboard.displayName = 'ProfileDashboard';

export default ProfileDashboard;