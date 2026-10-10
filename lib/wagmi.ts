import { http, createConfig } from "wagmi";
import { mainnet, base, polygon } from "wagmi/chains";
import {
  injected,
  metaMask,
  coinbaseWallet,
  walletConnect,
} from "wagmi/connectors";

/**
 * Direct 3rd-party wallet connections (no Privy involved).
 * Chains mirror the MVP set: Ethereum mainnet + Base + Polygon.
 */

const wcProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

/** False when no Reown/WalletConnect project ID is set (button hidden). */
export const hasWalletConnect = Boolean(wcProjectId);

export const wagmiConfig = createConfig({
  chains: [mainnet, base, polygon],
  connectors: [
    // Browser-injected wallets (MetaMask extension, Brave, Rabby, …)
    injected({ shimDisconnect: true }),
    metaMask({ dappMetadata: { name: "Aurum Wallet" } }),
    coinbaseWallet({ appName: "Aurum Wallet" }),
    // WalletConnect (QR / mobile) — only when a project ID is configured
    // (free at https://cloud.reown.com).
    ...(wcProjectId
      ? [walletConnect({ projectId: wcProjectId, showQrModal: true })]
      : []),
  ],
  transports: {
    [mainnet.id]: http("https://cloudflare-eth.com"),
    [base.id]: http("https://mainnet.base.org"),
    [polygon.id]: http("https://polygon-rpc.com"),
  },
  ssr: true,
});
