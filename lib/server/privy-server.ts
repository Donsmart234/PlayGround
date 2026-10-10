import { PrivyClient } from "@privy-io/server-auth";
import { getServerEnv } from "./env";

let cached: PrivyClient | null = null;

/** Lazy Privy server client. Returns null when App ID / secret are missing. */
export function getPrivyClient(): PrivyClient | null {
  const { privyAppId, privyAppSecret } = getServerEnv();
  if (!privyAppId || !privyAppSecret) return null;
  if (!cached) {
    cached = new PrivyClient(privyAppId, privyAppSecret);
  }
  return cached;
}

export function extractBearerToken(req: Request): string | null {
  const header =
    req.headers.get("authorization") || req.headers.get("Authorization");
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}
