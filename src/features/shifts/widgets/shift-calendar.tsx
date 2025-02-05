/*
  Appellation: shift-calendar <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
// common
import { Nullish } from '@/types';
import { formatAsCurrency, logger, } from '@/utils';
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
  const { shifts } = useSchedule();
  const [open, setOpen] = React.useState(false);
  const [selectedShift, setSelectedShift] =
    React.useState<Nullish<Timesheet>>(null);

  const handleOnDayCLick = (date: Date) => {
    const foundShift =
      shifts?.find(
        (shift) =>
          new Date(shift.date).toDateString() === new Date(date).toDateString()
      ) ?? null;

    if (foundShift) {
      setSelectedShift(foundShift);
      setOpen(true);
      logger.debug('Shift found', foundShift);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) setSelectedShift(null);
      }}
    >
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
      {selectedShift && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {new Date(selectedShift.date).toLocaleDateString()}
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <section className="relative h-full w-full">
            <ul className="block gap-2 list-none">
              <li className="w-full inline-flex flex-row flex-nowrap gap-2 items-center">
                <span className="font-semibold">Cash:</span>
                <span>{formatAsCurrency(selectedShift.tips_cash)}</span>
              </li>
              <li className="w-full inline-flex flex-row flex-nowrap gap-2 items-center">
                <span className="font-semibold">Credit:</span>
                <span>{formatAsCurrency(selectedShift.tips_credit)}</span>
              </li>
              <li className="w-full inline-flex flex-row flex-nowrap gap-2 items-center">
                <span className="font-semibold">Total Tips:</span>
                <span>{formatAsCurrency(selectedShift.tips_cash + selectedShift.tips_credit)}</span>
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
                    await deleteTimesheet(selectedShift.id);
                    toast.success('Shift deleted');
                  } catch (error) {
                    toast.error('Failed to delete shift');
                  } finally {
                    setOpen(false);
                    return;
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
