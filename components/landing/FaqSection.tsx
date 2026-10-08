"use client";

import { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "./Reveal";

const FAQS = [
  {
    q: "Do I need a crypto wallet to start?",
    a: "No. Signing in with Google auto-creates an embedded EVM wallet via Privy. You'll link an external wallet (MetaMask, Coinbase, WalletConnect) on the next screen to unlock the dashboard.",
  },
  {
    q: "What does the voice check actually verify?",
    a: "You record a ≤15s video + audio clip saying a rotating phrase. OpenAI Whisper transcribes the speech and our acoustic heuristics (spectral flatness, breath-band energy) confirm a live human rather than a replay.",
  },
  {
    q: "Which chains are supported?",
    a: "Ethereum mainnet, Base and Polygon for the MVP, with balances aggregated through Alchemy's Portfolio API. Arbitrum and Optimism arrive in v2.",
  },
  {
    q: "Can I send, receive or swap tokens yet?",
    a: "Those are visual placeholders in the MVP so the dashboard layout is final. Receive already shows your wallet address as a QR code; full transaction flows come after verification ships.",
  },
  {
    q: "What happens to my voice recording?",
    a: "Only the verification score and a transcript hash are stored in Supabase (Postgres, free tier). Raw recordings are capped at 25MB and are never sold or used for training.",
  },
  {
    q: "How much does it cost?",
    a: "The MVP runs entirely on free tiers: Privy, Alchemy, Supabase and Vercel hosting. You'll only ever pay normal network gas for on-chain actions.",
  },
];

/** 7 — FAQ accordion. */
export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Questions, <span className="brand-gradient-text">answered</span>
          </h2>
        </Reveal>
        <div className="mt-8 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.04}>
                <GlassCard className="overflow-hidden">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-zinc-900 sm:text-base">{f.q}</span>
                    <span
                      className={`brand-gradient-text text-xl font-semibold transition-transform duration-200 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-600">
                      {f.a}
                    </p>
                  )}
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
