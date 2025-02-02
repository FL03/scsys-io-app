/*
  Appellation: timesheet_details <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as Lucide from 'lucide-react';
import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
// project
import { Timesheet, TimesheetForm } from '@/features/shifts';
import { useProfileUsername } from '@/hooks/use-profile';
import { Nullish } from '@/types';
import { cn, formatAsCurrency, resolveCrud } from '@/utils';
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
import { DetailSkeleton } from '@/common/skeletons';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Separator } from '@/ui/separator';
// feature-specific
import * as actions from '../utils';


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

export const TimesheetDetails: React.FC<
  React.ComponentProps<typeof Card> & {
    data?: Timesheet | null;
  }
> = ({ className, data, ...props }) => {
  // use the profile username hook
  const { username } = useProfileUsername();
  // create a reference to the router
  const router = useRouter();

  if (!data) return <span>There is nothing here</span>;

  const isAssigned = data.assignee === username;
  const { id, date, tips_cash: cash = 0, tips_credit: credit = 0 } = data;

  return (
    <Card
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
                try {
                  // delete the timesheet
                  await actions.deleteTimesheet(id);
                  // notify the user
                  toast.success('Timesheet deleted');
                  // go back to the previous page
                  router.back();
                } catch (error) {
                  // notify the user
                  toast.error('Failed to delete timesheet');
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
    </Card>
  );
};
TimesheetDetails.displayName = 'TimesheetDetails';

export const TimesheetDetailScreen: React.FC<{data?: Timesheet | null }> = ({ data, }) => {
  const pathname = usePathname();
  const params = useSearchParams();

  const action = params.get('action');
  const view = params.get('view');

  const [item, setItem] = React.useState<Nullish<Timesheet>>(null);

  const splitPath = pathname.split('/');

  const username = splitPath[1];
  const id = splitPath.pop();

  React.useEffect(() => {
    actions.fetchTimesheet(username, id).then((data) => {
      if (data) setItem(data[0]);
    });
  }, [id, username]);

  const showForm = view === 'form';

  return (
    <DetailSkeleton
      description="View and edit timesheet details"
      title="Timesheet"
    >
      {showForm && (
        <Card>
          <TimesheetForm
            className="m-auto px-4 py-2"
            mode={resolveCrud(action ?? 'read')}
            defaultValues={{
              ...item,
              date: item?.date ? new Date(item?.date) : undefined,
            }}
          />
        </Card>
      )}
      {!showForm && <TimesheetDetails data={item} />}
    </DetailSkeleton>
  );
};

export default TimesheetDetailScreen;
