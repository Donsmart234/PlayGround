import { cn } from "@/lib/cn";

type OrbBackgroundProps = {
  className?: string;
  /** Fewer/smaller orbs for compact sections (e.g. final CTA). */
  variant?: "full" | "compact";
};

/**
 * The $100M mesh gradient from the mockup: pink / lavender / peach blobs,
 * heavy blur, slow float. Reduced on mobile for performance.
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
        className="orb orb-drift-1 absolute -left-[100px] -top-[100px] h-[400px] w-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, #FFD1E3 0%, rgba(255,209,227,0) 70%)",
          filter: "blur(80px)",
          opacity: 0.6,
        }}
      />
      <div
        className="orb orb-drift-2 absolute -bottom-[150px] -right-[150px] h-[500px] w-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, #E0D4FF 0%, rgba(224,212,255,0) 70%)",
          filter: "blur(80px)",
          opacity: 0.6,
        }}
      />
      {variant === "full" && (
        <div
          className="orb orb-drift-3 absolute left-1/2 top-[40%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, #FFE4D6 0%, rgba(255,228,214,0) 70%)",
            filter: "blur(80px)",
            opacity: 0.6,
          }}
        />
      )}
    </div>
  );
}
