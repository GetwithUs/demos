import { describe, expect, it } from "vitest";
import { PRODUCTS } from "@/sites/skincare/data/products";
import { checkPincode } from "@/sites/skincare/lib/pincode";
import {
  checkCoupon,
  computeTotals,
  discountPercent,
  formatINR,
  resolveItems,
} from "@/sites/skincare/lib/pricing";
import { makeSeedOrders, SEED_ORDER_COUNT } from "@/sites/skincare/lib/seed";

const items = (lines: { slug: string; variantId: string; qty: number }[]) =>
  resolveItems(lines, PRODUCTS);
const serum = { slug: "niacinamide-10-clarifying-serum", variantId: "30ml", qty: 1 }; // ₹599
const balm = { slug: "spf30-lip-balm", variantId: "4.5g", qty: 1 }; // ₹249

describe("computeTotals", () => {
  it("charges delivery below ₹499 and shows how much is left for free delivery", () => {
    const t = computeTotals(items([balm]));
    expect(t.subtotal).toBe(249);
    expect(t.shipping).toBe(49);
    expect(t.freeShippingGap).toBe(250);
    expect(t.total).toBe(298);
  });

  it("delivers free from ₹499 and adds the cash on delivery fee", () => {
    const t = computeTotals(items([serum]), { payment: "cod" });
    expect(t.shipping).toBe(0);
    expect(t.codFee).toBe(40);
    expect(t.prepaidDiscount).toBe(0);
    expect(t.total).toBe(639);
  });

  it("takes 5% off for paying online, capped at ₹100", () => {
    expect(computeTotals(items([serum]), { payment: "upi" }).prepaidDiscount).toBe(30);
    const big = computeTotals(items([{ ...serum, qty: 4 }]), { payment: "card" });
    expect(big.prepaidDiscount).toBe(100);
  });

  it("applies coupons with their caps and rules", () => {
    const cart = items([serum, balm]);
    const glow = checkCoupon("glow10", cart, { isFirstOrder: false });
    expect(glow.ok).toBe(true);
    if (glow.ok) expect(computeTotals(cart, { coupon: glow.coupon }).couponDiscount).toBe(85);
    expect(checkCoupon("DUO150", items([serum]), { isFirstOrder: true }).ok).toBe(false);
    expect(checkCoupon("FIRST15", cart, { isFirstOrder: true }).ok).toBe(false);
    expect(checkCoupon("NOPE", cart, { isFirstOrder: true })).toEqual({
      ok: false,
      reason: "This code is not valid.",
    });
  });

  it("includes 18% GST in the total", () => {
    expect(computeTotals(items([{ ...serum, qty: 2 }])).gstIncluded).toBe(
      Math.round((1198 * 18) / 118),
    );
  });
});

describe("helpers", () => {
  it("formats rupees the Indian way", () => {
    expect(formatINR(124999)).toBe("₹1,24,999");
    expect(discountPercent(599, 649)).toBe(8);
  });

  it("checks pincodes", () => {
    const from = new Date("2026-11-19T10:00:00+05:30");
    const ddn = checkPincode("248001", from);
    expect(ddn.ok && ddn.city).toBe("Dehradun");
    expect(checkPincode("12345", from).ok).toBe(false);
    const portBlair = checkPincode("744101", from);
    expect(portBlair.ok && portBlair.cod).toBe(false);
  });

  it("makes the same sample orders every time", () => {
    const now = new Date("2026-11-19T12:00:00Z");
    const a = makeSeedOrders(now);
    expect(a).toHaveLength(SEED_ORDER_COUNT);
    expect(makeSeedOrders(now).map((o) => o.id)).toEqual(a.map((o) => o.id));
    expect(a.every((o) => o.totals.total > 0 && o.items.length > 0)).toBe(true);
  });
});
