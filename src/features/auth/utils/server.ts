/*
  Appellation: server <module>
  Contrib: @FL03
*/
'use server'
import { resolveOrigin } from "@/utils";
import { createServerClient } from "@/utils/supabase";

const handleAuth = async (provider: 'github' | 'google') => {
  const supabase = await createServerClient();
    const redirect_url = new URL('/auth/callback', resolveOrigin()).toString();
    return await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: redirect_url,
      },
    });
  };