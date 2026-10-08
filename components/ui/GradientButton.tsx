import { cn } from "@/lib/cn";

type GradientButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "brand" | "ghost";
};

/**
 * Primary CTA: pink gradient pill, white text. Ghost: light-glass pill
 * with a soft pink hover glow.
 */
export default function GradientButton({
  variant = "brand",
  className,
  children,
  ...rest
}: GradientButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5",
        "text-sm font-semibold transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400/70",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variant === "brand" &&
          "brand-gradient-bg text-white shadow-brand hover:shadow-[0_10px_48px_-8px_rgba(236,72,153,0.75)] hover:brightness-105 active:scale-[0.98]",
        variant === "ghost" &&
          "glass text-zinc-900 hover:border-pink-400/50 hover:shadow-[0_8px_40px_-10px_rgba(236,72,153,0.45)] active:scale-[0.98]",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
