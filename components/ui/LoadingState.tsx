import GlassCard from "./GlassCard";

export default function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <GlassCard className="flex items-center gap-3 px-5 py-4" role="status">
      <span
        aria-hidden
        className="h-5 w-5 animate-spin rounded-full border-2 border-pink-400/30 border-t-pink-500"
      />
      <p className="text-sm text-zinc-600">{label}</p>
    </GlassCard>
  );
}
