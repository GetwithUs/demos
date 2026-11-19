import { describe, expect, it } from "vitest";
import { PRODUCTS } from "@/sites/skincare/data/products";
import type { Order } from "@/sites/skincare/data/types";
import { makeSeedOrders } from "@/sites/skincare/lib/seed";
import { amountInWords, gstSplit, invoiceNumber } from "@/sites/skincare/admin/lib/gst";
import { whatsappMessage } from "@/sites/skincare/admin/lib/messages";
import {
  categorySales,
  computeKpis,
  couponStats,
  customerKey,
  deriveCustomers,
  funnel,
  inPeriod,
  isSale,
  niceMax,
  paymentSplit,
  rangeWindow,
  revenueOf,
  seriesFor,
  sessionsFor,
  statusCounts,
} from "@/sites/skincare/admin/lib/metrics";
import { slugify, validateVariant, variantId } from "@/sites/skincare/admin/lib/product-form";

const NOW = new Date("2026-11-19T18:30:00").getTime();
const orders = makeSeedOrders(new Date(NOW));

describe("date ranges", () => {
  it("covers the last 7 calendar days including today and compares with the 7 before", () => {
    const w = rangeWindow("7d", NOW);
    expect(w.buckets).toHaveLength(7);
    expect(new Date(w.buckets[6].start).getDate()).toBe(19);
    expect(w.period.end).toBe(w.buckets[6].end);
    expect(w.prevPeriod.end).toBe(w.period.start);
    expect(w.prevBuckets).toHaveLength(7);
  });

  it("splits today into 24 hours and stops the line at the current hour", () => {
    const w = rangeWindow("today", NOW);
    expect(w.buckets).toHaveLength(24);
    expect(w.lastIndex).toBe(18);
    // Yesterday is compared up to the same time of day.
    expect(w.prevPeriod.end - w.prevPeriod.start).toBeCloseTo(NOW - w.period.start, -3);
  });
});

describe("overview numbers agree with each other", () => {
  const w = rangeWindow("30d", NOW);
  const k = computeKpis(orders, w.period, NOW);
  const inRange = orders.filter((o) => inPeriod(o, w.period));

  it("counts the sample orders placed in the last 30 days", () => {
    expect(inRange.length).toBeGreaterThan(0);
    expect(inRange.length).toBeLessThan(orders.length);
    expect(k.orders).toBe(inRange.length);
  });

  it("has an earlier 30 days to compare with", () => {
    expect(orders.some((o) => inPeriod(o, w.prevPeriod))).toBe(true);
  });

  it("revenue equals the daily chart total and excludes cancelled and returned orders", () => {
    const series = seriesFor(orders, w.buckets);
    expect(series.reduce((s, p) => s + p.revenue, 0)).toBe(k.revenue);
    expect(series.reduce((s, p) => s + p.orders, 0)).toBe(k.orders);
    expect(k.revenue).toBe(inRange.filter(isSale).reduce((s, o) => s + o.totals.total, 0));
    expect(k.aov).toBe(Math.round(k.revenue / k.saleOrders));
  });

  it("status and payment splits add up to the order count", () => {
    const statuses = statusCounts(inRange);
    expect(Object.values(statuses).reduce((a, b) => a + b, 0)).toBe(k.orders);
    const pay = paymentSplit(inRange);
    expect(pay.reduce((s, p) => s + p.orders, 0)).toBe(k.orders);
    expect(pay.reduce((s, p) => s + p.revenue, 0)).toBe(k.revenue);
  });

  it("made-up sessions are stable and give a believable conversion rate", () => {
    expect(sessionsFor(orders, w.period, NOW)).toBe(k.sessions);
    expect(k.conversion).toBeGreaterThan(1);
    expect(k.conversion).toBeLessThan(4);
  });

  it("funnel narrows at every step and ends with the real order count", () => {
    const steps = funnel(orders, w.period, NOW);
    for (let i = 1; i < steps.length; i++)
      expect(steps[i].value).toBeLessThanOrEqual(steps[i - 1].value);
    expect(steps.at(-1)).toMatchObject({ value: inRange.length, real: true });
    expect(steps[0].value).toBe(k.sessions);
  });

  it("category sales match product line totals", () => {
    const lines = orders
      .filter(isSale)
      .flatMap((o) => o.items)
      .reduce((s, i) => s + i.price * i.qty, 0);
    expect(categorySales(orders, PRODUCTS).reduce((s, c) => s + c.revenue, 0)).toBe(lines);
  });
});

describe("customers and discounts", () => {
  it("every order belongs to exactly one customer and spend adds up", () => {
    const customers = deriveCustomers(orders);
    expect(customers.reduce((s, c) => s + c.orders.length, 0)).toBe(orders.length);
    expect(customers.reduce((s, c) => s + c.spent, 0)).toBe(revenueOf(orders));
    const keys = new Set(orders.map((o) => customerKey(o.address)));
    expect(customers).toHaveLength(keys.size);
  });

  it("coupon usage comes from the orders", () => {
    const stats = couponStats(orders);
    const used = orders.filter((o) => o.totals.couponCode).length;
    expect(stats.reduce((s, c) => s + c.uses, 0)).toBe(used);
  });
});

describe("GST invoice", () => {
  const base = orders.find((o) => o.address.state !== "Uttarakhand")!;
  const local: Order = { ...base, address: { ...base.address, state: "Uttarakhand" } };

  it("uses IGST outside Uttarakhand and CGST plus SGST inside", () => {
    const inter = gstSplit(base);
    expect(inter.kind).toBe("inter");
    expect(inter.taxable + (inter.kind === "inter" ? inter.igst : 0)).toBe(base.totals.total);
    const intra = gstSplit(local);
    expect(intra.kind).toBe("intra");
    if (intra.kind === "intra") expect(intra.cgst + intra.sgst).toBe(local.totals.gstIncluded);
  });

  it("numbers invoices by Indian financial year", () => {
    expect(invoiceNumber({ ...base, id: "ORV-41237", createdAt: "2026-11-19T10:00:00" })).toBe(
      "OS/26-27/41237",
    );
    expect(invoiceNumber({ ...base, id: "ORV-41237", createdAt: "2027-02-01T10:00:00" })).toBe(
      "OS/26-27/41237",
    );
  });

  it("writes amounts in Indian words", () => {
    expect(amountInWords(1375)).toBe("Rupees One Thousand Three Hundred and Seventy Five only");
    expect(amountInWords(123456)).toBe(
      "Rupees One Lakh Twenty Three Thousand Four Hundred and Fifty Six only",
    );
    expect(amountInWords(10000000)).toBe("Rupees One Crore only");
    expect(amountInWords(0)).toBe("Rupees Zero only");
  });
});

describe("product form rules", () => {
  it("rejects a price above the MRP and bad stock", () => {
    const e = validateVariant({ id: "a", size: "30 ml", price: "699", mrp: "649", stock: "-1" });
    expect(e.price).toMatch(/cannot be more than the MRP/);
    expect(e.stock).toBeDefined();
    expect(
      validateVariant({ id: "a", size: "30 ml", price: "599", mrp: "649", stock: "12" }),
    ).toEqual({});
  });

  it("makes clean slugs and unique size ids", () => {
    expect(slugify("Vitamin C 15% Serum!")).toBe("vitamin-c-15-serum");
    expect(variantId("30 ml", [])).toBe("30ml");
    expect(variantId("30 ml", ["30ml"])).toBe("30ml-2");
  });

  it("rounds axis maximums to clean numbers", () => {
    expect(niceMax(1730)).toBe(2000);
    expect(niceMax(2300)).toBe(2500);
    expect(niceMax(0)).toBe(1);
  });
});

describe("WhatsApp preview", () => {
  it("mentions the courier and AWB once shipped and uses no long dashes", () => {
    const shipped = orders.find((o) => o.status === "shipped")!;
    const text = whatsappMessage(shipped);
    expect(text).toContain(shipped.courier!);
    expect(text).toContain(shipped.awb!);
    for (const o of orders) expect(whatsappMessage(o)).not.toMatch(/[\u2013\u2014]/);
  });
});

describe("sample data looks like a real young brand", () => {
  const pct = (a: number, b: number) => ((a - b) / b) * 100;
  for (const range of ["7d", "30d"] as const) {
    it(`grows steadily and has a typical repeat rate over ${range}`, () => {
      const w = rangeWindow(range, NOW);
      const now = computeKpis(orders, w.period, NOW);
      const before = computeKpis(orders, w.prevPeriod, NOW);
      expect(pct(now.revenue, before.revenue)).toBeGreaterThan(0);
      expect(pct(now.revenue, before.revenue)).toBeLessThan(60);
      expect(now.returningRate).toBeGreaterThan(15);
      expect(now.returningRate).toBeLessThan(45);
    });
  }
});
