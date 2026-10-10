import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

// Body: Inter (neutral, readable). Headings: Sora — a distinctive geometric
// display face so headlines stop looking like default system type.
// Both self-hosted at build time via next/font (no <link> to Google Fonts,
// no device-font dependency). Weights mirror the mockup's 400–800 range.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const display = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
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
      <body className="min-h-screen bg-[#FDFBFB] font-sans text-[#111827]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
