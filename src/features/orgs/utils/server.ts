/*
  Appellation: server <utils>
  Contrib: @FL03
*/
'use server';
import { createServerClient } from '@/utils/supabase';

export const getOrgs = async () => {
  const supabase = await createServerClient();

  return supabase.from('orgs').select();
}

export const getOrg = async (id: string) => {
  const supabase = await createServerClient();

  return supabase.from('orgs').select().eq('id', id);
}

export const deleteOrg = async (id: string) => {
  const supabase = await createServerClient();

  return supabase.from('orgs').delete().eq('id', id);
}

export const upsertOrg = async (id: string, data: any) => {
  const supabase = await createServerClient();

  return supabase
    .from('orgs')
    .upsert({ id, ...data }, { onConflict: 'id' })
    .eq('id', id);
};
