import { NextResponse } from "next/server";
import { getPrivyClient, extractBearerToken } from "@/lib/server/privy-server";
import { getSupabaseAdmin } from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/auth/me — verify a Privy access token and return the caller's
 * Google-backend profile (Privy canonical + Supabase row when configured).
 * Used by gated pages to confirm the session server-side.
 */
export async function GET(req: Request) {
  const privy = getPrivyClient();
  if (!privy) {
    return NextResponse.json(
      { ok: false, error: "Google login backend is not configured yet." },
      { status: 503 }
    );
  }

  const token = extractBearerToken(req);
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Missing Authorization: Bearer <privy-access-token>." },
      { status: 401 }
    );
  }

  let userId: string;
  try {
    const claims = await privy.verifyAuthToken(token);
    userId = claims.userId;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid or expired Privy token. Sign in again." },
      { status: 401 }
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: true, did: userId, record: null, dbPersisted: false });
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("privy_did", userId)
    .single();

  if (error) {
    return NextResponse.json({ ok: true, did: userId, record: null, dbPersisted: false });
  }
  return NextResponse.json({ ok: true, did: userId, record: data, dbPersisted: true });
}
