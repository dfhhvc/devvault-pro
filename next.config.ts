import type { NextConfig } from "next";

/**
 * Base path is configurable via environment variable.
 * - GitHub Pages: uses "/devvault-pro" (default)
 * - Docker/nginx: set NEXT_PUBLIC_BASE_PATH="" for root deployment
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/devvault-pro";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  basePath: basePath,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
