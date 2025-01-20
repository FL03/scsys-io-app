/*
  Appellation: timesheet_details <module>
  Contrib: @FL03
*/
'use client';

import * as Lucide from 'lucide-react';
import * as React from 'react';

import Link from 'next/link';
import { useAuth, NotAuthorized } from '@/features/auth';
import { Timesheet } from '@/features/shifts';
import { formatAsCurrency, formatAsDateString } from '@/utils/fmt';
import { cn } from '@/utils';

import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { sitemap } from '@/config';

type DetailProps = {
  data?: Timesheet;
};

const TipDisplay: React.FC<
  React.HTMLAttributes<HTMLLIElement> & { label: string; value: number }
> = ({ className, label, value, ...props }) => {
  return (
    <li
      className={cn(
        'w-full text-foreground flex flex-row flex-nowrap items-center space-x-2 justify-between',
        className
      )}
      {...props}
    >
      <span className="font-semibold">{label}: </span>
      <span>{formatAsCurrency(value)}</span>
    </li>
  );
};
TipDisplay.displayName = 'TipDisplay';

const EditButton: React.FC<
  React.HTMLAttributes<HTMLButtonElement> & { id: string }
> = ({ className, id, ...props }) => {
  return (
    <Button
      asChild
      className={cn('btn btn-sm btn-primary', className)}
      size="icon"
      variant="secondary"
      {...props}
    >
      <Link
        href={{ pathname: sitemap.pages.shifts.route(id), query: { action: 'update' } }}
        className="flex flex-row flex-nowrap items-center justify-items-center space-x-2"
      >
        <Lucide.EditIcon className="w-4 h-4" />
        <span className="sr-only">Edit</span>
      </Link>
    </Button>
  );
};
EditButton.displayName = 'EditButton';

export const TimesheetDetails: React.FC<
  React.ComponentProps<typeof Card> & DetailProps
> = ({ className, data, ...props }) => {
  const { user } = useAuth();

  if (!data) return null;

  if (user?.id !== data.assignee) {
    return <NotAuthorized />;
  }

  const { id, date, tips_cash: cash = 0, tips_credit: credit = 0 } = data;

  return (
    <Card
      className={cn('flex flex-col flex-shrink w-full', className)}
      {...props}
    >
      <CardHeader className="flex flex-row flex-nowrap items-end justify-items-center justify-between space-x-2 border-b">
        <CardTitle className="text-xl font-semibold">
          {formatAsDateString(date)}
        </CardTitle>
        <EditButton id={id} className="ml-auto" />
      </CardHeader>
      <CardContent>
        <ul className="mt-2 flex flex-col flex-shrink gap-2 lg:gap-4 w-full">
          <TipDisplay label="Cash" value={cash} />
          <TipDisplay label="Credit" value={credit} />
          <TipDisplay label="Total tips" value={cash + credit} />
        </ul>
      </CardContent>
    </Card>
  );
};
TimesheetDetails.displayName = 'TimesheetDetails';

export default TimesheetDetails;
