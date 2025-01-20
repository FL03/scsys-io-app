/*
  Appellation: profile-dashboard <module>
  Contrib: @FL03
*/
'use client';
import * as React from 'react';
import { RefreshButton } from '@/common/buttons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { cn } from '@/utils';

import { ProfileProvider } from '../provider';
import { DetailCard } from '@/components';
import { TipsByDayChart } from '@/features/shifts';

type DashboardProps = {
  description?: React.ReactNode | null;
  title?: React.ReactNode | null;
};

export const ProfileDashboard: React.FC<
  React.ComponentProps<typeof Card> & DashboardProps
> = ({ className, description, title = 'Dashboard', ...props }) => {
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
        <div className="h-[25%] w-full md:h-full md:w-[15%] flex flex-row md:flex-col gap-2 lg:gap-4">
          <section className=" w-[35%] md:h-[25%] md:w-full ">
            <DetailCard title="Profile" breakpoint="md">
              Y
            </DetailCard>
          </section>
          <section className="flex flex-1 flex-col">
            <DetailCard title="Feed" breakpoint="md">
              Y
            </DetailCard>
          </section>
        </div>
        {/* Profile Details */}
        <Card className="h-full w-full flex flex-1 flex-col">
          <CardContent className="flex flex-1 flex-col gap-2 lg:gap-4">
            <div>
              <CardHeader>
                <CardTitle>Tips by day</CardTitle>
                <CardDescription>Visualize your average tips recieved by day</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-2 lg:gap-4">
                <div>
                  <TipsByDayChart />
                </div>
              </CardContent>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </section>
  );
};
ProfileDashboard.displayName = 'ProfileDashboard';

export const InjectedProfileDashboard: React.FC<
  React.ComponentProps<typeof ProfileDashboard>
> = ({ ...props }) => {
  return (
    <ProfileProvider>
      <ProfileDashboard {...props} />
    </ProfileProvider>
  );
};
InjectedProfileDashboard.displayName = 'InjectedProfileDashboard';