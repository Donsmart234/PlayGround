"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import OrbBackground from "@/components/ui/OrbBackground";
import PrivyLoginButton from "@/components/auth/PrivyLoginButton";
import { useGoogleAuth } from "@/lib/google-auth";
import { hasPrivyAppId } from "@/lib/privy-safe";
import { hasWalletConnect } from "@/lib/wagmi";

export const dynamic = "force-dynamic";

function truncate(addr: string) {
  return addr.length > 12 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
}

function Stepper() {
  return (
    <ol className="mb-8 flex items-center justify-center gap-2 text-xs font-semibold">
      <li className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-600">1 · Signed in</li>
      <li aria-hidden className="h-px w-6 bg-pink-500/30" />
      <li className="brand-gradient-bg rounded-full px-3 py-1 text-white">2 · Link wallet</li>
      <li aria-hidden className="h-px w-6 bg-pink-500/30" />
      <li className="rounded-full bg-zinc-500/10 px-3 py-1 text-zinc-500">3 · Verify</li>
    </ol>
  );
}

/**
 * /connect-wallet — dual-path gate.
 * Google path (standalone GIS session) → connect a 3rd-party wallet
 * directly via wagmi. Privy path (email/SMS modal) → existing Privy flow.
 * Dashboard stays locked until a wallet is linked.
 */
export default function ConnectWalletPage() {
  const { status, user } = useGoogleAuth();

  // Google session wins — no Privy needed at all on this path.
  if (status === "authenticated" && user) {
    return <GoogleWalletGate />;
  }

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <LoadingState label="Connecting…" />
      </main>
    );
  }

  if (!hasPrivyAppId()) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-[#FDFBFB] px-4">
        <OrbBackground variant="compact" />
        <GlassCard className="max-w-md p-8 text-center">
          <h1 className="text-xl font-semibold text-zinc-900">Sign-in isn&apos;t configured yet</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Google path: set NEXT_PUBLIC_GOOGLE_CLIENT_ID, or Privy path:
            create a free app at dashboard.privy.io and set
            NEXT_PUBLIC_PRIVY_APP_ID — then restart. See .env.example.
          </p>
        </GlassCard>
      </main>
    );
  }

  return <PrivyWalletGate />;
}

/* ————— PATH 1: Google session → direct wagmi wallet connect ————— */

const CONNECTOR_LABELS: Record<string, string> = {
  injected: "Browser wallet",
  metaMaskSDK: "MetaMask",
  coinbaseWalletSDK: "Coinbase Wallet",
  walletConnect: "WalletConnect",
};

function connectorLabel(id: string) {
  const lower = id.toLowerCase();
  for (const [key, label] of Object.entries(CONNECTOR_LABELS)) {
    if (lower.includes(key.toLowerCase())) return label;
  }
  return id;
}

function GoogleWalletGate() {
  const { user, signOut } = useGoogleAuth();
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending, error, reset } = useConnect();
  const { disconnect } = useDisconnect();

  const visibleConnectors = connectors.filter((c) => {
    // Hide WalletConnect when no project ID is configured.
    if (!hasWalletConnect && c.id.toLowerCase().includes("walletconnect")) {
      return false;
    }
    return true;
  });

  const handleSignOut = () => {
    disconnect();
    signOut();
  };

  return (
    <main className="relative min-h-screen bg-[#FDFBFB] px-4 py-16">
      <OrbBackground />
      <div className="mx-auto max-w-lg">
        <Stepper />
        <GlassCard strong className="p-7 text-center sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            {isConnected ? "Wallet linked" : "Link your wallet"}
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Signed in as{" "}
            <span className="font-semibold text-zinc-800">
              {user?.email ?? user?.name ?? "Google user"}
            </span>
            .{" "}
            {isConnected
              ? "Your 3rd-party wallet is connected. Voice verification unlocks next."
              : "Connect MetaMask, Coinbase Wallet, or WalletConnect. One active external wallet for the MVP."}
          </p>

          {isConnected && address ? (
            <div className="glass mt-5 rounded-2xl px-4 py-3 text-sm">
              <span className="font-semibold text-zinc-900">{truncate(address)}</span>
              <span className="ml-2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                Connected
              </span>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-2.5">
              {visibleConnectors.map((c) => (
                <GradientButton
                  key={c.uid}
                  variant="ghost"
                  onClick={() => {
                    reset();
                    connect({ connector: c });
                  }}
                  disabled={isPending}
                  className="w-full"
                >
                  {isPending ? "Opening wallet…" : `Connect ${connectorLabel(c.id)}`}
                </GradientButton>
              ))}
              {!hasWalletConnect && (
                <p className="text-[11px] text-zinc-500">
                  WalletConnect QR needs a free project ID (cloud.reown.com) —
                  set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to enable it.
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 text-left">
              <ErrorState
                title="Connection failed"
                message={error.message ?? "Wallet connection was cancelled."}
                onRetry={() => reset()}
              />
            </div>
          )}

          {isConnected && (
            <GradientButton disabled className="mt-6 w-full" title="Voice verification ships in the next phase">
              Continue to voice verification — next phase
            </GradientButton>
          )}

          <button
            onClick={handleSignOut}
            className="mt-5 text-xs font-semibold text-zinc-500 transition hover:text-pink-500"
          >
            Sign out
          </button>
        </GlassCard>
      </div>
    </main>
  );
}

/* ————— PATH 2: Privy session → existing Privy wallet flow ————— */

function PrivyWalletGate() {
  const router = useRouter();
  const { ready, authenticated, logout, connectWallet } = usePrivy();
  const { wallets } = useWallets();
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!authenticated) router.replace("/");
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
    <main className="relative min-h-screen bg-[#FDFBFB] px-4 py-16">
      <OrbBackground />
      <div className="mx-auto max-w-lg">
        <Stepper />
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
