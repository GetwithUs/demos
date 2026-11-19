"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { Order } from "@/sites/skincare/data/types";
import { useDemoStore, useStoreHydrated } from "@/sites/skincare/lib/store";

/* A shared clock that ticks every 30 seconds, so "today" and "5 min ago" stay current. */
let nowCache = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribeNow(onChange: () => void): () => void {
  listeners.add(onChange);
  if (!timer) {
    timer = setInterval(() => {
      nowCache = Date.now();
      for (const l of listeners) l();
    }, 30_000);
  }
  return () => {
    listeners.delete(onChange);
    if (!listeners.size && timer) {
      clearInterval(timer);
      timer = undefined;
      nowCache = 0;
    }
  };
}

function getNow(): number {
  if (!nowCache) nowCache = Date.now();
  return nowCache;
}

/** The current time in ms (0 on the server; render time-based UI only once the store is ready). */
export function useNow(): number {
  return useSyncExternalStore(subscribeNow, getNow, () => 0);
}

/** True once saved data has loaded and the sample orders exist; show skeletons until then. */
export function useAdminReady(): boolean {
  const hydrated = useStoreHydrated();
  const seeded = useDemoStore((s) => s.seeded);
  return hydrated && seeded;
}

/** Every order, newest first. */
export function useOrders(): Order[] {
  const orders = useDemoStore((s) => s.orders);
  return useMemo(
    () => [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [orders],
  );
}
