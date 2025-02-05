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
import { SupaSubscriptionCallback } from '@/types';

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


export const streamShifts = (username: string, onChanges?: (payload: { [key: string]: any}) => void, onSubscribe?: SupaSubscriptionCallback) => {
  const supabase = createBrowserClient();
  return supabase.channel(`shifts:${username}`)
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
