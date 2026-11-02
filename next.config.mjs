import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

// Content-Security-Policy. Next's inline bootstrap scripts need 'unsafe-inline' (nonces would make every page
// dynamic). Allowed third parties: Google AdSense + Funding Choices (ads, consent) and Lemon Squeezy (card overlay).
const isDev = process.env.NODE_ENV !== "production";
const GOOGLE_ADS = [
  "https://pagead2.googlesyndication.com",
  "https://*.googlesyndication.com",
  "https://*.doubleclick.net",
  "https://*.google.com",
  "https://*.gstatic.com",
  "https://*.googleadservices.com",
  "https://*.adtrafficquality.google",
  "https://fundingchoicesmessages.google.com",
];
const LEMON = ["https://app.lemonsqueezy.com", "https://*.lemonsqueezy.com"];
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${[...GOOGLE_ADS, ...LEMON].join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  // data: lets qr-code-styling re-read an uploaded logo (a data URL) when it embeds it in the exported SVG
  `connect-src 'self' data:${isDev ? " ws:" : ""} ${[...GOOGLE_ADS, ...LEMON].join(" ")}`,
  `frame-src ${[...GOOGLE_ADS, ...LEMON].join(" ")}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; "); // HTTPS is already enforced by HSTS, so no upgrade-insecure-requests (it breaks http://localhost testing)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // NEXT_DIST_DIR lets a prod build (Lighthouse) live next to a running dev server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
    ];
  },
  experimental: {
    inlineCss: true,
    optimizePackageImports: ["framer-motion", "@react-three/drei"],
  },
};

export default withBundleAnalyzer(nextConfig);
