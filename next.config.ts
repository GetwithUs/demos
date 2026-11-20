import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * The main site's security headers (GetwithUs/website, next.config.ts and
 * docs/decisions/0002-security-headers.md), minus what only the main site needs. These pages
 * are served on getwithus.in/demos through that site, which adds its own copies of these
 * headers, and which copy wins depends on the platform (with next dev or next start, this
 * app's replace the main site's). So both must allow the same things; change them together.
 * tests/security-headers.test.ts checks the parts that matter.
 *
 * Two deliberate differences from the main site:
 * - No Cloudflare Turnstile sources: nothing here uses it.
 * - No upgrade-insecure-requests: every file comes from this origin by relative URL, so on
 *   HTTPS it would change nothing, and it broke /demos through a main site running on plain
 *   HTTP (local development, or a phone on the local network), which fetches these pages
 *   from the live demos app by default.
 *
 * Everything is self-hosted (fonts through next/font, photos imported from src), so the
 * policy allows this origin only; "self" is getwithus.in there, and visit counts go to the
 * main site's /gwr proxy. worker-src only mirrors the main site; nothing here uses workers.
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
  async rewrites() {
    return {
      beforeFiles: [
        // Prefetches through getwithus.in. The main site uses Partial Prerendering, so on
        // Vercel it turns a segment prefetch (the Next-Router-Segment-Prefetch header) into
        // a path like /demos/shop.segments/_tree.segment.rsc before forwarding it here. This
        // app has no such files, so map the path back to the page; the header still comes
        // along, and the page answers it as it does a direct prefetch. Without this every
        // prefetch through the main site was a 404 and links lost their instant navigation.
        { source: "/:path*.segments/:segment*", destination: "/:path*" },
      ],
      afterFiles: [],
      fallback: [],
    };
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
