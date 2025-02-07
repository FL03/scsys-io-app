/*
  Appellation: server <utils>
  Contrib: @FL03
*/
'use server';
// imports
import { ClientOptions, SupaClient } from '@/types';
import { logger } from '@/utils/logger';
import { createServerClient, getUsername, resolveSupabaseClient } from '@/utils/supabase';

// use the supabase client to get all shifts
export const getTimesheets = async (client?: SupaClient, options?: ClientOptions) => {
  const supabase = await resolveSupabaseClient(client, options);
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

export const deleteTimesheet = async (id?: string | null) => {
  if (!id) {
    throw new Error('No ID provided');
  }
  const supabase = await createServerClient();
  const { error } = await supabase.from('shifts').delete().eq('id', id);
  if (error) {
    throw error;
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
  return await supabase
    .from('shifts')
    .upsert(shift, { onConflict: 'id' })
    .eq('id', shift.id)
    .eq('assignee', username);
};



