"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * False during server rendering and hydration, true afterwards. For small bits of UI that
 * depend on the visitor's clock, so the server HTML and the first browser render always match.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
