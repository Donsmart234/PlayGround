"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import GradientButton from "@/components/ui/GradientButton";

type Props = {
  label?: string;
  className?: string;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (opts: {
            client_id: string;
            callback: (resp: { credential?: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            el: HTMLElement,
            opts: Record<string, unknown>
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const GIS_SRC = "https://accounts.google.com/gsi/client";
const clientId = () => process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

function loadGis(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.google?.accounts?.id) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${GIS_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = GIS_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

/**
 * BUTTON 1 — "Continue with Google" (STANDALONE — no Privy).
 * Official Google Identity Services button → ID token → POST to our
 * backend (/api/auth/google) → verified + upserted + session cookie →
 * route to /connect-wallet (no wallet is created here).
 * Privy login is BUTTON 2 and never touches this path.
 */
export default function GoogleLoginButton({
  label = "Continue with Google",
  className,
}: Props) {
  const router = useRouter();
  const btnRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error" | "busy">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId()) return; // setup hint rendered below
    let cancelled = false;
    setStatus("loading");
    loadGis().then((ok) => {
      if (cancelled || !ok || !window.google?.accounts?.id || !btnRef.current) {
        if (!cancelled) {
          setStatus("error");
          setError("Could not load Google sign-in. Check your connection and retry.");
        }
        return;
      }
      try {
        window.google.accounts.id.initialize({
          client_id: clientId(),
          callback: async (resp) => {
            if (!resp?.credential) {
              setError("Google sign-in was cancelled. Try again.");
              return;
            }
            setStatus("busy");
            setError(null);
            try {
              const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential: resp.credential }),
              });
              const data = await res.json().catch(() => null);
              if (!res.ok || !data?.ok) {
                setStatus("ready");
                setError(data?.error ?? "Google sign-in failed. Try again.");
                return;
              }
              if (data.warning) console.warn("[google-login]", data.warning);
              router.push(data.next ?? "/connect-wallet");
            } catch {
              setStatus("ready");
              setError("Network error talking to the login backend. Try again.");
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        window.google.accounts.id.renderButton(btnRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          logo_alignment: "left",
          width: 280,
        });
        setStatus("ready");
      } catch {
        setStatus("error");
        setError("Could not start Google sign-in. Retry.");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  // No Client ID yet → setup hint (never crashes, never calls Google).
  if (!clientId()) {
    return (
      <GradientButton
        className={className}
        aria-label={label}
        onClick={() =>
          alert(
            "Google login isn't configured yet.\n\n1. console.cloud.google.com → OAuth client (Web) — see .env.example\n2. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID + GOOGLE_CLIENT_ID + SESSION_SECRET\n3. Restart the dev server."
          )
        }
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-bold text-[#EA4335]">
          G
        </span>
        {label}
      </GradientButton>
    );
  }

  return (
    <span className={className} style={{ display: "inline-flex", flexDirection: "column", gap: 8 }}>
      <span className="glass inline-flex items-center justify-center rounded-full px-2 py-2">
        <div ref={btnRef} aria-label={label} style={{ minHeight: 40, minWidth: 240 }} />
      </span>
      {status === "loading" && (
        <span className="text-center text-xs text-zinc-500">Loading Google sign-in…</span>
      )}
      {status === "busy" && (
        <span className="text-center text-xs text-zinc-500">Verifying with Google…</span>
      )}
      {error && (
        <span role="alert" className="text-center text-xs font-semibold text-red-600">
          {error}
        </span>
      )}
    </span>
  );
}
