"use client";

import { motion } from "framer-motion";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import PrivyLoginButton from "@/components/auth/PrivyLoginButton";
import GradientText from "@/components/ui/GradientText";
import GlassCard from "@/components/ui/GlassCard";
import OrbBackground from "@/components/ui/OrbBackground";

const TOKENS = [
  { sym: "ETH", chain: "Ethereum", val: "$12,402.55", change: "+2.4%" },
  { sym: "ETH", chain: "Base", val: "$8,911.02", change: "+3.1%" },
  { sym: "MATIC", chain: "Polygon", val: "$3,492.62", change: "+1.2%" },
];

/** Glass dashboard mockup preview (visual only — live data in Phase 6). */
function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
    >
      <div
        aria-hidden
        className="brand-gradient-bg absolute -inset-x-4 -top-4 bottom-0 rounded-[28px] opacity-25 blur-2xl"
      />
      <GlassCard strong className="relative overflow-hidden p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Total balance
            </p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              $24,806<span className="text-zinc-400">.19</span>
            </p>
          </div>
          <span className="brand-gradient-bg mt-1 shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-white">
            <span aria-hidden>●</span> Voice verified
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {["Send", "Receive", "Swap"].map((a) => (
            <div
              key={a}
              className="glass rounded-2xl px-3 py-2.5 text-center text-sm font-semibold text-zinc-800"
            >
              {a}
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2.5">
          {TOKENS.map((r) => (
            <div
              key={r.chain}
              className="flex items-center justify-between rounded-2xl bg-pink-500/[0.05] px-4 py-3 text-sm"
            >
              <span className="flex items-center gap-3">
                <span className="brand-gradient-bg flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white">
                  {r.sym[0]}
                </span>
                <span>
                  <span className="block font-semibold leading-tight text-zinc-900">{r.sym}</span>
                  <span className="block text-xs text-zinc-500">{r.chain}</span>
                </span>
              </span>
              <span className="text-right">
                <span className="block font-semibold text-zinc-900">{r.val}</span>
                <span className="block text-xs font-medium text-emerald-600">
                  {r.change}
                </span>
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

/** Hero: asymmetric — text left (60%), glass mockup right (40%). */
export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-16 pt-32 sm:pt-40">
      <OrbBackground />
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[60%_40%]">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-zinc-600"
          >
            <span className="brand-gradient-bg h-2 w-2 rounded-full" />
            AI voice verification · ETH · Base · Polygon
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl font-semibold leading-[1.05] tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl"
          >
            The wallet that <GradientText>knows it&apos;s you.</GradientText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-base text-zinc-600 sm:text-lg lg:mx-0"
          >
            Sign in with Google or Privy, pass a 15-second AI voice and
            liveness check, then see Ethereum, Base and Polygon in one glass
            dashboard.
          </motion.p>

          <motion.div
            id="get-started"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex scroll-mt-24 flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <GoogleLoginButton className="w-full sm:w-auto" />
            <PrivyLoginButton className="w-full sm:w-auto" />
          </motion.div>
          <p className="mt-3 text-xs text-zinc-500">
            Google creates an embedded wallet instantly · Privy offers email,
            phone &amp; passkey
          </p>
        </div>

        <DashboardMockup />
      </div>
    </section>
  );
}
