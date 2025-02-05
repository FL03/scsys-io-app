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
import { Nullish } from '@/types';
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
      'rounded-none transition-colors min-w-8 max-w-16 flex-1',
      'aria-selected:bg-accent/80 aria-selected:text-accent-foreground/80'
    ),
    disabled: 'text-muted-foreground opacity-50',
    hidden: 'invisible',
    month: 'month',
    months: 'relative',
    month_caption: 'inline-flex items-center justify-start my-2',
    month_grid: 'month-grid w-full',
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

export const Calendar: React.FC<
  React.ComponentProps<typeof DayPicker> & { defaultMonth?: Date }
> = ({
  className,
  classNames,
  defaultMonth = new Date(),
  showOutsideDays = true,
  ...props
}) => {
  const [month, setMonth] = React.useState<Date | undefined>(defaultMonth);

  const CalendarFooter: React.FC<{ showToday?: boolean }> = ({
    showToday = true,
  }) => {
    return (
      <div className="w-full flex flex-row flex-nowrap items-center justify-end">
        {showToday && <TodayButton onMonthChange={setMonth} />}
        {month && (
          <div className="inline-flex flex-nowrap justify-end gap-2 items-center ">
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
      className={cn('relative block h-fit w-fit min-w-sm', className)}
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

type CalendarContext = SingleCalendarContext | MultiCalendarContext;

type SingleCalendarContext = {
  selected: Date;
  setSelected: React.Dispatch<React.SetStateAction<Date>>;
};

type MultiCalendarContext = {
  selected: Date[];
  setSelected: React.Dispatch<React.SetStateAction<Date[]>>;
};

const CalendarContext = React.createContext<Nullish<SingleCalendarContext>>(null);

export const useCalendar = () => {
  const context = React.useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};

export const CalendarProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => {
  // initialize the selected state
  const [_selected, _setSelected] = React.useState<Date>(new Date());

  const selected = _selected;
  const setSelected = React.useCallback(_setSelected, [_setSelected]);
  // memoize the context
  const ctx = React.useMemo(
    () => ({ selected, setSelected }),
    [selected, setSelected]
  );
  return (
    <CalendarContext.Provider value={ctx}>
      <div ref={ref} {...props} />
    </CalendarContext.Provider>
  );
});
CalendarProvider.displayName = 'CalendarProvider';

export default Calendar;
