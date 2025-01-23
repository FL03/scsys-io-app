/*
  Appellation: queries <module>
  Contrib: @FL03
*/
import React from 'react';
// imports
import { SupabaseClient } from '@supabase/supabase-js';
// feature-specific
import { createClient } from './server';

type SupaClient = SupabaseClient | Promise<SupabaseClient>;
type ClientOptions = { ssr?: boolean };

export const resolveSupabaseClient = async (client?: SupaClient, options?: ClientOptions) => {
  if (client) {
    if (client instanceof Promise) {
      return await client;
    } else {
      return client;
    }
  } else {
    return await createClient();
  }
};

export const getUserId = async (client?: SupaClient) => {
  const supabase = await resolveSupabaseClient(client);
  return await supabase.rpc('user_profile_id').then(({ data }) => data );
};

export const getUsername = async (client?: SupaClient) => {
  const supabase = await resolveSupabaseClient(client);
  return await supabase.rpc('username').then(({ data }) => data);
};

export const currentUser = async (client?: SupaClient) => {
  const supabase = await resolveSupabaseClient(client);
  return supabase.auth
    .getUser()
    .catch((error) => {
      throw error;
    })
    .then(({ data }) => data.user);
};