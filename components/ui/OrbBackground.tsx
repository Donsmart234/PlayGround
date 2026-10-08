import { cn } from "@/lib/cn";

type OrbBackgroundProps = {
  className?: string;
  /** Fewer/smaller orbs for compact sections (e.g. final CTA). */
  variant?: "full" | "compact";
};

/**
 * Soft pink organic washes floating behind content.
 * Absolutely positioned, z-index -1. Blur is reduced on mobile via `.orb`.
 */
export default function OrbBackground({
  className,
  variant = "full",
}: OrbBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className
      )}
    >
      <div
        className="orb orb-drift-1 absolute -top-32 left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(249,168,212,0.5), transparent)",
          filter: "blur(90px)",
        }}
      />
      <div
        className="orb orb-drift-2 absolute right-[-140px] top-1/3 h-[380px] w-[380px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(244,114,182,0.35), transparent)",
          filter: "blur(90px)",
        }}
      />
      {variant === "full" && (
        <div
          className="orb orb-drift-3 absolute bottom-[-120px] left-[-120px] h-[340px] w-[340px] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(236,72,153,0.22), transparent)",
            filter: "blur(90px)",
          }}
        />
      )}
    </div>
  );
}
