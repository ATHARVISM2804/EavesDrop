"use client";

// Browser-side Supabase client. Uses the anon key; RLS enforces per-user access.
// Safe to import in Client Components ("use client").

import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./env";

export function createClient() {
  return createBrowserClient(supabaseUrl(), supabaseAnonKey());
}
