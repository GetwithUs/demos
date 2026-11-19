import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

/**
 * The demos are served on getwithus.in/demos through the main site, which sends its own
 * copies of these headers (GetwithUs/website, next.config.ts). Whichever copy wins, the
 * result must be the same, so these must match what the main site enforces.
 */
async function headersFor(path: string): Promise<Record<string, string>> {
  const rules = (await nextConfig.headers?.()) ?? [];
  const rule = rules.find((r) => r.source === "/:path*");
  expect(rule, `a rule covering ${path}`).toBeDefined();
  return Object.fromEntries(rule!.headers.map((h) => [h.key, h.value]));
}

describe("security headers match the main site's", () => {
  it("never allow framing", async () => {
    const h = await headersFor("/demos");
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
    const h = await headersFor("/demos");
    expect(h["Strict-Transport-Security"]).toBe("max-age=63072000; includeSubDomains; preload");
    expect(h["X-Content-Type-Options"]).toBe("nosniff");
    expect(h["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["X-Robots-Tag"]).toBe("noindex, nofollow");
  });
});
