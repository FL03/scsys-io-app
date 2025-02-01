/*
  Appellation: timesheets <module>
  Contrib: @FL03
*/
import { Tables } from '@/types/database.types';
import { createServerClient } from '@/utils/supabase';

export const shiftsTable = {
  name: 'shifts',
  schema: 'public',
  from: async () => {
    const supabase = await createServerClient();
    return supabase.from(shiftsTable.name);
  },
  delete: async (id: string) => {
    const query = await shiftsTable.from();
    return query.delete().eq('id', id).single();
  },
  fetch: async (id: string) => {
    const query = await shiftsTable.from();
    return query.select().eq('id', id).single();
  },
  fetchAll: async () => {
    const query = await shiftsTable.from();
    return query.select().order('date', { ascending: true });
  },
  fetchAllByUser: async (assignee: string) => {
    const query = await shiftsTable.from();
    return query
      .select('*')
      .eq('assignee', assignee)
      .order('date', { ascending: true });
  },
};

export type ShiftStatus =
  | 'pending'
  | 'approved'
  | 'completed'
  | 'late'
  | 'no-show'
  | 'cancelled';

export type TimesheetMetadata = {
  [key: string]: any;
};

export type PayPeriod = Tables<"pay_periods">;
export type Timesheet = Tables<"shifts">;