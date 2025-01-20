/*
  Appellation: date-picker <common>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import * as Lucide from 'lucide-react';
import { OnSelectHandler } from 'react-day-picker';
import { Timestamptz } from '@/types';
import { cn, coerceTimestamptz, } from '@/utils';
// components
import { Button } from '@/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover';

import { Calendar } from './calendar';

type HandleSelectProps<T = Date> = {
  onDateSelect?: OnSelectHandler<T>;
  selected?: T | null;
};

// DatePicker
export const DatePickerPopover: React.FC<
  React.ComponentProps<typeof Button> & HandleSelectProps<Timestamptz>
> = (
  {
    className,
    onDateSelect,
    selected: selectedProp = new Date(),
    size = 'default',
    variant = 'outline',
    ...props
  }
) => {
  const [selected, setSelected] = React.useState<Date | undefined>(
    coerceTimestamptz(selectedProp)
  );

  const handleSelect: OnSelectHandler<Date> = (sel, ...args) => {
    setSelected(new Date(sel));
    onDateSelect?.(sel, ...args);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size={size}
          variant={variant}
          className={cn(
            'flex flex-row items-center justify-start space-x-2 lg:space-y-4',
            !selected && 'text-muted-foreground',
            className
          )}
          {...props}
        >
          <Lucide.CalendarIcon className="h-4 w-4" />
          {selected ? (
            `${new Date(selected)?.toLocaleDateString()}`
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col flex-shrink w-full">
        <Calendar
          required
          mode="single"
          selected={coerceTimestamptz(selected)}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
};
DatePickerPopover.displayName = 'DatePickerPopover';

export default DatePickerPopover;
