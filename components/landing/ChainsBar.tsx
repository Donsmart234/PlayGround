import ChainLogo from "@/components/ui/ChainLogo";
import Reveal from "./Reveal";

type ChainId = "ethereum" | "base" | "polygon";

const CHAINS: { id: ChainId; name: string; detail: string }[] = [
  { id: "ethereum", name: "Ethereum", detail: "Mainnet · Chain ID 1" },
  { id: "base", name: "Base", detail: "Chain ID 8453" },
  { id: "polygon", name: "Polygon", detail: "Chain ID 137" },
];

/** 3 — Supported chains bar (Arbitrum + Optimism land in v2). */
export default function ChainsBar() {
  return (
    <section className="px-4 py-10">
      <Reveal className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Live on three chains at launch
        </p>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {CHAINS.map((c) => (
            <div
              key={c.name}
              className="glass flex items-center gap-4 rounded-3xl px-5 py-4"
            >
              <ChainLogo chain={c.id} size={40} />
              <span>
                <span className="block text-sm font-bold text-zinc-900">{c.name}</span>
                <span className="block text-xs text-zinc-500">{c.detail}</span>
              </span>
              <span className="ml-auto rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                Live
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-zinc-500">
          Arbitrum &amp; Optimism arrive in v2
        </p>
      </Reveal>
    </section>
  );
}
