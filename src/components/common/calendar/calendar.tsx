/*
  Appellation: calendar <common>
  Contrib: @FL03
*/
'use client';
// imports
import * as Lucide from 'lucide-react';
import * as React from 'react';
import {
  ClassNames,
  DayPicker,
  DeprecatedUI,
  MonthChangeEventHandler,
} from 'react-day-picker';
// project
import { cn } from '@/utils';
// components
import { buttonVariants, Button } from '@/components/ui/button';


import 'react-day-picker/style.css';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

type CalendarClasses = Partial<ClassNames>;

const calendarClasses = ({ classNames }: { classNames?: CalendarClasses }) => {
  return {
    caption_label: 'font-semibold text-medium',
    day: cn(
      buttonVariants({ variant: 'ghost', size: 'icon' }),
      'col-span-1 inline-flex flex-flex-row flex-1 items-center min-w-8 max-w-sm',
      'rounded-none transition-colors',
      'aria-selected:bg-accent/80 aria-selected:text-accent-foreground'
    ),
    disabled: 'text-muted-foreground opacity-50',
    hidden: 'invisible',
    month: 'gap-2',
    months: 'relative flex flex-col flex-1 w-full',
    month_caption: 'inline-flex items-center justify-start my-2',
    month_grid: 'month-grid',
    nav: cn(
      'inline-flex flex-row flex-nowrap gap-2 lg:gap-4 items-center justify-end w-full',
      'absolute top-0'
    ),
    outside: cn(
      'day-outside',
      'text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground'
    ),
    range_middle: cn(
      'aria-selected:bg-accent aria-selected:text-accent-foreground '
    ),
    selected: cn(
      'bg-accent/80 text-accent-foreground rounded-none',
      'hover:bg-primary/90 hover:text-primary-foreground hover:opacity-50',
      'focus:ring focus:ring-ring focus:outline-none focus:ring-inset'
    ),
    today: cn(
      'rounded-none text-white bg-purp',
      'hover:bg-purp/80'
    ),
    weekday: cn(
      'relative inline-flex items-center justify-start',
      'font-semibold text-pretty text-inherit'
    ),
    weekdays: cn(
      'flex flex-1 flex-row flex-nowrap items-center justify-around',
      'text-sm text-foreground'
    ),
    ...classNames,
  };
};

export const Calendar: React.FC<CalendarProps> = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) => {
  const [month, setMonth] = React.useState<Date | undefined>(new Date());

  const TodayButton: React.FC<{ onMonthChange?: MonthChangeEventHandler }> = ({
    onMonthChange,
  }) => {
    return (
      <Button
        className="bg-purp hover:bg-purp/80"
        size="sm"
        variant="outline"
        onClick={() => onMonthChange?.(new Date())}
      >
        <Lucide.CalendarX2Icon />
        <span>Today</span>
      </Button>
    );
  };

  const CalendarFooter: React.FC<{ showToday?: boolean }> = ({
    showToday = true,
  }) => {
    return (
      <div className="flex flex-row flex-nowrap gap-2 items-center justify-between p-2">
        {showToday && <TodayButton onMonthChange={setMonth} />}
        {month && (
          <div className="inline-flex flex-row flex-nowrap gap-2 items-center ml-auto">
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() - 1))
              }
            >
              <Lucide.ChevronLeftIcon />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() + 1))
              }
            >
              <Lucide.ChevronRightIcon />
            </Button>
          </div>
        )}
      </div>
    );
  };
  return (
    <DayPicker
      hideNavigation
      className={cn('block w-fit', className)}
      classNames={calendarClasses({ classNames })}
      month={month}
      onMonthChange={setMonth}
      showOutsideDays={showOutsideDays}
      footer={<CalendarFooter />}
      {...props}
    />
  );
};
Calendar.displayName = 'Calendar';

export default Calendar;
