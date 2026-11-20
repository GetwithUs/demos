import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

// The matcher Next.js builds for custom routes, with the same options (no type declarations).
const { getPathMatch } = createRequire(import.meta.url)(
  "next/dist/shared/lib/router/utils/path-match",
) as {
  getPathMatch: (
    path: string,
    options: { strict: boolean; removeUnnamedParams: boolean },
  ) => (pathname: string) => false | Record<string, unknown>;
};

/**
 * The demos are served on getwithus.in/demos through the main site, which sends its own
 * copies of these headers (GetwithUs/website, next.config.ts). Whichever copy wins, the
 * result must be the same, so these pin the values the main site also sends; its
 * tests/unit/next-config.test.ts pins the same values on that side.
 */
async function headersFor(path: string): Promise<Record<string, string>> {
  const rules = (await nextConfig.headers?.()) ?? [];
  // Paths here are as the browser sees them; Next matches header sources under the basePath.
  const matching = rules.filter((r) =>
    getPathMatch(`${nextConfig.basePath}${r.source}`, { strict: true, removeUnnamedParams: true })(
      path,
    ),
  );
  expect(matching.length, `a rule covering ${path}`).toBeGreaterThan(0);
  return Object.fromEntries(matching.flatMap((r) => r.headers.map((h) => [h.key, h.value])));
}

describe("security headers the main site also sends", () => {
  it("never allow framing", async () => {
    const h = await headersFor("/demos/skincare/checkout");
    expect(h["X-Frame-Options"]).toBe("DENY");
    expect(h["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
    expect(h["Content-Security-Policy"]).toContain("frame-src 'none'");
  });

  it("allow only this origin for scripts, data, fonts and forms", async () => {
    const csp = (await headersFor("/demos"))["Content-Security-Policy"];
    for (const directive of [
      "default-src 'self'",
      "connect-src 'self'",
      "font-src 'self'",
      "img-src 'self' data: blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ]) {
      expect(csp).toContain(directive);
    }
    expect(csp).toMatch(/script-src 'self' 'unsafe-inline'(;| 'unsafe-eval';)/);
    expect(csp).not.toMatch(/https?:\/\//);
  });

  it("does not upgrade requests to HTTPS (it broke /demos through a plain-HTTP main site)", async () => {
    expect((await headersFor("/demos"))["Content-Security-Policy"]).not.toContain(
      "upgrade-insecure-requests",
    );
  });

  it("keep the other headers and stay out of search results", async () => {
    const h = await headersFor("/demos/skincare/checkout");
    expect(h["Strict-Transport-Security"]).toBe("max-age=63072000; includeSubDomains; preload");
    expect(h["X-Content-Type-Options"]).toBe("nosniff");
    expect(h["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["Permissions-Policy"]).toBe("camera=(), microphone=(), geolocation=()");
    expect(h["X-Robots-Tag"]).toBe("noindex, nofollow");
  });
});
