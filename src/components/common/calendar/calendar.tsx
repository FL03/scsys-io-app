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
  MonthChangeEventHandler,
} from 'react-day-picker';
// project
import { cn } from '@/utils';
// components
import { buttonVariants, Button } from '@/components/ui/button';

import 'react-day-picker/style.css';

type CalendarClasses = Partial<ClassNames>;

const calendarClasses = ({ classNames }: { classNames?: CalendarClasses }) => {
  return {
    caption_label: 'font-semibold text-medium',
    day: cn(
      buttonVariants({ variant: 'ghost', size: 'icon' }),
      'rounded-none transition-colors',
      'aria-selected:bg-accent/80 aria-selected:text-accent-foreground/80'
    ),
    disabled: 'text-muted-foreground opacity-50',
    hidden: 'invisible',
    month: 'month',
    months: 'relative',
    month_caption: 'inline-flex items-center justify-start my-2',
    month_grid: 'month-grid',
    outside: cn(
      'day-outside text-muted-foreground',
      'aria-selected:bg-accent/50 aria-selected:text-muted-foreground'
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
      'bg-primary text-primary-foreground border-none rounded-none',
      'hover:bg-primary/80 hover:text-primary-foreground/80 hover:border-primary/80'
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

const TodayButton: React.FC<
  React.ComponentProps<typeof Button> & {
    onMonthChange?: MonthChangeEventHandler;
  }
> = ({
  className,
  onMonthChange,
  size = 'sm',
  variant = 'outline',
  ...props
}) => {
  return (
    <Button
      className={cn('absolute bottom-0 left-0', className)}
      size={size}
      variant={variant}
      onClick={() => onMonthChange?.(new Date())}
      {...props}
    >
      <Lucide.CalendarX2Icon />
      <span>Today</span>
    </Button>
  );
};

export const Calendar: React.FC<React.ComponentProps<typeof DayPicker>> = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) => {
  const [month, setMonth] = React.useState<Date | undefined>(new Date());

  const CalendarFooter: React.FC<{ showToday?: boolean }> = ({
    showToday = true,
  }) => {
    return (
      <div className="flex flex-row flex-nowrap items-center justify-end w-full">
        {showToday && <TodayButton onMonthChange={setMonth} />}
        {month && (
          <div className="inline-flex flex-row flex-nowrap gap-2 items-center ">
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
      className={cn('relative h-fit w-full', className)}
      classNames={calendarClasses({ classNames })}
      month={month}
      onMonthChange={setMonth}
      showOutsideDays={showOutsideDays}
      footer={<CalendarFooter showToday />}
      {...props}
    />
  );
};
Calendar.displayName = 'Calendar';

export default Calendar;
