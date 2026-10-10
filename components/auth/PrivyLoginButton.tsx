"use client";

import { useRouter } from "next/navigation";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import GradientButton from "@/components/ui/GradientButton";
import { hasPrivyAppId, missingPrivyAlert } from "@/lib/privy-safe";
import { extractWalletHints, syncGoogleLoginToBackend } from "@/lib/auth-sync";

function PasskeyIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="8" cy="15" r="4" />
      <path d="M10.85 12.15 19 4m-4 2 3 3" />
    </svg>
  );
}

type Props = {
  label?: string;
  className?: string;
};

/**
 * BUTTON 2 — "Continue with Privy".
 * Opens the Privy login modal (email, phone, passkey + socials).
 * Same post-login routing as Google: → /connect-wallet.
 */
export default function PrivyLoginButton({
  label = "Continue with Privy",
  className,
}: Props) {
  if (!hasPrivyAppId()) {
    return (
      <GradientButton
        variant="ghost"
        onClick={missingPrivyAlert}
        className={className}
        aria-label={label}
      >
        <span className="brand-gradient-text">
          <PasskeyIcon />
        </span>
        {label}
      </GradientButton>
    );
  }
  return <WiredPrivyButton label={label} className={className} />;
}

function WiredPrivyButton({ label, className }: Props) {
  const router = useRouter();
  const { ready, getAccessToken } = usePrivy();
  const { login } = useLogin({
    onComplete: async (loginUser) => {
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
      variant="ghost"
      onClick={() => login()}
      disabled={!ready}
      className={className}
      aria-label={label}
    >
      <span className="brand-gradient-text">
        <PasskeyIcon />
      </span>
      {label}
    </GradientButton>
  );
}
