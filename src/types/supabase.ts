/*
  Appellation: supabase <module>
  Contrib: @FL03
*/

import { REALTIME_SUBSCRIBE_STATES, SupabaseClient } from "@supabase/supabase-js";

export type SupaSubscriptionCallback = (
  status: REALTIME_SUBSCRIBE_STATES,
  err?: Error
) => void;

export type SupaClient = SupabaseClient | Promise<SupabaseClient>;

export type ClientOptions = { ssr?: boolean };