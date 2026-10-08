import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

// Self-hosted custom font (downloaded at build time — no runtime
// dependency on Google Fonts or device fonts). Two weights only,
// per the type system: 400 body / 600 headlines.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-inter",
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
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans text-zinc-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
