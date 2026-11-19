"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Address } from "@/sites/skincare/data/types";

export type SavedAddress = Address & { id: string; label: "Home" | "Work" | "Other" };

type PrefsState = {
  /** Addresses the shopper chose to save at checkout. */
  addresses: SavedAddress[];
  recentSearches: string[];
  /** Whether the shopper agreed to WhatsApp order updates at checkout. */
  whatsappUpdates: boolean;
  /** Newsletter sign-up (simulated). */
  newsletterEmail?: string;
  saveAddress: (address: Omit<SavedAddress, "id">) => void;
  removeAddress: (id: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  setWhatsappUpdates: (on: boolean) => void;
  subscribe: (email: string) => void;
};

function sameAddress(a: Address, b: Address): boolean {
  return a.line1.trim().toLowerCase() === b.line1.trim().toLowerCase() && a.pincode === b.pincode;
}

/**
 * Storefront preferences kept in this browser only (separate from the shared demo store, so
 * the owner dashboard is not affected). Loaded on mount by ShopEffects.
 */
export const useShopPrefs = create<PrefsState>()(
  persist(
    (set) => ({
      addresses: [],
      recentSearches: [],
      whatsappUpdates: false,
      saveAddress: (address) =>
        set((s) => {
          const rest = s.addresses.filter((a) => !sameAddress(a, address));
          return {
            addresses: [{ ...address, id: `addr-${Date.now().toString(36)}` }, ...rest].slice(0, 4),
          };
        }),
      removeAddress: (id) => set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),
      addRecentSearch: (query) =>
        set((s) => {
          const q = query.trim();
          if (!q) return s;
          return {
            recentSearches: [
              q,
              ...s.recentSearches.filter((x) => x.toLowerCase() !== q.toLowerCase()),
            ].slice(0, 5),
          };
        }),
      clearRecentSearches: () => set({ recentSearches: [] }),
      setWhatsappUpdates: (on) => set({ whatsappUpdates: on }),
      subscribe: (email) => set({ newsletterEmail: email }),
    }),
    {
      name: "oruvi-shop-prefs-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
