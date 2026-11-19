import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * The same security headers as the main site (GetwithUs/website, next.config.ts and
 * docs/decisions/0002-security-headers.md). These pages are served on getwithus.in/demos
 * through that site, which adds its own copies of these headers; which copy wins depends on
 * the platform, so the two sets must stay identical. Change both together.
 *
 * Everything is self-hosted (fonts through next/font, photos imported from src), so the
 * policy allows this origin only; "self" is getwithus.in there, and visit counts go to the
 * main site's /gwr proxy.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // HTTPS only on Vercel, so `next start` on plain-HTTP localhost keeps working.
  ...(process.env.VERCEL === "1" ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  // Served from the main site at getwithus.in/demos (Next.js multi-zones).
  basePath: "/demos",
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      // This project's own address (outside getwithus.in) opens on the demos index, not a 404.
      { source: "/", destination: "/demos", basePath: false, permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          // Demo businesses are not real: keep every page out of search results.
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
