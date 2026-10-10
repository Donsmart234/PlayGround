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

function pickGoogleEmail(accounts: LinkedAccount[] = []): string | null {
  const google = accounts.find(
    (a) => a.type === "google_oauth" || a.type === "google"
  );
  const email =
    google?.email ||
    google?.address_email ||
    accounts.find((a) => a.type === "email")?.address ||
    accounts.find((a) => a.type === "email")?.email ||
    null;
  return typeof email === "string" ? email : null;
}

function pickWallets(accounts: LinkedAccount[] = []) {
  const wallets = accounts.filter((a) => a.type === "wallet" && a.address);
  const embedded =
    wallets.find((w) => w.walletClientType === "privy")?.address ?? null;
  const external =
    wallets.find((w) => w.walletClientType !== "privy")?.address ?? null;
  return { embedded, external };
}

/**
 * POST /api/auth/google — Google login backend.
 *
 * Frontend (Privy Google OAuth) sends its access token:
 *   Authorization: Bearer <privy-access-token>
 *   Body (optional hints): { displayName, embeddedWallet, externalWallet }
 *
 * Backend verifies the token with Privy's API, pulls the canonical Google
 * email + wallets via getUser(), upserts public.users in Supabase, and
 * returns the profile + next route. Dashboard stays locked until an
 * external wallet is linked, so next is always /connect-wallet here.
 */
export async function POST(req: Request) {
  const privy = getPrivyClient();
  if (!privy) {
    const { missing } = getServerEnv();
    return NextResponse.json(
      {
        ok: false,
        error: "Google login backend is not configured yet.",
        missing,
        setup: [
          "1. dashboard.privy.io → your app → copy App ID → PRIVY_APP_ID",
          "2. Same dashboard → Login Methods → Socials → toggle Google ON",
          "3. Dashboard → Settings → Basics → copy App Secret → PRIVY_APP_SECRET",
          "4. Restart the dev server.",
        ],
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

  // 1. Verify — proves the user really completed Google OAuth for OUR app.
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

  // 2. Canonical profile from Privy (don't trust client-supplied email).
  let googleEmail: string | null = null;
  let serverEmbedded: string | null = null;
  let serverExternal: string | null = null;
  try {
    const privyUser = await privy.getUser(userId);
    const accounts = (privyUser?.linkedAccounts ?? []) as LinkedAccount[];
    googleEmail = pickGoogleEmail(accounts);
    const wallets = pickWallets(accounts);
    serverEmbedded = wallets.embedded;
    serverExternal = wallets.external;
  } catch {
    // Non-fatal: token is already verified, continue with client hints.
  }

  // 3. Client hints (wallet addresses the SDK already knows).
  let hint: { displayName?: string; embeddedWallet?: string; externalWallet?: string } = {};
  try {
    hint = await req.json();
  } catch {
    hint = {};
  }

  const profile = {
    did: userId,
    email: googleEmail,
    displayName:
      typeof hint.displayName === "string" && hint.displayName.trim()
        ? hint.displayName.trim().slice(0, 120)
        : googleEmail?.split("@")[0] ?? null,
    embeddedWallet:
      serverEmbedded ||
      (typeof hint.embeddedWallet === "string" ? hint.embeddedWallet : null),
    externalWallet:
      serverExternal ||
      (typeof hint.externalWallet === "string" ? hint.externalWallet : null),
  };

  // 4. Upsert into Supabase (graceful when DB isn't configured yet).
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({
      ok: true,
      user: profile,
      next: "/connect-wallet",
      dbPersisted: false,
      warning:
        "Verified with Privy, but Supabase isn't configured — set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY and run supabase/schema.sql to persist users.",
    });
  }

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
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
      user: profile,
      next: "/connect-wallet",
      dbPersisted: false,
      warning: `Verified with Privy, but Supabase upsert failed: ${error.message}. Did you run supabase/schema.sql?`,
    });
  }

  return NextResponse.json({
    ok: true,
    user: profile,
    record: data,
    next: "/connect-wallet",
    dbPersisted: true,
  });
}
