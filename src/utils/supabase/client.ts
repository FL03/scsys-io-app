/*
  Appellation: client <module>
  Contrib: @FL03
*/
'use client';

export * from './helpers/auth/client';

import * as ssr from '@supabase/ssr';

export const createClient = () => {
  const sp_url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const sp_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!sp_url) {
    throw new Error('Missing Supabase URL');
  }
  if (!sp_key) {
    throw new Error('Missing Supabase Anon Key');
  }
  return ssr.createBrowserClient(sp_url, sp_key);
};

export default createClient;
