import { NextResponse } from "next/server";
import { getPrivyClient, extractBearerToken } from "@/lib/server/privy-server";
import { getSupabaseAdmin } from "@/lib/server/supabase-admin";
import { getServerEnv } from "@/lib/server/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LinkedAccount = {
  type?: string;
  address?: string;
  walletClientType?: string;
  email?: string;
  address_email?: string;
  name?: string;
};

function pickEmail(accounts: LinkedAccount[] = []): string | null {
  const email =
    accounts.find((a) => a.type === "email")?.address ||
    accounts.find((a) => a.type === "email")?.email ||
    null;
  return typeof email === "string" ? email : null;
}

function pickWallets(accounts: LinkedAccount[] = []) {
  const wallets = accounts.filter((a) => a.type === "wallet" && a.address);
  return {
    embedded: wallets.find((w) => w.walletClientType === "privy")?.address ?? null,
    external: wallets.find((w) => w.walletClientType !== "privy")?.address ?? null,
  };
}

/**
 * POST /api/auth/privy — Privy login backend (separate from Google).
 * Verifies the Privy access token, upserts public.users with
 * login_method='privy' keyed by privy_did. Google users never touch this.
 */
export async function POST(req: Request) {
  const privy = getPrivyClient();
  if (!privy) {
    const { missing } = getServerEnv();
    return NextResponse.json(
      {
        ok: false,
        error: "Privy backend is not configured yet.",
        missing,
        next: "/connect-wallet",
      },
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
    userId = (await privy.verifyAuthToken(token)).userId;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid or expired Privy token. Sign in again." },
      { status: 401 }
    );
  }

  let email: string | null = null;
  let embedded: string | null = null;
  let external: string | null = null;
  try {
    const u = await privy.getUser(userId);
    const accounts = (u?.linkedAccounts ?? []) as LinkedAccount[];
    email = pickEmail(accounts);
    const w = pickWallets(accounts);
    embedded = w.embedded;
    external = w.external;
  } catch {
    /* verified token is enough — hints fill the rest */
  }

  let hint: { displayName?: string; embeddedWallet?: string; externalWallet?: string } = {};
  try {
    hint = await req.json();
  } catch {
    hint = {};
  }

  const profile = {
    did: userId,
    email,
    displayName:
      typeof hint.displayName === "string" && hint.displayName.trim()
        ? hint.displayName.trim().slice(0, 120)
        : email?.split("@")[0] ?? null,
    embeddedWallet: embedded || hint.embeddedWallet || null,
    externalWallet: external || hint.externalWallet || null,
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({
      ok: true,
      user: { ...profile, loginMethod: "privy" },
      next: "/connect-wallet",
      dbPersisted: false,
    });
  }
  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        login_method: "privy",
        privy_did: profile.did,
        google_email: profile.email,
        display_name: profile.displayName,
        embedded_wallet: profile.embeddedWallet,
        external_wallet: profile.externalWallet,
      },
      { onConflict: "privy_did" }
    )
    .select()
    .single();
  if (error) {
    return NextResponse.json({
      ok: true,
      user: { ...profile, loginMethod: "privy" },
      next: "/connect-wallet",
      dbPersisted: false,
      warning: `Privy verified, DB upsert failed: ${error.message}. Ran supabase/schema.sql?`,
    });
  }
  return NextResponse.json({
    ok: true,
    user: { ...profile, loginMethod: "privy" },
    record: data,
    next: "/connect-wallet",
    dbPersisted: true,
  });
}
