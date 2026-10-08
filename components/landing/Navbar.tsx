"use client";

import { useLogin } from "@privy-io/react-auth";
import { hasPrivyAppId } from "@/lib/privy-safe";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Security", href: "#security" },
  { label: "FAQ", href: "#faq" },
];

/** 1 — Sticky glass navbar. Right-side "Sign In" opens the Privy modal. */
export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="glass mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-full px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="brand-gradient-bg flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-white">
            A
          </span>
          <span className="text-sm font-bold tracking-tight text-zinc-900 sm:text-base">
            Aurum<span className="brand-gradient-text"> Wallet</span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm text-zinc-600 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-pink-500">
              {l.label}
            </a>
          ))}
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}

function SignInButton() {
  if (!hasPrivyAppId()) {
    return (
      <a
        href="#get-started"
        className="brand-gradient-bg rounded-full px-4 py-2 text-sm font-semibold text-white shadow-brand transition hover:brightness-105 active:scale-[0.98] sm:px-5"
      >
        Sign In
      </a>
    );
  }
  return <WiredSignInButton />;
}

function WiredSignInButton() {
  const { login } = useLogin();
  return (
    <button
      onClick={() => login()}
      className="brand-gradient-bg rounded-full px-4 py-2 text-sm font-semibold text-white shadow-brand transition hover:brightness-105 active:scale-[0.98] sm:px-5"
    >
      Sign In
    </button>
  );
}
