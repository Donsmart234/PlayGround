"use client";

import { useLogin } from "@privy-io/react-auth";
import { hasPrivyAppId } from "@/lib/privy-safe";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Security", href: "#security" },
  { label: "FAQ", href: "#faq" },
];

/** Sticky glass pill navbar — mockup spec: 100px radius, blur 20px. */
export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4">
      <div className="glass mx-auto mt-6 flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-3 sm:px-5">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="brand-gradient-bg flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white shadow-brand">
            A
          </span>
          <span className="text-base font-bold tracking-tight text-[#111827]">
            Aurum <span className="text-[#FF3B8D]">Wallet</span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm text-[#6B7280] md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-[#FF3B8D]">
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
        className="brand-gradient-bg rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-brand transition-all duration-300 hover:-translate-y-0.5 hover:shadow-brand-lg sm:px-5"
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
      className="brand-gradient-bg rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-brand transition-all duration-300 hover:-translate-y-0.5 hover:shadow-brand-lg"
    >
      Sign In
    </button>
  );
}
