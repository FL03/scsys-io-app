/*
  Appellation: server <utils>
  Contrib: @FL03
*/
'use server';
// imports
import { cookies } from 'next/headers';
import { SupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';


export const createClient = async <T = any>() => {
  const jar = await cookies();

  return createServerClient<T>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return jar.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              jar.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};

export default createClient;
