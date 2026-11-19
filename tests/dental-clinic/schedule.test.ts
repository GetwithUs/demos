import { describe, expect, it } from "vitest";
import { formatINR, formatTime } from "@/sites/dental-clinic/lib/format";
import {
  groupSlots,
  openStatus,
  slotsForDay,
  upcomingDays,
} from "@/sites/dental-clinic/lib/schedule";

describe("formatINR", () => {
  it("uses Indian digit grouping", () => {
    expect(formatINR(120000)).toBe("₹1,20,000");
    expect(formatINR(4500)).toBe("₹4,500");
  });
});

describe("formatTime", () => {
  it("turns 24-hour times into am and pm", () => {
    expect(formatTime("10:00")).toBe("10:00 am");
    expect(formatTime("17:30")).toBe("5:30 pm");
    expect(formatTime("12:00")).toBe("12:00 pm");
  });
});

describe("upcomingDays", () => {
  // Thursday 19 November 2026, 9:00 am local time.
  const now = new Date(2026, 10, 19, 9, 0);

  it("lists 14 days starting today, with Sunday on reduced hours", () => {
    const days = upcomingDays(now, 14);
    expect(days).toHaveLength(14);
    expect(days[0]).toMatchObject({
      iso: "2026-11-19",
      isToday: true,
      open: "10:00",
      close: "20:00",
    });
    const sunday = days.find((d) => d.weekday === 0);
    expect(sunday).toMatchObject({ iso: "2026-11-22", close: "14:00", reducedHours: true });
  });

  it("marks days when the chosen dentist is not in", () => {
    const days = upcomingDays(now, 7, [1, 3, 5]);
    expect(
      days
        .filter((d) => d.available)
        .map((d) => d.weekday)
        .sort(),
    ).toEqual([1, 3, 5]);
  });
});

describe("slotsForDay", () => {
  const now = new Date(2026, 10, 19, 13, 10);
  const [today, tomorrow] = upcomingDays(now, 2);

  it("gives half-hour slots inside opening hours", () => {
    const slots = slotsForDay(tomorrow, now);
    expect(slots[0].time).toBe("10:00");
    expect(slots.at(-1)?.time).toBe("19:30");
    expect(slots).toHaveLength(20);
  });

  it("is stable, so the same slots always show as booked", () => {
    expect(slotsForDay(tomorrow, now)).toEqual(slotsForDay(tomorrow, now));
    expect(slotsForDay(tomorrow, now).some((s) => s.status === "booked")).toBe(true);
  });

  it("needs an hour's notice for same-day slots", () => {
    const slots = slotsForDay(today, now);
    expect(
      slots
        .filter((s) => s.status === "past")
        .map((s) => s.time)
        .at(-1),
    ).toBe("14:00");
  });

  it("groups slots into morning, afternoon and evening", () => {
    expect(groupSlots(slotsForDay(tomorrow, now)).map((g) => g.label)).toEqual([
      "Morning",
      "Afternoon",
      "Evening",
    ]);
  });
});

describe("openStatus", () => {
  it("works in Indian time", () => {
    // 06:30 UTC on a Thursday is 12:00 noon in India.
    expect(openStatus(new Date(Date.UTC(2026, 10, 19, 6, 30)))).toEqual({
      open: true,
      text: "Open now, until 8:00 pm",
    });
    // 15:00 UTC on a Thursday is 8:30 pm in India.
    expect(openStatus(new Date(Date.UTC(2026, 10, 19, 15, 0))).text).toBe(
      "Closed now, opens tomorrow at 10:00 am",
    );
    // 09:00 UTC on a Sunday is 2:30 pm in India, after Sunday closing.
    expect(openStatus(new Date(Date.UTC(2026, 10, 22, 9, 0))).text).toBe(
      "Closed now, opens tomorrow at 10:00 am",
    );
  });
});
