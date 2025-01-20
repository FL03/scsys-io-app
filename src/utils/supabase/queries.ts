/*
  Appellation: queries <module>
  Contrib: @FL03
*/
import { currentUser } from './helpers';
import { createClient } from './server';

export const resolveUsername = async (id?: string): Promise<string> => {
  const supabase = await createClient();

  const uid = id ?? await currentUser(supabase).then((user) => user?.id);

  if (!uid) {
    throw new Error('User ID not found');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', uid)
    .single();

  if (error) {
    throw error;
  }

  return data.username;
};
