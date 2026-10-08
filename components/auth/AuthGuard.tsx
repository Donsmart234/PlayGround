"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import LoadingState from "@/components/ui/LoadingState";

/**
 * Route gate (wired up in Phase 3 with the /connect-wallet gate).
 * - Not logged in        → back to landing (/)
 * - Logged in, no wallet → /connect-wallet (dashboard locked)
 * - Logged in + wallet   → render children
 *
 * Rendered on authed routes only. Landing page never uses this.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();

  const hasExternalWallet = Boolean(
    user?.linkedAccounts?.some(
      (a: { type: string }) =>
        a.type === "wallet" && (a as { walletClientType?: string }).walletClientType !== "privy"
    )
  );

  useEffect(() => {
    if (!ready) return;
    if (!authenticated) router.replace("/");
    else if (!hasExternalWallet) router.replace("/connect-wallet");
  }, [ready, authenticated, hasExternalWallet, router]);

  if (!ready) return <LoadingState label="Connecting…" />;
  if (!authenticated || !hasExternalWallet) {
    return <LoadingState label="Redirecting…" />;
  }
  return <>{children}</>;
}
