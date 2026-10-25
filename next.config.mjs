import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

/** @type {import('next').NextConfig} */
const nextConfig = {
  // NEXT_DIST_DIR lets a prod build (Lighthouse) live next to a running dev server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  images: { formats: ["image/avif", "image/webp"] },
  experimental: {
    inlineCss: true,
    optimizePackageImports: ["framer-motion", "@react-three/drei"],
  },
};

export default withBundleAnalyzer(nextConfig);
