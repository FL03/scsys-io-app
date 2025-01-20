'use client';

import * as Lucide from 'lucide-react';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import { buttonVariants, Button } from '@/ui/button';
import { cn } from '@/utils';

import 'react-day-picker/style.css';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('border border-muted rounded-xl', className)}
      classNames={{
        caption_label: 'text-foreground font-semibold',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md'
        ),
        day: cn(
          'inline-flex items-center justify-center text-center',
          'text-md font-normal rounded-lg transition-colors',
          'aria-selected:opacity-100',
          'hover:bg-accent/50 hover:text-accent-foreground hover:opacity-80',
          'focus:opacity-100 focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50 focus:z-10'
        ),
        disabled: 'text-muted-foreground opacity-50',
        hidden: 'invisible',
        month: 'flex flex-col flex-1 w-full space-y-2 lg:space-y-4 ',
        months: 'relative m-auto p-4',
        month_caption: 'space-x-2 px-2',
        month_grid: 'mx-auto',
        nav: cn(
          'flex flex-row flex-nowrap flex-shrink gap-2 items-center justify-center',
          'absolute top-0 right-0 transform translate-y-1/3 -translate-x-1/2'
        ),
        outside:
          'day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
        range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        selected: cn(
          'bg-primary text-primary-foreground border border-primary',
          'hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground'
        ),
        today: 'border border-blue-500 rounded-2xl ',
        weekday: cn(
          'relative inline-flex items-center justify-start',
          'text-sm font-semibold text-muted-foreground'
        ),
        weekdays: 'flex flex-row flex-nowrap justify-around',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) => {
          if (orientation === 'left') {
            return <Lucide.ChevronLeftIcon {...props} />;
          }
          return <Lucide.ChevronRightIcon {...props} />;
        },
        DayButton: ({ className, ...props }) => {
          return <Button size="icon" variant="ghost" className={cn('hover:border hover:border-muted hover:rounded-lg hover:bg-opacity-90', className,)} {...props} />;
        },
        NextMonthButton: ({ className, ...props }) => {
          return (
            <Button size="icon" variant="ghost" className={cn('', className)} {...props}/>
          );
        },
        PreviousMonthButton: ({ className, ...props }) => {
          return (
            <Button size="icon" variant="ghost" className={cn('', className)} {...props}/>
          );
        },
        ...props.components,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
