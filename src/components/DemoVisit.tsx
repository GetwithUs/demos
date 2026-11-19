"use client";

import { useEffect } from "react";
import { sendDemoVisit, type DemoSlug } from "@/lib/demo-visit";

/** Counts one visit to a demo (see sendDemoVisit). Renders nothing. */
export default function DemoVisit({ demo }: { demo: DemoSlug }) {
  useEffect(() => sendDemoVisit(demo), [demo]);
  return null;
}
