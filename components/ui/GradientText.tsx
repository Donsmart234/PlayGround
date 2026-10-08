import { cn } from "@/lib/cn";

type GradientTextProps = React.HTMLAttributes<HTMLSpanElement>;

/** Brand gradient headline text: linear-gradient(135deg, #f472b6, #db2777). */
export default function GradientText({
  className,
  children,
  ...rest
}: GradientTextProps) {
  return (
    <span className={cn("brand-gradient-text", className)} {...rest}>
      {children}
    </span>
  );
}
