import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

// Body: Inter (neutral, readable). Headings: Sora — a distinctive geometric
// display face so headlines stop looking like default system type.
// Both self-hosted at build time (no runtime Google-Fonts/device-font dep).
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-inter",
  display: "swap",
});

const display = Sora({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aurum Wallet — Voice-Verified Web3 Wallet",
  description:
    "One wallet, every chain. Voice-verified security with glass-smooth UX on Ethereum, Base and Polygon.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-screen bg-white font-sans text-zinc-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
