import GlassCard from "./GlassCard";
import GradientButton from "./GradientButton";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export default function ErrorState({
  title = "Something went wrong",
  message = "Please try again. If the problem persists, check your connection.",
  onRetry,
}: ErrorStateProps) {
  return (
    <GlassCard
      role="alert"
      className="border-red-400/20 px-5 py-4"
    >
      <p className="text-sm font-semibold text-red-600">{title}</p>
      <p className="mt-1 text-sm text-zinc-600">{message}</p>
      {onRetry && (
        <GradientButton variant="ghost" onClick={onRetry} className="mt-3 px-4 py-2 text-xs">
          Try again
        </GradientButton>
      )}
    </GlassCard>
  );
}
