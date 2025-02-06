/*
  Appellation: client <utils>
  Contrib: @FL03
*/
'use client';
// imports
import { ChangeHandler, Nullish, SupaSubscriptionCallback } from '@/types';
import { logger, resolveOrigin } from '@/utils';
import { createBrowserClient } from '@/utils/supabase';
// feature-specific
import { Timesheet } from '../types';
import { adjustTimesheetDate } from './helpers';

export const fetchUsersTips = async (
  username?: string,
  init?: RequestInit
): Promise<Timesheet[]> => {
  const url = new URL('/api/shifts', resolveOrigin());
  if (username) url.searchParams.set('username', username);
  return await fetch(url, init).then((res) => res.json());
};

export const fetchTimesheet = async (
  username?: string | null,
  id?: string | null,
  init?: RequestInit
): Promise<Timesheet> => {
  const url = new URL(`/api/shifts`, resolveOrigin());
  if (username) url.searchParams.set('username', username);
  if (id) url.searchParams.set('id', id);
  return await fetch(url, init).then((res) => res.json());
};

export const streamShifts = (
  username: string,
  onChanges?: (payload: { [key: string]: any }) => void,
  onSubscribe?: SupaSubscriptionCallback
) => {
  const supabase = createBrowserClient();
  return supabase
    .channel(`shifts:${username}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'shifts',
        filter: 'assignee=eq.assignee',
      },
      (payload) => {
        onChanges?.(payload);
      }
    )
    .subscribe(onSubscribe);
};

type StreamTableChangesProps = {
  onInsert?: ChangeHandler<Nullish<Timesheet[]>>;
  onUpdate?: ChangeHandler<Nullish<Timesheet[]>>;
  onDelete?: ChangeHandler<Nullish<Timesheet[]>>;
  onSubscribe?: SupaSubscriptionCallback;
};

/**
 * Create a channel for listening to changes in the shifts table.
 * 
 * @param {string} username the username of the user 
 * @param {StreamTableChangesProps} options optional callbacks for handling changes 
 * @returns 
 */
export const onShiftsChange = (username: string, options?: StreamTableChangesProps) => {
  const supabase = createBrowserClient();
  // define the subscription
  return supabase
    .channel(`shifts:${username}`, { config: { private: true } })
    .on(
      'postgres_changes',
      {
        event: '*',
        filter: `assignee=eq.${username}`,
        schema: 'public',
        table: 'shifts',
      },
      (payload) => {
        logger.info('Processing changes to the shifts table');
        // make sure any new data is correctly formatted
        const newData = adjustTimesheetDate(payload.new as Timesheet);
        // handle any new shifts
        if (payload.eventType === 'INSERT') {
          logger.info('New shift detected');
          options?.onInsert?.((v) => (v ? [...v, newData] : [newData]));
        }
        // handle any updates made to a shift
        if (payload.eventType === 'UPDATE') {
          logger.info('Shift updated');
          options?.onUpdate?.((v) => {
            return v?.map((i) => (i.id === newData.id ? newData : i));
          });
        }
        // remove any deleted shifts from the store
        if (payload.eventType === 'DELETE') {
          logger.info('Shift deleted');
          options?.onDelete?.((v) => v?.filter(({ id }) => id !== newData.id));
        }
      }
    )
    .subscribe(options?.onSubscribe);
};
