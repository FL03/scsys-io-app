/*
  Appellation: timesheet_details <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as Lucide from 'lucide-react';
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
// project
import { Timesheet } from '@/features/shifts';
import { useProfileUsername } from '@/hooks/use-profile';
import { Url } from '@/types';
import { cn } from '@/utils';
import { formatAsCurrency, formatAsDateString } from '@/utils/fmt';
//components
import {
  UList,
  ListTile,
  TileBody,
  TileHeader,
  TileTitle,
  TileTrailing,
} from '@/common/list-view';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
// feature-specific
import * as actions from '../utils';

type DetailProps = {
  data?: Timesheet;
};

const TipDisplay: React.FC<
  React.HTMLAttributes<HTMLLIElement> & { label: string; value: number }
> = ({ className, label, value, ...props }) => {
  return (
    <ListTile className={cn('', className)} {...props}>
      <TileBody>
        <TileHeader>
          <TileTitle>{label}</TileTitle>
        </TileHeader>
      </TileBody>
      <TileTrailing>{formatAsCurrency(value)}</TileTrailing>
    </ListTile>
  );
};
TipDisplay.displayName = 'TipDisplay';

const EditButton: React.FC<
  React.HTMLAttributes<HTMLButtonElement> & { href: Url }
> = ({ className, href, ...props }) => {
  return (
    <Button
      asChild
      className={cn(
        'bg-purp/70 text-purp-foreground hover:bg-purp/20',
        className
      )}
      size="icon"
      variant="secondary"
      {...props}
    >
      <Link
        href={href}
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
  // use the profile username hook
  const { username } = useProfileUsername();
  // create a reference to the router
  const router = useRouter();
  
  if (!data) return null;

  const isAssigned = data.assignee === username;
  const { id, date, tips_cash: cash = 0, tips_credit: credit = 0 } = data;

  return (
    <Card
      className={cn('w-full flex flex-1 flex-col m-auto', className)}
      {...props}
    >
      <CardHeader className="flex flex-row flex-nowrap items-end justify-items-center justify-between space-x-2 border-b">
        <CardTitle className="text-xl font-semibold">
          {new Date(date).toISOString()}
        </CardTitle>
        {isAssigned && (
          <div>
            <EditButton
              href={{
                pathname: `/${username}/shifts/${id}`,
                query: { action: 'update', view: 'form' },
              }}
              className="ml-auto"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={async () => {
                // delete the timesheet
                await actions.deleteTimesheet(id);
                // notify the user
                toast.info('Timesheet deleted');
                // go back to the previous page
                router.back();
              }}
            >
              <Lucide.TrashIcon className="w-4 h-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <UList className="mt-2 flex flex-col flex-shrink gap-2 lg:gap-4 w-full">
          <TipDisplay label="Cash" value={cash} />
          <TipDisplay label="Credit" value={credit} />
          <TipDisplay label="Total tips" value={cash + credit} />
        </UList>
      </CardContent>
    </Card>
  );
};
TimesheetDetails.displayName = 'TimesheetDetails';

export default TimesheetDetails;
