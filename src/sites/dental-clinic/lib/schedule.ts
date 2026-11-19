import { HOURS, type DayHours } from "@/sites/dental-clinic/content/clinic";
import { toISODate, toMinutes, formatTime } from "@/sites/dental-clinic/lib/format";

export const SLOT_MINUTES = 30;

export function hoursForDay(day: number): DayHours {
  return HOURS.find((h) => h.day === day) ?? HOURS[0];
}

export type BookableDay = {
  iso: string;
  weekday: number;
  isToday: boolean;
  open: string;
  close: string;
  /** False when the chosen dentist is not in the studio that day. */
  available: boolean;
  reducedHours: boolean;
};

/** The next `count` calendar days, starting today, with the studio's hours for each. */
export function upcomingDays(now: Date, count: number, doctorDays?: number[]): BookableDay[] {
  const days: BookableDay[] = [];
  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const weekday = date.getDay();
    const hours = hoursForDay(weekday);
    days.push({
      iso: toISODate(date),
      weekday,
      isToday: i === 0,
      open: hours.open ?? "10:00",
      close: hours.close ?? "14:00",
      available: hours.open !== null && (!doctorDays || doctorDays.includes(weekday)),
      reducedHours: weekday === 0,
    });
  }
  return days;
}

export type Slot = { time: string; status: "free" | "booked" | "past" };

/** A small, stable hash so the same day always shows the same "already booked" slots. */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Half-hour slots for a day. Some are shown as already booked so the calendar feels real. */
export function slotsForDay(day: BookableDay, now: Date, doctorId?: string): Slot[] {
  const slots: Slot[] = [];
  const start = toMinutes(day.open);
  const end = toMinutes(day.close);
  // Same-day bookings need at least an hour's notice.
  const earliestToday = now.getHours() * 60 + now.getMinutes() + 60;
  const busyShare = doctorId ? 38 : 28;
  for (let m = start; m + SLOT_MINUTES <= end; m += SLOT_MINUTES) {
    const time = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    let status: Slot["status"] = "free";
    if (day.isToday && m < earliestToday) status = "past";
    else if (hash(`${day.iso}|${time}|${doctorId ?? "any"}`) % 100 < busyShare) status = "booked";
    slots.push({ time, status });
  }
  return slots;
}

export function groupSlots(slots: Slot[]): { label: string; slots: Slot[] }[] {
  const groups = [
    { label: "Morning", slots: slots.filter((s) => toMinutes(s.time) < 12 * 60) },
    {
      label: "Afternoon",
      slots: slots.filter((s) => toMinutes(s.time) >= 12 * 60 && toMinutes(s.time) < 17 * 60),
    },
    { label: "Evening", slots: slots.filter((s) => toMinutes(s.time) >= 17 * 60) },
  ];
  return groups.filter((g) => g.slots.length > 0);
}

/** The current weekday and minutes past midnight in India, wherever the visitor is. */
export function istNow(date: Date): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    day: Math.max(0, days.indexOf(get("weekday"))),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export type OpenStatus = { open: boolean; text: string };

/** "Open now, until 8:00 pm" or "Closed now, opens Monday at 10:00 am". */
export function openStatus(date: Date): OpenStatus {
  const { day, minutes } = istNow(date);
  const today = hoursForDay(day);
  if (today.open && today.close) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);
    if (minutes >= open && minutes < close) {
      return { open: true, text: `Open now, until ${formatTime(today.close)}` };
    }
    if (minutes < open) {
      return { open: false, text: `Closed now, opens today at ${formatTime(today.open)}` };
    }
  }
  for (let i = 1; i <= 7; i++) {
    const next = hoursForDay((day + i) % 7);
    if (next.open) {
      const when = i === 1 ? "tomorrow" : next.label;
      return { open: false, text: `Closed now, opens ${when} at ${formatTime(next.open)}` };
    }
  }
  return { open: false, text: "Closed now" };
}
