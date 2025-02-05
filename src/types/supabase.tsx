/*
  Appellation: supabase <module>
  Contrib: @FL03
*/

import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";

export type SupaSubscriptionCallback = (
  status: REALTIME_SUBSCRIBE_STATES,
  err?: Error
) => void;