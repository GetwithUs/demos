import { createRequire } from "node:module";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isMainSiteHost, sendDemoVisit } from "@/lib/demo-visit";
import nextConfig from "../next.config";

// The matcher Next.js builds for every custom rewrite (server/lib/router-utils/filesystem.js),
// with the same options. It ships without type declarations.
const { getPathMatch } = createRequire(import.meta.url)(
  "next/dist/shared/lib/router/utils/path-match",
) as {
  getPathMatch: (
    path: string,
    options: { strict: boolean; removeUnnamedParams: boolean },
  ) => (pathname: string) => false | { path?: string[] };
};

/** The segment-prefetch rule, matched as Next matches it: under the basePath. */
async function segmentRule() {
  const rewrites = await nextConfig.rewrites?.();
  const before = (rewrites && !Array.isArray(rewrites) ? rewrites.beforeFiles : undefined) ?? [];
  const rule = before.find((r) => r.source.includes(".segments"));
  expect(rule).toBeDefined();
  const matcher = getPathMatch(`${nextConfig.basePath}${rule!.source}`, {
    strict: true,
    removeUnnamedParams: true,
  });
  return { ...rule!, matcher };
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
      expect(result && result.path?.join("/"), path).toBe(page);
    }
  });

  it("apply only to RSC requests, so a .segments address is never a second URL for a page", async () => {
    const { has } = await segmentRule();
    expect(has).toEqual([{ type: "header", key: "rsc", value: "1" }]);
  });

  it("leave ordinary pages and files alone", async () => {
    const { matcher } = await segmentRule();
    for (const path of ["/demos/skincare/shop", "/demos/_next/static/chunks/app.js", "/demos"]) {
      expect(matcher(path), path).toBe(false);
    }
  });
});

describe("visit counting", () => {
  const fetchMock = vi.fn(() => Promise.resolve(new Response(null)));

  function visitFrom(hostname: string) {
    const stored = new Map<string, string>();
    vi.stubGlobal("window", {
      location: {
        hostname,
        href: `https://${hostname}/demos/skincare`,
        pathname: "/demos/skincare",
      },
    });
    vi.stubGlobal("navigator", {});
    vi.stubGlobal("document", { referrer: "" });
    vi.stubGlobal("sessionStorage", {
      getItem: (k: string) => stored.get(k) ?? null,
      setItem: (k: string, v: string) => void stored.set(k, v),
    });
    vi.stubGlobal("fetch", fetchMock);
  }

  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test");
    fetchMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("knows only the bare main-site domain", () => {
    expect(isMainSiteHost("getwithus.in")).toBe(true);
    for (const host of [
      "www.getwithus.in",
      "demos-blond-pi.vercel.app",
      "localhost",
      "notgetwithus.in",
    ]) {
      expect(isMainSiteHost(host), host).toBe(false);
    }
  });

  it("sends one visit per demo per tab on getwithus.in", () => {
    visitFrom("getwithus.in");
    sendDemoVisit("skincare");
    sendDemoVisit("skincare");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "/gwr/i/v0/e/",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("sends nothing anywhere else, where the proxy does not exist", () => {
    for (const host of ["demos-blond-pi.vercel.app", "localhost"]) {
      visitFrom(host);
      sendDemoVisit("dental-clinic");
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
