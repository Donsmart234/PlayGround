"use client";

import { useRouter } from "next/navigation";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import GradientButton from "@/components/ui/GradientButton";
import { hasPrivyAppId, missingPrivyAlert } from "@/lib/privy-safe";
import { extractWalletHints, syncGoogleLoginToBackend } from "@/lib/auth-sync";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.4c-.24 1.2-1.56 3.5-5.4 3.5a5.9 5.9 0 0 1 0-11.8c1.5 0 2.5.63 3.1 1.17l2.4-2.3C15.9 3.3 14.1 2.5 12 2.5a9.5 9.5 0 0 0 0 19c5.5 0 9.1-3.9 9.1-9.3 0-.62-.07-1.1-.15-1.6H12z"
      />
    </svg>
  );
}

type Props = {
  label?: string;
  className?: string;
};

/**
 * BUTTON 1 — "Continue with Google".
 * Calls Privy's Google OAuth directly, creates an embedded EVM wallet
 * automatically (createOnLogin: all-users), then routes to /connect-wallet.
 */
export default function GoogleLoginButton({
  label = "Continue with Google",
  className,
}: Props) {
  // No Privy App ID (or SSR prerender): render a static button that explains
  // setup — useLogin() is never called without a PrivyProvider ancestor.
  if (!hasPrivyAppId()) {
    return (
      <GradientButton onClick={missingPrivyAlert} className={className} aria-label={label}>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
          <GoogleIcon />
        </span>
        {label}
      </GradientButton>
    );
  }
  return <WiredGoogleButton label={label} className={className} />;
}

function WiredGoogleButton({ label, className }: Props) {
  const router = useRouter();
  const { ready, getAccessToken } = usePrivy();
  const { login } = useLogin({
    onComplete: async (loginUser) => {
      // Verify + provision via our backend, then enter the wallet gate.
      // Navigation is never blocked: sync failures only log a warning.
      try {
        const token = await getAccessToken();
        const { next } = await syncGoogleLoginToBackend(
          token,
          extractWalletHints(loginUser)
        );
        router.push(next);
      } catch {
        router.push("/connect-wallet");
      }
    },
  });

  return (
    <GradientButton
      onClick={() => login({ loginMethods: ["google"] })}
      disabled={!ready}
      className={className}
      aria-label={label}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
        <GoogleIcon />
      </span>
      {label}
    </GradientButton>
  );
}
