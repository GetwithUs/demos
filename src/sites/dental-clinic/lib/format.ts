const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Formats rupees the Indian way, as in "₹1,25,000". */
export function formatINR(amount: number): string {
  return inr.format(amount);
}

const dayLong = new Intl.DateTimeFormat("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
});
const dayShort = new Intl.DateTimeFormat("en-IN", { weekday: "short" });
const dayNumber = new Intl.DateTimeFormat("en-IN", { day: "numeric" });
const monthShort = new Intl.DateTimeFormat("en-IN", { month: "short" });

/** Turns "2026-11-27" into a Date at local midnight. */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Local calendar date as "YYYY-MM-DD". */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** "Thursday, 27 November" */
export function formatDayLong(iso: string): string {
  return dayLong.format(parseISODate(iso));
}

export function formatDayParts(iso: string): { weekday: string; day: string; month: string } {
  const date = parseISODate(iso);
  return {
    weekday: dayShort.format(date),
    day: dayNumber.format(date),
    month: monthShort.format(date),
  };
}

/** "17:30" to "5:30 pm" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Minutes since midnight for "HH:MM". */
export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
