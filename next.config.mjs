/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export for preview deployment: `next build` writes ./out/.
  // start.sh serves that directory; see deployment-output.json.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
