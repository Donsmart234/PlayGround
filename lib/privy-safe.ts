"use client";

import { useRouter } from "next/navigation";
import { useLogin, usePrivy } from "@privy-io/react-auth";

const MISSING_KEY_MSG =
  "Privy is not configured yet.\n\n1. Create a free app at https://dashboard.privy.io\n2. Copy the App ID into NEXT_PUBLIC_PRIVY_APP_ID (see .env.example)\n3. Restart the dev server.";

export const hasPrivyAppId = () =>
  !!process.env.NEXT_PUBLIC_PRIVY_APP_ID;

/**
 * Google direct login stays DISABLED until the Privy flow is approved.
 * Set NEXT_PUBLIC_ENABLE_GOOGLE_LOGIN=true to enable it.
 */
export const isGoogleLoginEnabled = () =>
  process.env.NEXT_PUBLIC_ENABLE_GOOGLE_LOGIN === "true";

export function missingPrivyAlert() {
  alert(MISSING_KEY_MSG);
}

/** Safe useLogin: real Privy login when configured, no-op alert otherwise. */
export function useAuthLogin(onComplete: () => void) {
  const router = useRouter();
  void router;
  // NOTE: call-site components must branch on hasPrivyAppId() BEFORE
  // calling this hook (see GoogleLoginButton), so useLogin() below never
  // executes without a PrivyProvider ancestor.
  return useLogin({ onComplete });
}

export function useAuthReady(): boolean {
  // Same contract as above — only call inside Privy-gated components.
  const { ready } = usePrivy();
  return ready;
}
