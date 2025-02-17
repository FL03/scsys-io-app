/*
  Appellation: timesheet_details <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as Lucide from 'lucide-react';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
// project
import { Timesheet } from '@/features/shifts';
import { useUsername } from '@/hooks/use-profile';
import { cn, formatAsCurrency, logger } from '@/utils';
// components
import { EditButton } from '@/common/buttons/edit-button';
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
import { Separator } from '@/ui/separator';
// feature-specific
import * as actions from '../utils';

const TipDisplay: React.FC<
  React.ComponentProps<typeof ListTile> & { label: string; value: number }
> = ({ label, value, ...props }) => {
  return (
    <ListTile {...props}>
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

export const ShiftSummary: React.FC<
  React.ComponentProps<typeof Card> & {
    data?: Timesheet | null;
  }
> = ({ className, data, ...props }) => {
  // use the hook to get a reference to the username
  const { username } = useUsername();
  // create a reference to the router
  const router = useRouter();

  if (!data) return null;
  // determine if the user is assigned to the timesheet
  const isAssigned = data.assignee === username;
  // deconstruct the data
  const { id, date, tips_cash: cash = 0, tips_credit: credit = 0 } = data;
  // render the shift details
  return (
    <section
      className={cn('w-full flex flex-1 flex-col m-auto', className)}
      {...props}
    >
      <CardHeader className="flex flex-row flex-nowrap items-center gap-2">
        <div className="inline-flex flex-col">
          <CardTitle className="font-semibold">
            {actions.adjustedDate(date).toLocaleDateString()}
          </CardTitle>
        </div>
        {isAssigned && (
          <div className="inline-flex flex-nowrap gap-2 items-center ml-auto">
            <EditButton
              href={{
                pathname: `/${username}/shifts/${id}`,
                query: { action: 'update', view: 'form' },
              }}
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={async () => {
                // delete the timesheet
                try {
                  await actions.deleteTimesheet(id);
                  // notify the user
                  toast.success('Timesheet deleted');
                  // go back to the previous page
                  router.back();
                } catch (error) {
                  // log the error
                  logger.error('Error deleting timesheet', error);
                  // notify the user
                  toast.error('Error deleting timesheet');
                } finally {
                  return;
                }
              }}
            >
              <Lucide.TrashIcon className="w-4 h-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )}
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col flex-1">
        <UList className="mt-2 flex flex-col flex-shrink gap-2 lg:gap-4 w-full">
          <TipDisplay label="Cash" value={cash} />
          <TipDisplay label="Credit" value={credit} />
          <TipDisplay label="Total tips" value={cash + credit} />
        </UList>
      </CardContent>
    </section>
  );
};
ShiftSummary.displayName = 'ShiftDetailCard';

export default ShiftSummary;
