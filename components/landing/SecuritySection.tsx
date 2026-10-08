import GlassCard from "@/components/ui/GlassCard";
import Reveal from "./Reveal";

const POINTS = [
  {
    title: "Your biometrics stay yours",
    body: "Voice clips are used for one verification decision, then stored only as a score + transcript hash in Supabase. Raw recordings are never sold, shared, or used for training.",
  },
  {
    title: "No passwords to leak",
    body: "Privy handles authentication (Google OAuth, email, passkey). There is no extra auth layer and no password database — nothing to breach.",
  },
  {
    title: "Replay resistance",
    body: "Micro-acoustic liveness (spectral flatness, breath-band energy) flags played-back audio. Each challenge phrase rotates, so yesterday's clip won't pass today.",
  },
  {
    title: "Non-custodial by design",
    body: "Aurum never holds your keys. Embedded wallets are yours via Privy; external wallets stay in MetaMask, Coinbase or WalletConnect.",
  },
];

/** 6 — Security & Privacy section. */
export default function SecuritySection() {
  return (
    <section id="security" className="scroll-mt-24 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
            Security &amp; Privacy
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Paranoid where it <span className="brand-gradient-text">counts</span>
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {POINTS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 0.08}>
              <GlassCard className="h-full border-pink-500/10 p-6">
                <h3 className="flex items-center gap-2 font-semibold text-zinc-900">
                  <span className="inline-block h-2 w-2 rounded-full bg-pink-400" />
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{p.body}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
