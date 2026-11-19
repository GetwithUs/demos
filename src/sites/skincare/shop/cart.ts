"use client";

import { useMemo } from "react";
import type { Coupon, PaymentMethod } from "@/sites/skincare/data/types";
import {
  checkCoupon,
  computeTotals,
  resolveItems,
  type CouponCheck,
} from "@/sites/skincare/lib/pricing";
import { useDemoStore, useProducts } from "@/sites/skincare/lib/store";

/**
 * The cart as every page shows it: lines resolved against the live catalogue (owner price
 * changes included), the saved coupon re-checked against the current cart, and totals.
 */
export function useCart(payment?: PaymentMethod) {
  const products = useProducts();
  const cart = useDemoStore((s) => s.cart);
  const couponCode = useDemoStore((s) => s.couponCode);
  const orders = useDemoStore((s) => s.orders);
  const isFirstOrder = !orders.some((o) => o.source === "visitor");

  return useMemo(() => {
    const items = resolveItems(cart, products);
    const couponCheck: CouponCheck | undefined = couponCode
      ? checkCoupon(couponCode, items, { isFirstOrder })
      : undefined;
    const coupon: Coupon | undefined = couponCheck?.ok ? couponCheck.coupon : undefined;
    const totals = computeTotals(items, { coupon, payment });
    const lines = items.map((item) => {
      const product = products.find((p) => p.slug === item.slug)!;
      const variant = product.variants.find((v) => v.id === item.variantId)!;
      return { item, product, variant };
    });
    return { items, lines, totals, coupon, couponCode, couponCheck, isFirstOrder, products };
  }, [cart, products, couponCode, isFirstOrder, payment]);
}

/** Number of units in the cart, for the header badge. */
export function useCartCount(): number {
  return useDemoStore((s) => s.cart.reduce((sum, l) => sum + l.qty, 0));
}
