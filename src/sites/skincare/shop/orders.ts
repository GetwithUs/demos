import type { Order, OrderStatus, PaymentMethod } from "@/sites/skincare/data/types";
import { checkPincode, formatDeliveryDate } from "@/sites/skincare/lib/pincode";
import { STATUS_FLOW } from "@/sites/skincare/lib/seed";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  placed: "Order placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

export const STATUS_HINT: Record<OrderStatus, string> = {
  placed: "We have received your order.",
  confirmed: "Your order is confirmed and queued for packing.",
  packed: "Packed with care at our Dehradun warehouse.",
  shipped: "Handed to the courier.",
  "out-for-delivery": "Your parcel is with the delivery partner today.",
  delivered: "Delivered. Enjoy your new routine!",
  cancelled: "This order was cancelled.",
  returned: "This order was returned.",
};

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  upi: "UPI",
  card: "Credit or debit card",
  netbanking: "Net banking",
  cod: "Cash on delivery",
};

export { STATUS_FLOW };

/** Orders can be cancelled until they leave the warehouse. */
export function canCancel(order: Order): boolean {
  return order.status === "placed" || order.status === "confirmed" || order.status === "packed";
}

/** The newest order placed in this browser (not the dashboard's sample orders). */
export function latestVisitorOrder(orders: Order[]): Order | undefined {
  return orders
    .filter((o) => o.source === "visitor")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
}

/** Expected delivery date for an order, from its pincode and the day it was placed. */
export function expectedDelivery(order: Order): string | undefined {
  const r = checkPincode(order.address.pincode, new Date(order.createdAt));
  return r.ok ? formatDeliveryDate(r.by) : undefined;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "19 Nov 2026, 4:05 pm" in the browser's time zone. Call only on the client. */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${h % 12 || 12}:${m} ${h < 12 ? "am" : "pm"}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "4:05 pm" */
export function formatTime(date: Date): string {
  const h = date.getHours();
  return `${h % 12 || 12}:${String(date.getMinutes()).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
}

/** Normalises what a shopper types ("orv 41207", "41207") into an order ID. */
export function normaliseOrderId(input: string): string {
  const digits = input.replace(/\D/g, "");
  return digits ? `ORV-${digits.slice(0, 5)}` : "";
}
