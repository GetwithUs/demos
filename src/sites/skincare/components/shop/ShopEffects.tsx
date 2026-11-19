"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useShopPrefs } from "@/sites/skincare/shop/prefs";
import { useShopUI } from "@/sites/skincare/shop/ui";

/** Loads storefront preferences saved in this browser. Renders nothing. */
export function ShopEffects() {
  useEffect(() => {
    void useShopPrefs.persist.rehydrate();
  }, []);
  return null;
}

/**
 * Short confirmations ("Saved to your wishlist"), announced to screen readers. Shown as a
 * popover so they sit above an open cart drawer too (both live in the browser's top layer).
 */
export function Toaster() {
  const toasts = useShopUI((s) => s.toasts);
  const dismiss = useShopUI((s) => s.dismissToast);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof el.showPopover !== "function") return;
    if (el.matches(":popover-open")) el.hidePopover();
    // Re-show on every change so the newest toast is above any drawer opened since.
    if (toasts.length) el.showPopover();
  }, [toasts]);

  return (
    <>
      <p className="sr-only" aria-live="polite">
        {toasts[toasts.length - 1]?.message}
      </p>
      <div
        ref={ref}
        popover="manual"
        className="pointer-events-none fixed inset-x-0 top-auto bottom-24 m-0 hidden w-full flex-col items-center gap-2 border-0 bg-transparent p-0 px-4 open:flex sm:bottom-8"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex max-w-md animate-skin-fade-up items-center gap-3 rounded-full bg-skin-ink py-2.5 pr-2.5 pl-5 text-sm text-white shadow-xl"
          >
            <span>{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="grid size-6 place-items-center rounded-full hover:bg-white/15"
              aria-label="Dismiss"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
