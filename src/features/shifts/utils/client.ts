/*
  Appellation: client <utils>
  Contrib: @FL03
*/
'use client';
// imports
import { logger, resolveOrigin } from '@/utils';
import { createBrowserClient } from '@/utils/supabase';
// feature-specific
import { Timesheet } from '../types';

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


export const streamShifts = (username: string) => {
  const supabase = createBrowserClient();
  let shifts: Timesheet[] = [];
  const channel = supabase.channel(`shifts:${username}`);
  return channel
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'shifts',
        filter: 'assignee=eq.assignee',
      },
      (payload) => {
        logger.info('Change detected within the shifts table');
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
      if (status === 'SUBSCRIBED') {
        console.log('Successfully subscribed to changes');
      }
      if (err) {
        console.error('Error subscribing to changes', err);
      }
    });
};
