/*
  Appellation: client <utils>
  Contrib: @FL03
*/
'use client';
import { resolveOrigin } from '@/utils';
import { createBrowserClient } from '@/utils/supabase';
import { shiftsTable, Timesheet } from '../types';

export const fetchUsersTips = async (
  username?: string,
  init?: RequestInit
): Promise<Timesheet[]> => {
  const url = new URL('/api/shifts', resolveOrigin());
  if (username) url.searchParams.set('username', username);
  return await fetch(url, init).then((res) => res.json());
};

export const streamShifts = () => {
  const supabase = createBrowserClient();
  let shifts: Timesheet[] = [];
  const channel = supabase.channel('custom-filter-channel');
  channel
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: shiftsTable.schema,
        table: shiftsTable.name,
        filter: 'assignee=eq.id',
      },
      (payload) => {
        console.log('Change received!', payload);
        const newData = payload.new as Timesheet;
        if (payload.eventType === 'INSERT') {
          shifts.push(newData);
        }
        if (payload.eventType === 'UPDATE') {
          shifts = shifts
            .filter((shift) => shift.id === newData.id)
            .map((shift) => {
              return { ...shift, ...newData };
            });
        }
        if (payload.eventType === 'DELETE') {
          shifts = shifts.filter((shift) => shift.id !== newData.id);
        }
      }
    )
    .on(
      'broadcast',
      {
        event: 'select',
      },
      (payload) => {
        console.log('Broadcast received!', payload);
        shifts = payload.data as Timesheet[];
      }
    )
    .subscribe((status, err) => {
      if (err) {
        console.error('Error subscribing to changes', err);
      }
    });
};
