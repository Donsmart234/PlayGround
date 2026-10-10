type ChainLogoProps = {
  /** ethereum | base | polygon — Trust Wallet chain icons in /public/chains */
  chain: "ethereum" | "base" | "polygon";
  size?: number;
  className?: string;
};

/**
 * Official chain artwork (Trust Wallet assets repo — the canonical
 * chain-icon set used across the wallet ecosystem), seated on a white
 * disc so it reads crisply on the light-glass theme.
 */
export default function ChainLogo({ chain, size = 40, className = "" }: ChainLogoProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/chains/${chain}.png`}
        alt={`${chain} logo`}
        width={size}
        height={size}
        loading="lazy"
        className="h-full w-full object-contain"
      />
    </span>
  );
}
