import { cn } from "@/lib/cn";

type GradientButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "brand" | "ghost";
};

/**
 * Mockup-matched CTAs.
 * Brand: pink gradient, 16px radius, white text, pink glow that lifts on hover.
 * Ghost ("Continue with Privy"): white card, hairline border, subtle lift.
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
        "inline-flex w-full items-center justify-center gap-2.5 rounded-2xl px-6 py-4",
        "text-base font-semibold transition-all duration-300",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B8D]/60",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variant === "brand" &&
          "brand-gradient-bg text-white shadow-brand hover:-translate-y-0.5 hover:shadow-brand-lg hover:brightness-105 active:translate-y-0 active:scale-[0.99]",
        variant === "ghost" &&
          "border border-black/[0.05] bg-white text-[#111827] shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:bg-[#F9FAFB] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] active:translate-y-0",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
