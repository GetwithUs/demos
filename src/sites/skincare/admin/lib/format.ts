import type { Order, OrderStatus, PaymentMethod } from "@/sites/skincare/data/types";

/** Labels and number/date formatting for the owner dashboard. Dates are en-IN, money is rupees. */

export const STATUS_LABEL: Record<OrderStatus, string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  upi: "UPI",
  card: "Card",
  netbanking: "Net banking",
  cod: "Cash on delivery",
};

export const PAYMENT_SHORT: Record<PaymentMethod, string> = {
  upi: "UPI",
  card: "Card",
  netbanking: "Net banking",
  cod: "COD",
};

export const PAYMENT_METHODS: PaymentMethod[] = ["upi", "card", "netbanking", "cod"];

/** Payment status as the owner should read it (a cancelled COD order was never charged). */
export function paymentStatusLabel(order: Order): string {
  const { method, status } = order.payment;
  if (
    method === "cod" &&
    (order.status === "cancelled" || order.status === "returned") &&
    status !== "paid"
  ) {
    return "Not charged";
  }
  if (method === "cod" && status === "pending") return "To collect";
  if (status === "paid") return "Paid";
  if (status === "refunded") return "Refunded";
  return "Pending";
}

const dt = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-IN", options);
const DATE = dt({ day: "numeric", month: "short", year: "numeric" });
const DATE_SHORT = dt({ day: "numeric", month: "short" });
const DATE_TIME = dt({ day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
const DATE_TIME_YEAR = dt({
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});
const TIME = dt({ hour: "numeric", minute: "2-digit" });
const WEEKDAY_DATE = dt({ weekday: "short", day: "numeric", month: "short" });
const LONG_DATE = dt({ weekday: "long", day: "numeric", month: "long", year: "numeric" });

type DateInput = string | number | Date;
const toDate = (d: DateInput) => (d instanceof Date ? d : new Date(d));

/** "19 Nov 2026" */
export const formatDate = (d: DateInput) => DATE.format(toDate(d));
/** "19 Nov" */
export const formatDateShort = (d: DateInput) => DATE_SHORT.format(toDate(d));
/** "19 Nov, 4:35 pm" */
export const formatDateTime = (d: DateInput) => DATE_TIME.format(toDate(d));
/** "19 Nov 2026, 4:35 pm" */
export const formatDateTimeYear = (d: DateInput) => DATE_TIME_YEAR.format(toDate(d));
/** "4:35 pm" */
export const formatTime = (d: DateInput) => TIME.format(toDate(d));
/** "Thu, 19 Nov" */
export const formatWeekdayDate = (d: DateInput) => WEEKDAY_DATE.format(toDate(d));
/** "Thursday, 19 November 2026" */
export const formatLongDate = (d: DateInput) => LONG_DATE.format(toDate(d));

const NUM = new Intl.NumberFormat("en-IN");
const COMPACT_INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});
const INR_PAISE = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** "1,23,456" */
export const formatNumber = (n: number) => NUM.format(n);
/** "₹12.5K", for chart axes. */
export const formatCompactINR = (n: number) => COMPACT_INR.format(n);
/** "₹1,234.50", for the GST invoice. */
export const formatINRPaise = (n: number) => INR_PAISE.format(n);

/** n is already a percentage: 2.345 becomes "2.3%". */
export function formatPercent(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

/** "Just now", "12 min ago", "3 hours ago", "Yesterday", "4 days ago", then a date. */
export function relativeTime(d: DateInput, now: number): string {
  const t = toDate(d).getTime();
  const mins = Math.max(0, Math.round((now - t) / 60000));
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(t);
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${formatNumber(n)} ${n === 1 ? one : many}`;
}

/** First name, for greetings and messages. */
export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

/** Up to two initials for avatars. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (
    (parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "")
  ).toUpperCase();
}
