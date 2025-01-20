/*
  Appellation: profile <model>
  Contrib: FL03 <jo3mccain@icloud.com>
*/
import { createClient } from '@/utils/supabase/server';

import { Database } from '@/types';


export const profileTable = {
  name: 'profiles',
  schema: 'public',
  fetchById: async (id: string) => {
    const supabase = await createClient();
    return supabase.from("profiles").select('*').eq('id', id).single();
  },
  fetchByUsername: async (username: string): Promise<Profile | null> => {
    const supabase = await createClient();
    return supabase
      .from("profiles")
      .select('*')
      .eq('username', username)
      .single()
      .then(({ data }) => data);
  },
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];