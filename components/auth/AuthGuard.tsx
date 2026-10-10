"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import LoadingState from "@/components/ui/LoadingState";
import { useGoogleAuth } from "@/lib/google-auth";
import { hasPrivyAppId } from "@/lib/privy-safe";

/**
 * Route gate — accepts EITHER auth path:
 * - Google (standalone GIS session) + wagmi wallet → children
 * - Privy (email/SMS modal) + linked external wallet → children
 * - Logged in but no wallet → /connect-wallet (dashboard locked)
 * - Not logged in → back to landing (/)
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status, user } = useGoogleAuth();

  if (status === "loading") return <LoadingState label="Connecting…" />;

  if (status === "authenticated" && user) {
    return <WagmiGuard>{children}</WagmiGuard>;
  }

  if (!hasPrivyAppId()) {
    return <RedirectHome />;
  }

  return <PrivyGuard>{children}</PrivyGuard>;
}

function RedirectHome() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return <LoadingState label="Redirecting…" />;
}

/** Google path: dashboard unlocks when a wagmi wallet is connected. */
function WagmiGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isConnected, isConnecting, isReconnecting } = useAccount();

  useEffect(() => {
    if (!isConnecting && !isReconnecting && !isConnected) {
      router.replace("/connect-wallet");
    }
  }, [isConnected, isConnecting, isReconnecting, router]);

  if (!isConnected) return <LoadingState label="Redirecting…" />;
  return <>{children}</>;
}

/** Privy path: dashboard unlocks when an external wallet is linked. */
function PrivyGuard({ children }: { children: React.ReactNode }) {
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
