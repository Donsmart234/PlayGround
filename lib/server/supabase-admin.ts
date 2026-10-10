import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getServerEnv } from "./env";

let cached: SupabaseClient | null = null;

/**
 * Admin Supabase client (service-role key, server-only).
 * Returns null when URL / service key are missing so routes can degrade
 * gracefully instead of throwing at import time.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const { supabaseUrl, supabaseServiceKey } = getServerEnv();
  if (!supabaseUrl || !supabaseServiceKey) return null;
  if (!cached) {
    cached = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });
  }
  return cached;
}
