"use client";

import { useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivyProvider } from "@privy-io/react-auth";
import { wagmiConfig } from "@/lib/wagmi";
import { GoogleAuthProvider } from "@/lib/google-auth";

/**
 * Provider stack (outermost → innermost):
 * GoogleAuth (standalone GIS session) → wagmi/react-query (direct wallets)
 * → Privy (email/SMS modal only — Google removed from its login methods).
 *
 * All client-side: compatible with the static export (no API routes).
 * MVP chains: Ethereum mainnet + Base + Polygon (Arbitrum/Optimism in v2).
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  let tree = (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );

  // Privy stays mounted only for the non-Google modal path.
  // Without an App ID the Google + wagmi flow still works fully.
  if (appId) {
    tree = (
      <PrivyProvider
        appId={appId}
        config={{
          loginMethods: ["email", "sms"],
          appearance: {
            theme: "light",
            accentColor: "#FF3B8D",
          },
          embeddedWallets: {
            createOnLogin: "all-users",
          },
          defaultChain: {
            id: 1,
            name: "Ethereum",
            network: "homestead",
            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
            rpcUrls: { default: { http: ["https://cloudflare-eth.com"] } },
            blockExplorers: {
              default: { name: "Etherscan", url: "https://etherscan.io" },
            },
          } as never,
          supportedChains: [
            {
              id: 1,
              name: "Ethereum",
              network: "homestead",
              nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
              rpcUrls: { default: { http: ["https://cloudflare-eth.com"] } },
              blockExplorers: {
                default: { name: "Etherscan", url: "https://etherscan.io" },
              },
            },
            {
              id: 8453,
              name: "Base",
              network: "base",
              nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
              rpcUrls: { default: { http: ["https://mainnet.base.org"] } },
              blockExplorers: {
                default: { name: "Basescan", url: "https://basescan.org" },
              },
            },
            {
              id: 137,
              name: "Polygon",
              network: "matic",
              nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
              rpcUrls: { default: { http: ["https://polygon-rpc.com"] } },
              blockExplorers: {
                default: { name: "Polygonscan", url: "https://polygonscan.com" },
              },
            },
          ] as never,
        }}
      >
        {tree}
      </PrivyProvider>
    );
  } else if (typeof window !== "undefined") {
    console.warn(
      "[Privy] NEXT_PUBLIC_PRIVY_APP_ID is not set — Privy modal disabled. Google + direct wallets still work. See .env.example."
    );
  }

  return <GoogleAuthProvider>{tree}</GoogleAuthProvider>;
}
