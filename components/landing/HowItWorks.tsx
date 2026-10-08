import GlassCard from "@/components/ui/GlassCard";
import Reveal from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "Sign in",
    body: "Continue with Google for an instant embedded wallet — or open the Privy modal for email, phone, passkey and more.",
  },
  {
    n: "02",
    title: "Link a wallet",
    body: "Connect MetaMask, Coinbase Wallet or any WalletConnect wallet. One active external wallet for the MVP.",
  },
  {
    n: "03",
    title: "Speak to verify",
    body: "Record a 15-second video + audio clip, say the phrase, pass liveness — your dashboard unlocks.",
  },
];

/** 5 — How It Works (3-step visual). */
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Live in <span className="brand-gradient-text">three steps</span>
          </h2>
        </Reveal>
        <div className="relative mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div
            aria-hidden
            className="brand-gradient-bg absolute left-[16%] right-[16%] top-10 hidden h-px opacity-40 md:block"
          />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <GlassCard className="relative h-full p-6 text-center">
                <span className="brand-gradient-bg mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold text-white">
                  {s.n}
                </span>
                <h3 className="mt-4 font-semibold text-zinc-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{s.body}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
