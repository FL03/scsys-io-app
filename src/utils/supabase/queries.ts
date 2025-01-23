/*
  Appellation: queries <module>
  Contrib: @FL03
*/
// imports
import { SupabaseClient } from '@supabase/supabase-js';
// feature-specific
import { createClient as createBrowserClient } from './client';
import { createClient as createServerClient } from './server';

type SupaClient = SupabaseClient | Promise<SupabaseClient>;
type ClientOptions = { ssr?: boolean };

export const resolveSupabaseClient = async (client?: SupaClient, options: ClientOptions = { ssr: true }) => {
  if (client) {
    if (client instanceof Promise) {
      return await client;
    } else {
      return client;
    }
  } else {
    if (options?.ssr) {
      return createServerClient();
    }
    return createBrowserClient();
  }
};

export const getUserId = async (client?: SupaClient, options?: ClientOptions) => {
  const supabase = await resolveSupabaseClient(client, options);
  return await supabase.rpc('user_profile_id').then(({ data }) => data );
};

export const getUsername = async (client?: SupaClient, options?: ClientOptions) => {
  const supabase = await resolveSupabaseClient(client, options);
  return await supabase.rpc('username').then(({ data }) => data);
};

export const currentUser = async (client?: SupaClient, options?: ClientOptions) => {
  const supabase = await resolveSupabaseClient(client, options);
  return supabase.auth
    .getUser()
    .catch((error) => {
      throw error;
    })
    .then(({ data }) => data.user);
};