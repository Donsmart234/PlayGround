/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export for preview deployment: `next build` writes ./out/.
  // start.sh serves that directory; see deployment-output.json.
  output: "export",
  images: { unoptimized: true },
  webpack: (config) => {
    // @metamask/sdk requires this only inside a React-Native-only code path
    // (try/catch guarded, never runs on web) — stub it so webpack resolves.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": false,
    };
    return config;
  },
};

export default nextConfig;
