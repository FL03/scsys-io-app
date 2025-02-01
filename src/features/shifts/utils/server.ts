/*
  Appellation: server <utils>
  Contrib: @FL03
*/
'use server';
// imports
import { logger } from '@/utils/logger';
import { createServerClient, getUsername } from '@/utils/supabase';

export const deleteTimesheet = async (id: string) => {
  logger.info('Deleting timesheet', { id });
  const supabase = await createServerClient();
  try {
    await supabase.from('shifts').delete({ count: 'exact' }).eq('id', id);
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
  return await supabase
    .from('shifts')
    .upsert(shift, { onConflict: 'id' })
    .eq('id', shift.id);
};


export const streamEmployeeShifts = async (assignee: string) => {
  const supabase = await createServerClient();
  const channel = supabase.channel(`shifts:assignee=eq.${assignee}`);
  channel.subscribe((status) => {
    // Wait for successful connection
    if (status !== 'SUBSCRIBED') {
      return null;
    }

    // Send a message once the client is subscribed
    channel.send({
      type: 'broadcast',
      event: 'test',
      payload: { message: 'hello, world' },
    });
  });
  return channel;
}