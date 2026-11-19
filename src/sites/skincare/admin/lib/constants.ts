import type { OrderStatus, PaymentMethod } from "@/sites/skincare/data/types";

/** Payment method colours, validated as a set for colour-blind separation (with labels always shown). */
export const PAYMENT_COLORS: Record<PaymentMethod, string> = {
  upi: "#1f8a65",
  card: "#4f74d9",
  netbanking: "#a24f9a",
  cod: "#d08419",
};

/** Orders page tab for each status, so charts and cards can link to the right list. */
export const STATUS_TAB: Record<OrderStatus, string> = {
  placed: "to-confirm",
  confirmed: "to-pack",
  packed: "to-ship",
  shipped: "in-transit",
  "out-for-delivery": "in-transit",
  delivered: "delivered",
  cancelled: "closed",
  returned: "closed",
};

/** Bar colours matching the status badge tones. */
export const STATUS_BAR: Record<OrderStatus, string> = {
  placed: "#0284c7",
  confirmed: "#0d9488",
  packed: "#d97706",
  shipped: "#7c3aed",
  "out-for-delivery": "#8b5cf6",
  delivered: "#059669",
  cancelled: "#a8a29e",
  returned: "#e11d48",
};
