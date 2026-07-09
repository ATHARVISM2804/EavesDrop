import "server-only";

// Service-role Supabase client. Bypasses RLS — used ONLY by trusted server-side
// jobs (ingestion, scoring, Stripe webhooks). Never expose to the browser and
// never derive it from user input.

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { supabaseServiceRoleKey, supabaseUrl } from "./env";

export function createServiceClient() {
  return createSupabaseClient(supabaseUrl(), supabaseServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
