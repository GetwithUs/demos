/** The demo sites, by the path segment each one lives under. */
export const DEMOS = {
  "dental-clinic": "dental clinic",
  skincare: "skincare",
} as const;

export type DemoSlug = keyof typeof DEMOS;

/** PostHog through the main site's proxy on the same origin (getwithus.in/gwr). */
const CAPTURE_URL = "/gwr/i/v0/e/";

/** getwithus.in or www.getwithus.in: where the main site (and its /gwr proxy) serves the demos. */
export function isMainSiteHost(hostname: string): boolean {
  return hostname === "getwithus.in" || hostname === "www.getwithus.in";
}

/**
 * Sends one anonymous `demo_visited` event per demo per browser tab session, which PostHog
 * turns into a "Someone visited the ... demo" message in Discord. No cookies, no person
 * profile, nothing else is tracked. Does nothing without a PostHog key (local development,
 * previews), outside getwithus.in (the proxy only exists there), or when the browser asks
 * not to be tracked.
 */
export function sendDemoVisit(demo: DemoSlug): void {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || typeof window === "undefined") return;
  if (!isMainSiteHost(window.location.hostname)) return;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (nav.doNotTrack === "1" || nav.globalPrivacyControl === true) return;

  const flag = `demo-visit:${demo}`;
  try {
    if (sessionStorage.getItem(flag)) return;
    sessionStorage.setItem(flag, "1");
  } catch {
    // Storage blocked: still count this visit once.
  }

  const body = JSON.stringify({
    api_key: key,
    event: "demo_visited",
    distinct_id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    properties: {
      demo,
      demo_name: DEMOS[demo],
      $process_person_profile: false,
      $current_url: window.location.href,
      $pathname: window.location.pathname,
      $referrer: document.referrer || "$direct",
    },
  });
  void fetch(CAPTURE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
