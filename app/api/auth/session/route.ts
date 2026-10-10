import { NextResponse } from "next/server";
import { readSessionCookie, verifySession } from "@/lib/server/google-auth";
import { getSupabaseAdmin } from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/auth/session — who owns the Google session cookie?
 * 200 { ok:true, user, record } / 401 when missing, invalid or expired.
 */
export async function GET(req: Request) {
  const raw = readSessionCookie(req);
  if (!raw) {
    return NextResponse.json(
      { ok: false, error: "No Google session. Sign in with Google first." },
      { status: 401 }
    );
  }
  let claims;
  try {
    claims = verifySession(raw);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Session invalid or expired. Sign in again." },
      { status: 401 }
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({
      ok: true,
      user: { loginMethod: "google", sub: claims.sub, email: claims.email },
      record: null,
      dbPersisted: false,
    });
  }
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("google_sub", claims.sub)
    .single();
  return NextResponse.json({
    ok: true,
    user: { loginMethod: "google", sub: claims.sub, email: claims.email },
    record: data ?? null,
    dbPersisted: !!data,
  });
}
