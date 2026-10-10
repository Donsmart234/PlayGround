/**
 * Server-only env reader. Never import this file from client components.
 * Returns values + a list of what's missing so routes can answer 503
 * with setup instructions instead of crashing.
 */
export function getServerEnv() {
  const privyAppId =
    process.env.PRIVY_APP_ID || process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";
  const privyAppSecret = process.env.PRIVY_APP_SECRET || "";
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  const missing: string[] = [];
  if (!privyAppId) missing.push("PRIVY_APP_ID (or NEXT_PUBLIC_PRIVY_APP_ID)");
  if (!privyAppSecret) missing.push("PRIVY_APP_SECRET");
  if (!supabaseUrl) missing.push("SUPABASE_URL");
  if (!supabaseServiceKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");

  return { privyAppId, privyAppSecret, supabaseUrl, supabaseServiceKey, missing };
}
