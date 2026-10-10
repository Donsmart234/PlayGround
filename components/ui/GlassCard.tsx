import { cn } from "@/lib/cn";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  strong?: boolean;
};

/** Frosted-glass surface used across landing, verification and dashboard. */
export default function GlassCard({
  strong = false,
  className,
  children,
  ...rest
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] shadow-glass",
        strong ? "glass-strong" : "glass",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
