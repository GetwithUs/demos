"use client";

import { useEffect } from "react";
import { hydrateDemoStore, useDemoStore } from "@/sites/skincare/lib/store";

/**
 * Loads the shopper's saved cart, orders and the owner's changes, and keeps every open tab in
 * step: an order placed in the shop appears in the dashboard, and a price changed in the
 * dashboard appears in the shop, without a reload. Render once in the skincare layout.
 */
export default function StoreHydrator() {
  useEffect(() => {
    void hydrateDemoStore();
    const key = useDemoStore.persist.getOptions().name;
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) void useDemoStore.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return null;
}
