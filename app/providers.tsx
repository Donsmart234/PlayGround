"use client";

import { PrivyProvider } from "@privy-io/react-auth";

/**
 * Privy provider — wraps the whole app (landing + authed routes).
 * MVP chains: Ethereum mainnet + Base + Polygon (Arbitrum/Optimism in v2).
 * External connectors (MetaMask, Coinbase Wallet, WalletConnect) are
 * enabled by default in Privy's modal — no extra config needed.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  // Graceful fallback: render without Privy until an App ID is configured
  // (landing page stays fully visible; auth buttons show a setup hint).
  if (!appId) {
    if (typeof window !== "undefined") {
      console.warn(
        "[Privy] NEXT_PUBLIC_PRIVY_APP_ID is not set — auth buttons will show setup instructions. See .env.example."
      );
    }
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["google", "email", "sms"],
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
      {children}
    </PrivyProvider>
  );
}
