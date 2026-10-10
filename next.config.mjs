/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Node-server mode (no `output: "export"`): required for Next.js route
  // handlers (/api/auth/*). `next build` + `next start` serves pages + API
  // together — Vercel supports this with zero config.
  images: { unoptimized: true },
};

export default nextConfig;
