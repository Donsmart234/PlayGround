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

function CheckIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/** Glass dashboard mockup — pixel-faithful to the approved mockup card. */
function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
      className="relative w-full"
    >
      <GlassCard
        strong
        className="relative flex flex-col gap-5 overflow-hidden p-6"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#9CA3AF]">
            Total Balance
          </span>
          <span className="brand-gradient-bg inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold text-white shadow-brand">
            <CheckIcon />
            Voice verified
          </span>
        </div>

        <p className="font-display text-4xl font-extrabold tracking-[-0.02em] text-[#111827]">
          $24,806
          <span className="ml-0.5 text-2xl font-semibold text-[#9CA3AF]">
            .19
          </span>
        </p>

        <div className="grid grid-cols-3 gap-2.5">
          {["Send", "Receive", "Swap"].map((a) => (
            <button
              key={a}
              type="button"
              tabIndex={-1}
              aria-hidden
              className="cursor-default rounded-[14px] bg-white px-3 py-3 text-[13px] font-semibold text-[#111827] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              {a}
            </button>
          ))}
        </div>

        <div className="flex flex-col">
          {TOKENS.map((r) => (
            <div
              key={r.chain}
              className="flex items-center justify-between border-t border-black/[0.05] py-4 first:border-t-0 first:pt-1 last:pb-0"
            >
              <span className="flex items-center gap-3">
                <span className="brand-gradient-bg flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white">
                  {r.sym[0]}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-[#111827]">
                    {r.sym}
                  </span>
                  <span className="block text-[11px] font-semibold text-[#10B981]">
                    {r.change}
                  </span>
                </span>
              </span>
              <span className="text-right">
                <span className="block text-sm font-bold text-[#111827]">
                  {r.val}
                </span>
                <span className="block text-[11px] text-[#9CA3AF]">
                  {r.chain}
                </span>
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

/** Hero — mobile-first app feel (max-w 480px centered), mockup spec. */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pb-16 pt-32 sm:pt-36"
    >
      <OrbBackground />
      <div className="mx-auto flex w-full max-w-[480px] flex-col items-center gap-8 text-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/[0.05] bg-white/80 px-4 py-1.5 text-xs font-medium text-[#6B7280] shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
          >
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#FF3B8D] shadow-[0_0_8px_#FF3B8D]" />
            AI voice verification · ETH · Base · Polygon
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-[44px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#111827] sm:text-6xl"
          >
            The wallet that
            <br />
            <GradientText>knows it&apos;s you.</GradientText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-5 max-w-[90%] text-[15px] leading-relaxed text-[#6B7280]"
          >
            Sign in with Google or Privy, pass a 15-second AI voice and
            liveness check, then see Ethereum, Base and Polygon in one glass
            dashboard.
          </motion.p>
        </div>

        <motion.div
          id="get-started"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex w-full scroll-mt-24 flex-col gap-3"
        >
          <GoogleLoginButton />
          <PrivyLoginButton />
          <p className="-mt-1 text-[11px] leading-relaxed text-[#9CA3AF]">
            Google creates an embedded wallet instantly · Privy offers email,
            phone &amp; passkey
          </p>
        </motion.div>

        <DashboardMockup />
      </div>
    </section>
  );
}
