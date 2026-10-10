import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import {
  verifyGoogleIdToken,
  signSession,
  buildSessionCookie,
} from "@/lib/server/google-auth";
import { getSupabaseAdmin } from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/auth/google — standalone Google login (NO Privy).
 *
 * Frontend (Google Identity Services button) sends:
 *   { "credential": "<Google ID token>" }
 *
 * Backend verifies the ID token with Google (signature + aud + iss + exp),
 * upserts public.users keyed by google_sub with login_method='google',
 * seals a session JWT into an httpOnly cookie, and returns the profile.
 * Google users hold NO wallet here — next is always /connect-wallet.
 */
export async function POST(req: Request) {
  let credential: string | null = null;
  try {
    const body = await req.json();
    credential =
      typeof body?.credential === "string" && body.credential.length > 0
        ? body.credential
        : null;
  } catch {
    credential = null;
  }
  if (!credential) {
    return NextResponse.json(
      { ok: false, error: "Missing Google credential. Sign in again." },
      { status: 400 }
    );
  }

  // 1. Verify with Google — the only source of truth for identity.
  let profile;
  try {
    profile = await verifyGoogleIdToken(credential);
  } catch (e) {
    const message =
      e instanceof Error && e.message.includes("GOOGLE_CLIENT_ID")
        ? "Google login is not configured yet. Set GOOGLE_CLIENT_ID (see .env.example: Google Cloud → APIs & Services → Credentials → OAuth client, Web type) and restart."
        : "Invalid or expired Google credential. Sign in again.";
    const status =
      e instanceof Error && e.message.includes("GOOGLE_CLIENT_ID") ? 503 : 401;
    return NextResponse.json({ ok: false, error: message }, { status });
  }

  // 2. Upsert into the SHARED users table (login_method='google').
  const supabase = getSupabaseAdmin();
  let record: unknown = null;
  let dbPersisted = false;
  let warning: string | undefined;
  if (!supabase) {
    warning =
      "Verified with Google, but Supabase isn't configured — set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY and run supabase/schema.sql to persist users.";
  } else {
    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          login_method: "google",
          google_sub: profile.sub,
          google_email: profile.email,
          email_verified: profile.emailVerified,
          display_name: profile.name ?? profile.email.split("@")[0],
          avatar_url: profile.picture,
        },
        { onConflict: "google_sub" }
      )
      .select()
      .single();
    if (error) {
      warning = `Verified with Google, but Supabase upsert failed: ${error.message}. Did you run supabase/schema.sql (shared-model migration)?`;
    } else {
      record = data;
      dbPersisted = true;
    }
  }

  // 3. Seal the session (top-security: HS256 JWT, httpOnly + Secure + SameSite=Lax).
  let cookie: string;
  try {
    const token = signSession({
      sub: profile.sub,
      email: profile.email,
      loginMethod: "google",
      sid: randomUUID(),
    });
    cookie = buildSessionCookie(token);
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          "SESSION_SECRET is missing or too short (min 32 random chars). Generate one with: openssl rand -base64 48",
      },
      { status: 503 }
    );
  }

  const res = NextResponse.json({
    ok: true,
    user: {
      loginMethod: "google",
      sub: profile.sub,
      email: profile.email,
      displayName: profile.name ?? profile.email.split("@")[0],
      avatarUrl: profile.picture,
    },
    record,
    next: "/connect-wallet",
    dbPersisted,
    ...(warning ? { warning } : {}),
  });
  res.headers.set("Set-Cookie", cookie);
  return res;
}
