/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: false, // Disable in dev for faster compilation
  // Disable source maps in production for smaller bundles
  productionBrowserSourceMaps: false,
}

export default nextConfig
