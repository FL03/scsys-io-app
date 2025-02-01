/*
  Appellation: shift-calendar <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { addDays } from 'date-fns';
// components
import { Calendar } from '@/common/calendar';
// feature-specific
import { useEmployeeSchedule } from '../provider';

export const ShiftCalendar: React.FC<React.ComponentProps<typeof Calendar>> = ({
  modifiers,
  modifiersClassNames,
  ...props
}) => {
  const { shifts } = useEmployeeSchedule();

  const utcShifts = shifts?.map(({ date }) => {
    const localDate = addDays(new Date(date), 1);
    return new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getUTCDate()));
  }) ?? [];

  return (
    <Calendar
      timeZone="UTC"
      mode="multiple"
      modifiers={{
        shifts: utcShifts,
        ...modifiers,
      }}
      modifiersClassNames={{
        shifts: 'bg-primary/20 border border-primary/20 focus:ring-ring',
        ...modifiersClassNames,
      }}
      {...props}
    />
  );
};
ShiftCalendar.displayName = 'ShiftCalendar';
