"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import OrbBackground from "@/components/ui/OrbBackground";
import PrivyLoginButton from "@/components/auth/PrivyLoginButton";
import { hasPrivyAppId } from "@/lib/privy-safe";

export const dynamic = "force-dynamic";

function truncate(addr: string) {
  return addr.length > 12 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
}

/**
 * /connect-wallet — Phase 3 gate.
 * Requires Privy login (redirects to landing if not).
 * Links ONE external wallet (MetaMask / Coinbase / WalletConnect) via
 * Privy's modal. Dashboard stays locked until this step is done.
 * Google login arrives here via POST /api/auth/google (verified + provisioned).
 */
export default function ConnectWalletPage() {
  if (!hasPrivyAppId()) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-blush-50 to-blush-100 px-4">
        <OrbBackground variant="compact" />
        <GlassCard className="max-w-md p-8 text-center">
          <h1 className="text-xl font-semibold text-zinc-900">Privy isn&apos;t configured yet</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Create a free app at dashboard.privy.io, set NEXT_PUBLIC_PRIVY_APP_ID,
            then restart. See .env.example.
          </p>
        </GlassCard>
      </main>
    );
  }
  return <WiredConnectWallet />;
}

function WiredConnectWallet() {
  const router = useRouter();
  const { ready, authenticated, logout, connectWallet } = usePrivy();
  const { wallets } = useWallets();
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (ready && !authenticated) router.replace("/");
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <LoadingState label={ready ? "Redirecting…" : "Connecting…"} />
      </main>
    );
  }

  const embedded = wallets.find((w) => w.walletClientType === "privy");
  const external = wallets.find((w) => w.walletClientType !== "privy");

  const handleConnect = async () => {
    setError(null);
    setConnecting(true);
    try {
      await connectWallet();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Wallet connection was cancelled.");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-white via-blush-50 to-blush-100 px-4 py-16">
      <OrbBackground />
      <div className="mx-auto max-w-lg">
        <ol className="mb-8 flex items-center justify-center gap-2 text-xs font-semibold">
          <li className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-600">1 · Signed in</li>
          <li aria-hidden className="h-px w-6 bg-pink-500/30" />
          <li className="brand-gradient-bg rounded-full px-3 py-1 text-white">2 · Link wallet</li>
          <li aria-hidden className="h-px w-6 bg-pink-500/30" />
          <li className="rounded-full bg-zinc-500/10 px-3 py-1 text-zinc-500">3 · Verify</li>
        </ol>

        <GlassCard strong className="p-7 text-center sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            {external ? "Wallet linked" : "Link your wallet"}
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            {external
              ? "Your external wallet is connected. Voice verification unlocks next."
              : "Connect MetaMask, Coinbase Wallet, or any WalletConnect wallet. One active external wallet for the MVP."}
          </p>

          {embedded && (
            <p className="mt-4 text-xs text-zinc-500">
              Embedded wallet: <span className="font-semibold text-zinc-700">{truncate(embedded.address)}</span>
            </p>
          )}

          {external ? (
            <div className="glass mt-5 rounded-2xl px-4 py-3 text-sm">
              <span className="font-semibold text-zinc-900">{truncate(external.address)}</span>
              <span className="ml-2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                Connected
              </span>
            </div>
          ) : (
            <GradientButton onClick={handleConnect} disabled={connecting} className="mt-6 w-full">
              {connecting ? "Opening wallet…" : "Connect external wallet"}
            </GradientButton>
          )}

          {error && (
            <div className="mt-4 text-left">
              <ErrorState title="Connection failed" message={error} onRetry={handleConnect} />
            </div>
          )}

          {external && (
            <GradientButton disabled className="mt-6 w-full" title="Voice verification ships in the next phase">
              Continue to voice verification — next phase
            </GradientButton>
          )}

          <button
            onClick={logout}
            className="mt-5 text-xs font-semibold text-zinc-500 transition hover:text-pink-500"
          >
            Sign out
          </button>
        </GlassCard>

        {!authenticated && (
          <div className="mt-4">
            <PrivyLoginButton className="w-full" />
          </div>
        )}
      </div>
    </main>
  );
}
