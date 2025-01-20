/*
  Appellation: helpers <utils>
  Contrib: @FL03
*/
import { sumBy } from '@/utils';

import { Timesheet } from '../types';

export const totalTips = (records: Timesheet[]) => {
  return sumBy(records, 'tips_cash') + sumBy(records, 'tips_credit');
};

export const averageTips = (records: Timesheet[]) => {
  return totalTips(records) / records.length;
};