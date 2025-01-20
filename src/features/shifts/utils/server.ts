/*
  Appellation: server <utils>
  Contrib: @FL03
*/
'use server';
import { createServerClient } from '@/utils/supabase';


const shiftChannels = {
  broadcast: 'shift-cast',
}

export const streamEmployeeShifts = async (assignee: string) => {
  const supabase = await createServerClient();
  const channel = supabase.channel(shiftChannels.broadcast);
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