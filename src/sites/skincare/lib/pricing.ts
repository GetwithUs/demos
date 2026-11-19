import { COUPONS, SHIPPING } from "@/sites/skincare/data/catalog";
import type {
  CartTotals,
  Coupon,
  OrderItem,
  PaymentMethod,
  Product,
} from "@/sites/skincare/data/types";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** "₹1,449" */
export function formatINR(rupees: number): string {
  return inr.format(rupees);
}

/** Whole-percent discount from MRP, e.g. 8 for ₹599 against ₹649. */
export function discountPercent(price: number, mrp: number): number {
  return mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
}

/** Cart lines resolved against the catalogue; lines whose product or size no longer exists are dropped. */
export function resolveItems(
  lines: { slug: string; variantId: string; qty: number }[],
  products: Product[],
): OrderItem[] {
  const items: OrderItem[] = [];
  for (const line of lines) {
    const product = products.find((p) => p.slug === line.slug);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    if (!product || !variant || line.qty < 1) continue;
    items.push({
      slug: product.slug,
      variantId: variant.id,
      name: product.name,
      size: variant.size,
      price: variant.price,
      mrp: variant.mrp,
      qty: line.qty,
    });
  }
  return items;
}

export type CouponCheck = { ok: true; coupon: Coupon } | { ok: false; reason: string };

/** Whether a coupon code can be used on this cart, with a reason the shopper can read if not. */
export function checkCoupon(
  code: string,
  items: OrderItem[],
  { isFirstOrder }: { isFirstOrder: boolean },
): CouponCheck {
  const coupon = COUPONS.find((c) => c.code === code.trim().toUpperCase());
  if (!coupon || !coupon.active) return { ok: false, reason: "This code is not valid." };
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  if (subtotal < coupon.minSubtotal) {
    return {
      ok: false,
      reason: `Add ${formatINR(coupon.minSubtotal - subtotal)} more to use ${coupon.code}.`,
    };
  }
  if (coupon.minItems && count < coupon.minItems) {
    return {
      ok: false,
      reason: `${coupon.code} needs at least ${coupon.minItems} products in the cart.`,
    };
  }
  if (coupon.firstOrderOnly && !isFirstOrder) {
    return { ok: false, reason: `${coupon.code} is for your first order only.` };
  }
  return { ok: true, coupon };
}

function couponAmount(coupon: Coupon, subtotal: number): number {
  const raw = coupon.kind === "percent" ? (subtotal * coupon.value) / 100 : coupon.value;
  const capped = coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
  return Math.min(Math.round(capped), subtotal);
}

/**
 * Every number the cart, checkout, order and dashboard show. Rules (catalog.ts SHIPPING):
 * free delivery once the cart after coupon reaches ₹499, otherwise ₹49; cash on delivery
 * adds ₹40; paying online takes another 5% off (up to ₹100). Prices already include GST.
 */
export function computeTotals(
  items: OrderItem[],
  {
    coupon,
    payment,
  }: {
    /** An already-checked coupon (see checkCoupon). */
    coupon?: Coupon;
    /** Unknown until the payment step; online is assumed for the prepaid saving only once chosen. */
    payment?: PaymentMethod;
  } = {},
): CartTotals {
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const mrpTotal = items.reduce((sum, i) => sum + i.mrp * i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const couponDiscount = coupon ? couponAmount(coupon, subtotal) : 0;
  const afterCoupon = subtotal - couponDiscount;
  const prepaidDiscount =
    payment && payment !== "cod"
      ? Math.min(Math.round((afterCoupon * SHIPPING.prepaidPercent) / 100), SHIPPING.prepaidMax)
      : 0;
  const shipping = itemCount === 0 || afterCoupon >= SHIPPING.freeAbove ? 0 : SHIPPING.fee;
  const codFee = payment === "cod" ? SHIPPING.codFee : 0;
  const total = Math.max(0, afterCoupon - prepaidDiscount + shipping + codFee);
  return {
    itemCount,
    mrpTotal,
    subtotal,
    productSavings: mrpTotal - subtotal,
    couponCode: coupon?.code,
    couponDiscount,
    prepaidDiscount,
    shipping,
    codFee,
    total,
    gstIncluded: Math.round((total * 18) / 118),
    freeShippingGap:
      itemCount === 0 ? SHIPPING.freeAbove : Math.max(0, SHIPPING.freeAbove - afterCoupon),
  };
}

/** Cash on delivery is offered up to SHIPPING.codMax and where the pincode allows it. */
export function codAllowed(total: number, pincodeAllowsCod: boolean): boolean {
  return pincodeAllowsCod && total <= SHIPPING.codMax;
}
