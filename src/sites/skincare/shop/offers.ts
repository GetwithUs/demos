import { COUPONS, SHIPPING } from "@/sites/skincare/data/catalog";
import type { OrderItem, Product, Variant } from "@/sites/skincare/data/types";
import { checkCoupon, computeTotals } from "@/sites/skincare/lib/pricing";

/** One product size as a cart line, for working out offers. */
export function asItem(product: Product, variant: Variant, qty = 1): OrderItem {
  return {
    slug: product.slug,
    variantId: variant.id,
    name: product.name,
    size: variant.size,
    price: variant.price,
    mrp: variant.mrp,
    qty,
  };
}

/**
 * The lowest price a shopper can get for this size on its own, using the best coupon that
 * applies and (optionally) the prepaid discount. Shown as "Get it for ₹539 with GLOW10".
 */
export function bestOffer(
  product: Product,
  variant: Variant,
  { isFirstOrder = false, prepaid = false }: { isFirstOrder?: boolean; prepaid?: boolean } = {},
): { code: string; price: number } | undefined {
  const items = [asItem(product, variant)];
  let best: { code: string; price: number } | undefined;
  for (const c of COUPONS) {
    const check = checkCoupon(c.code, items, { isFirstOrder });
    if (!check.ok) continue;
    const t = computeTotals(items, { coupon: check.coupon, payment: prepaid ? "upi" : undefined });
    const price = t.subtotal - t.couponDiscount - t.prepaidDiscount;
    if (!best || price < best.price) best = { code: c.code, price };
  }
  return best;
}

/** Price per ml or g, which Indian packaging rules ask stores to show ("₹19.97 per ml"). */
export function unitPrice(variant: Variant): string | undefined {
  const m = variant.size.match(/^([\d.]+)\s*(ml|g)$/i);
  if (!m) return undefined;
  const amount = Number(m[1]);
  if (!amount) return undefined;
  return `₹${(variant.price / amount).toFixed(2)} per ${m[2].toLowerCase()}`;
}

/** The size with the lowest price per unit, tagged "Best value" when there are several. */
export function bestValueVariantId(product: Product): string | undefined {
  if (product.variants.length < 2) return undefined;
  const per = (v: Variant) => {
    const m = v.size.match(/^([\d.]+)/);
    return m ? v.price / Number(m[1]) : Infinity;
  };
  return [...product.variants].sort((a, b) => per(a) - per(b))[0]?.id;
}

/** Milestones on the cart progress bar. */
export function cartMilestones(isFirstOrder: boolean) {
  const steps: { at: number; phrase: string; short: string }[] = [
    { at: SHIPPING.freeAbove, phrase: "free delivery", short: "Free delivery" },
  ];
  const first = COUPONS.find((c) => c.firstOrderOnly && c.active);
  if (isFirstOrder && first) {
    steps.push({
      at: first.minSubtotal,
      phrase: `${first.value}% off with ${first.code}`,
      short: `${first.value}% off`,
    });
  }
  return steps;
}
