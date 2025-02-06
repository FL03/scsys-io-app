/*
  Appellation: shift-calendar <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
// common
import { Nullish } from '@/types';
import { formatAsCurrency, logger } from '@/utils';
// components
import { Calendar } from '@/common/calendar';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from '@/ui/dialog';
// feature-specific
import { useSchedule } from '../provider';
import { Timesheet } from '../types';
import { deleteTimesheet } from '../utils';

export const ShiftCalendar: React.FC<React.ComponentProps<typeof Calendar>> = ({
  modifiers,
  modifiersClassNames,
  ...props
}) => {
  // use the router 
  const router = useRouter();
  // use the schedule provider
  const { shifts } = useSchedule();
  // declare an open state
  const [open, setOpen] = React.useState(false);
  // declare a selected state
  const [selected, setSelected] = React.useState<Nullish<Timesheet>>(null);
  // create a callback function handling day clicks 
  const handleOnDayCLick = (date: Date) => {
    const foundShift =
      shifts?.find(
        (shift) =>
          new Date(shift.date).toDateString() === new Date(date).toDateString()
      ) ?? null;

    if (foundShift) {
      setSelected(foundShift);
      setOpen(true);
      logger.debug('Shift found', foundShift);
    }
  };
  // create a callback function handling open changes
  const handleOnOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) setSelected(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild>
        <Calendar
          onDayClick={handleOnDayCLick}
          mode="single"
          modifiers={{
            shifts: shifts?.map((shift) => new Date(shift?.date)),
            ...modifiers,
          }}
          modifiersClassNames={{
            shifts:
              'bg-primary/20 border border-primary/20 focus:ring-primary/30',
            ...modifiersClassNames,
          }}
          timeZone="UTC"
          {...props}
        />
      </DialogTrigger>
      {selected && (
        <DialogContent
          className={'rounded-xl border-secondary/50 shadow-inner'}
        >
          <DialogHeader>
            <DialogTitle>
              {new Date(selected.date).toLocaleDateString()}
            </DialogTitle>
            <DialogDescription>View tips for this shift</DialogDescription>
          </DialogHeader>
          <section className="relative h-full w-full">
            <ul className="block gap-2 list-none">
              <li className="w-full inline-flex flex-row flex-nowrap gap-2 items-center">
                <span className="font-semibold">Cash:</span>
                <span>{formatAsCurrency(selected.tips_cash)}</span>
              </li>
              <li className="w-full inline-flex flex-row flex-nowrap gap-2 items-center">
                <span className="font-semibold">Credit:</span>
                <span>{formatAsCurrency(selected.tips_credit)}</span>
              </li>
              <li className="w-full inline-flex flex-row flex-nowrap gap-2 items-center">
                <span className="font-semibold">Total Tips:</span>
                <span>
                  {formatAsCurrency(selected.tips_cash + selected.tips_credit)}
                </span>
              </li>
            </ul>
          </section>
          <DialogFooter>
            <div className="inline-flex flex-row flex-nowrap gap-2 items-center">
              <Button
                size="icon"
                variant="destructive"
                onClick={async () => {
                  try {
                    await deleteTimesheet(selected.id);
                    toast.success('Shift deleted');
                    setOpen(false);
                    router.refresh();
                  } catch (error) {
                    logger.error('Error deleting shift', error);
                    toast.error('Error deleting shift!');
                  }
                }}
              >
                <Trash2Icon className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};
ShiftCalendar.displayName = 'ShiftCalendar';
