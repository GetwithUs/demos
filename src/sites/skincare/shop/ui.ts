"use client";

import { create } from "zustand";

export type ShopPanel = "cart" | "menu" | "search" | null;

type Toast = { id: number; message: string };

type ShopUIState = {
  /** Which drawer or overlay is open. Only one at a time. */
  panel: ShopPanel;
  /** Last pincode the shopper checked, reused on other product pages and at checkout. */
  pincode: string;
  toasts: Toast[];
  open: (panel: Exclude<ShopPanel, null>) => void;
  close: () => void;
  setPincode: (pincode: string) => void;
  toast: (message: string) => void;
  dismissToast: (id: number) => void;
};

let toastId = 0;

/** Storefront UI state that is not saved: drawers and small notices. The chat has its own store (chat.ts). */
export const useShopUI = create<ShopUIState>((set, get) => ({
  panel: null,
  pincode: "",
  toasts: [],
  open: (panel) => set({ panel }),
  close: () => set({ panel: null }),
  setPincode: (pincode) => set({ pincode }),
  toast: (message) => {
    const id = ++toastId;
    set({ toasts: [...get().toasts.slice(-2), { id, message }] });
    setTimeout(() => get().dismissToast(id), 3200);
  },
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
