/*
  Appellation: server <utils>
  Contrib: @FL03
*/
'use server';
// imports
import { ChangeHandler, SupaSubscriptionCallback } from '@/types';
import { logger } from '@/utils/logger';
import { createServerClient, getUsername } from '@/utils/supabase';
import { Timesheet } from '../types';

export const getTimesheets = async () => {
  const supabase = await createServerClient();
  try {
    const { data } = await supabase.from('shifts').select();
    return data;
  } catch (error) {
    throw error;
  }
};
export const getTimesheet = async (id: string) => {
  logger.info('Getting timesheet with id: ', id);

  const supabase = await createServerClient();

  return await supabase.from('shifts').select().eq('id', id).single();
};

export const deleteTimesheet = async (id: string) => {
  const supabase = await createServerClient();
  try {
    await supabase.from('shifts').delete().eq('id', id);
  } catch (error) {
    throw error;
  } finally {
    return;
  }
};

export const upsertTimesheet = async (shift: any) => {
  // initialize the client
  const supabase = await createServerClient();
  // fetch the current user's username
  const username = await getUsername(supabase);

  if (!username) {
    throw new Error('Username not found');
  }
  // upsert the timesheet into the database
  try {
    return await supabase
      .from('shifts')
      .upsert(shift, { onConflict: 'id' })
      .eq('id', shift.id);
  } catch (error) {
    throw error;
  }
};

export const shiftsChannel = async (assignee: string) => {
  const supabase = await createServerClient();
  return supabase.channel(`shifts:${assignee}`);
}

export const onShiftsChange = async (
  username?: string,
  onChange?: ChangeHandler,
  onSubscribe?: SupaSubscriptionCallback
) => {
  if (!username) {
    throw new Error('Username not provided');
  }
  // initialize the channel
  const channel = await shiftsChannel(username);
  // define the subscription
  return channel
    .on(
      'postgres_changes',
      {
        event: '*',
        filter: 'assignee=eq.assignee',
        schema: 'public',
        table: 'shifts',
      },
      (payload) => {
        if (payload.new) onChange?.(payload.new);
        
      }
    )
    .subscribe(onSubscribe);
};
