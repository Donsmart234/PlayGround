"use client";

export type BackendSyncHints = {
  displayName?: string;
  embeddedWallet?: string | null;
  externalWallet?: string | null;
};

type LinkedAccountLike = {
  type?: string;
  address?: string;
  walletClientType?: string;
  email?: string;
  name?: string;
};

/** Pull wallet hints out of a Privy user object (shape varies — be defensive). */
export function extractWalletHints(user: unknown): BackendSyncHints {
  try {
    const linked = (user as { linkedAccounts?: LinkedAccountLike[] })
      ?.linkedAccounts;
    if (!Array.isArray(linked)) return {};
    const wallets = linked.filter(
      (a) => a?.type === "wallet" && typeof a.address === "string"
    );
    const embedded =
      wallets.find((w) => w.walletClientType === "privy")?.address ?? null;
    const external =
      wallets.find((w) => w.walletClientType !== "privy")?.address ?? null;
    const google = linked.find(
      (a) => a?.type === "google_oauth" || a?.type === "google"
    );
    const displayName =
      (typeof google?.name === "string" && google.name) || undefined;
    return { displayName, embeddedWallet: embedded, externalWallet: external };
  } catch {
    return {};
  }
}

/**
 * POST the Privy access token to the PRIVY backend (/api/auth/privy) so it
 * can verify + upsert the user row with login_method='privy'.
 * Google login never touches this — it uses POST /api/auth/google instead.
 * Never blocks navigation: failures only warn, caller still routes onward.
 */
export async function syncGoogleLoginToBackend(
  accessToken: string | null,
  hints: BackendSyncHints = {}
): Promise<{ ok: boolean; next: string }> {
  if (!accessToken) {
    console.warn("[auth-sync] No Privy access token — skipping backend sync.");
    return { ok: false, next: "/connect-wallet" };
  }
  try {
    const res = await fetch("/api/auth/privy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(hints),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) {
      console.warn("[auth-sync] Backend sync failed:", data?.error ?? res.status);
      return { ok: false, next: data?.next ?? "/connect-wallet" };
    }
    if (data.warning) console.warn("[auth-sync]", data.warning);
    return { ok: true, next: data.next ?? "/connect-wallet" };
  } catch (e) {
    console.warn("[auth-sync] Network error:", e);
    return { ok: false, next: "/connect-wallet" };
  }
}
