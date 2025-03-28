/*
  Appellation: helpers <utils>
  Contrib: @FL03
*/
// imports
import { sumBy } from '@/utils';
// feature-specific
import { Timesheet } from '../types';

export const averageTips = (records: Timesheet[]) => {
  return totalTips(records) / records.length;
};

export const totalTips = (records: Timesheet[]) => {
  return sumBy(records, 'tips_cash') + sumBy(records, 'tips_credit');
};

export const adjustedDate = (date: Date | string | number) => {
  date = new Date(date);
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getUTCDate() + 1
    )
  );
}

export const adjustTimesheetDate = (value: Timesheet) => {
  return { ...value, date: adjustedDate(value.date).toISOString() };
};


export const displayDate = (value: string | Date) => {
  const date = new Date(value);
  return `${date.getMonth() + 1}/${date.getUTCDate()}/${date.getFullYear()}`;
}


export const shiftDateAsUTC = (values?: any[] | null) => {
    return values?.map((value) => {
      if (value.date) {
        return adjustedDate(value.date);
      };
    });
  };