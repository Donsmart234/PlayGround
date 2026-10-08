import GlassCard from "@/components/ui/GlassCard";
import Reveal from "./Reveal";

function IconShell({ children }: { children: React.ReactNode }) {
  return (
    <span className="glass flex h-11 w-11 items-center justify-center rounded-2xl text-pink-500">
      {children}
    </span>
  );
}

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0M12 17v4" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M20 7a2 2 0 0 1 2 2v11a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5" />
      <circle cx="17" cy="14" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 16V4m0 0L3 8m4-4 4 4" />
      <path d="M17 8v12m0 0 4-4m-4 4-4-4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2 4 6v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6l-8-4Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

const LARGE_FEATURES = [
  {
    icon: <MicIcon />,
    title: "15-second voice check",
    body: "Speak a rotating phrase on video. Whisper transcribes it, acoustic heuristics confirm a live human — no seed-phrase ceremony, no passwords to remember.",
  },
  {
    icon: <LayersIcon />,
    title: "Multichain by default",
    body: "Ethereum, Base and Polygon balances unified through Alchemy's Portfolio API. One screen, every chain — Arbitrum and Optimism join in v2.",
  },
];

const SMALL_FEATURES = [
  {
    icon: <WalletIcon />,
    title: "Bring your own wallet",
    body: "MetaMask, Coinbase Wallet and WalletConnect via Privy's modal. Embedded wallet created automatically at sign-in.",
  },
  {
    icon: <SwapIcon />,
    title: "Send, receive, swap",
    body: "Core actions laid out and ready — Receive already shows your address as a QR code. Full flows unlock after verification.",
  },
  {
    icon: <ShieldIcon />,
    title: "Liveness, not just login",
    body: "Spectral flatness plus breath-band energy flag replayed audio. Clips capped at 15 seconds / 25 MB.",
  },
  {
    icon: <LockIcon />,
    title: "Nothing to breach",
    body: "No passwords, no user database. Privy handles sign-in, you hold your own keys — non-custodial by design.",
  },
];

/** Features: bento grid — 2 large cards + 4 small. */
export default function FeaturesGrid() {
  return (
    <section id="features" className="relative scroll-mt-24 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
            Why Aurum
          </p>
          <h2 className="mt-2 max-w-xl text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Security you can feel, chains you don&apos;t have to think about
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {LARGE_FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <GlassCard className="h-full p-7 transition sm:p-8 hover:border-pink-400/40">
                <IconShell>{f.icon}</IconShell>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">{f.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-zinc-600">{f.body}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SMALL_FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 0.06}>
              <GlassCard className="h-full p-6 transition hover:border-pink-400/40">
                <IconShell>{f.icon}</IconShell>
                <h3 className="mt-4 font-semibold text-zinc-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{f.body}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
