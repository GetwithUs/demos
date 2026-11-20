import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

// The matcher Next.js itself uses for rewrites (it ships without type declarations).
const { match } = createRequire(import.meta.url)("next/dist/compiled/path-to-regexp") as {
  match: <P extends object>(pattern: string) => (path: string) => false | { params: P };
};

/** The segment-prefetch rule, as Next applies it: under the basePath. */
async function segmentRule() {
  const rewrites = await nextConfig.rewrites?.();
  const before = (rewrites && !Array.isArray(rewrites) ? rewrites.beforeFiles : undefined) ?? [];
  const rule = before.find((r) => r.source.includes(".segments"));
  expect(rule).toBeDefined();
  return { ...rule!, matcher: match<{ path?: string[] }>(`${nextConfig.basePath}${rule!.source}`) };
}

describe("prefetches forwarded by getwithus.in", () => {
  it("map the main site's segment paths back to the page", async () => {
    const { matcher, destination } = await segmentRule();
    expect(destination).toBe("/:path*");
    const cases: [string, string][] = [
      ["/demos/skincare/shop.segments/_tree.segment.rsc", "skincare/shop"],
      ["/demos/dental-clinic/treatments.segments/_tree.segment.rsc", "dental-clinic/treatments"],
      [
        "/demos/skincare/products/vitamin-c-15-brightening-serum.segments/__PAGE__.segment.rsc",
        "skincare/products/vitamin-c-15-brightening-serum",
      ],
    ];
    for (const [path, page] of cases) {
      const result = matcher(path);
      expect(result && result.params.path?.join("/"), path).toBe(page);
    }
  });

  it("leave ordinary pages and files alone", async () => {
    const { matcher } = await segmentRule();
    for (const path of ["/demos/skincare/shop", "/demos/_next/static/chunks/app.js", "/demos"]) {
      expect(matcher(path), path).toBe(false);
    }
  });
});

describe("visit counting", () => {
  it("only runs where the main site's proxy exists", async () => {
    const { isMainSiteHost } = await import("@/lib/demo-visit");
    expect(isMainSiteHost("getwithus.in")).toBe(true);
    expect(isMainSiteHost("www.getwithus.in")).toBe(true);
    for (const host of [
      "demos-blond-pi.vercel.app",
      "localhost",
      "notgetwithus.in",
      "getwithusxin",
    ]) {
      expect(isMainSiteHost(host), host).toBe(false);
    }
  });
});
