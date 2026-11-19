"use client";

import { Check, Heart, Minus, Plus, Tag, Trash2, Truck } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import ProductVisual from "@/sites/skincare/components/ProductVisual";
import { Price } from "@/sites/skincare/components/ui";
import { COUPONS, SHIPPING } from "@/sites/skincare/data/catalog";
import type { CartTotals, Product, Variant } from "@/sites/skincare/data/types";
import { checkCoupon, formatINR } from "@/sites/skincare/lib/pricing";
import { useDemoStore } from "@/sites/skincare/lib/store";
import { useAddToCart } from "@/sites/skincare/shop/actions";
import type { useCart } from "@/sites/skincare/shop/cart";
import { defaultVariant, inStock, LOW_STOCK } from "@/sites/skincare/shop/catalog";
import { cartMilestones } from "@/sites/skincare/shop/offers";
import { useShopUI } from "@/sites/skincare/shop/ui";

type Cart = ReturnType<typeof useCart>;

export function QtyStepper({
  value,
  max,
  onChange,
  label,
  size = "md",
}: {
  value: number;
  max: number;
  onChange: (qty: number) => void;
  /** e.g. "Quantity of Niacinamide serum". */
  label: string;
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "h-8" : "h-11";
  const btn = cn(
    "grid place-items-center text-skin-ink transition hover:bg-skin-sand disabled:cursor-not-allowed disabled:opacity-35",
    size === "sm" ? "w-8" : "w-11",
  );
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex items-center rounded-full border border-skin-line bg-white", box)}
    >
      <button
        type="button"
        className={cn(btn, "rounded-l-full", box)}
        onClick={() => onChange(value - 1)}
        aria-label="Decrease quantity"
        disabled={value <= 1}
      >
        <Minus className="size-3.5" aria-hidden />
      </button>
      <output
        className={cn("min-w-7 text-center text-sm font-medium tabular-nums")}
        aria-live="polite"
      >
        {value}
      </output>
      <button
        type="button"
        className={cn(btn, "rounded-r-full", box)}
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
        disabled={value >= max}
      >
        <Plus className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}

/** Progress towards free delivery (and the first-order coupon, for new shoppers). */
export function DeliveryProgress({ cart, className }: { cart: Cart; className?: string }) {
  const { totals, isFirstOrder } = cart;
  const afterCoupon = totals.subtotal - totals.couponDiscount;
  const milestones = cartMilestones(isFirstOrder);
  const max = milestones[milestones.length - 1].at;
  const fill = Math.min(1, afterCoupon / max);
  const next = milestones.find((m) =>
    m.at === SHIPPING.freeAbove ? totals.freeShippingGap > 0 : totals.subtotal < m.at,
  );
  const gap = next
    ? next.at === SHIPPING.freeAbove
      ? totals.freeShippingGap
      : next.at - totals.subtotal
    : 0;

  return (
    <div className={cn("rounded-2xl bg-skin-accent-soft/70 p-4", className)}>
      <p className="flex items-center gap-2 text-sm text-skin-ink" aria-live="polite">
        <Truck className="size-4 shrink-0 text-skin-accent" aria-hidden />
        {next ? (
          <span>
            Add <strong>{formatINR(gap)}</strong> more for <strong>{next.phrase}</strong>
          </span>
        ) : (
          <span>
            <strong>You have unlocked free delivery</strong>
            {isFirstOrder ? " and 15% off with FIRST15" : ""}
          </span>
        )}
      </p>
      <div className="relative mt-3 mb-5 h-1.5 rounded-full bg-white">
        <div
          className="h-full rounded-full bg-skin-accent transition-[width] duration-500"
          style={{ width: `${fill * 100}%` }}
        />
        {milestones.map((m) => {
          const reached =
            m.at === SHIPPING.freeAbove
              ? totals.freeShippingGap === 0 && totals.itemCount > 0
              : totals.subtotal >= m.at;
          return (
            <span
              key={m.at}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(m.at / max) * 100}%` }}
            >
              <span
                className={cn(
                  "grid size-4 place-items-center rounded-full border-2 transition",
                  reached
                    ? "border-skin-accent bg-skin-accent text-white"
                    : "border-skin-sand-2 bg-white",
                )}
              >
                {reached ? <Check className="size-2.5" strokeWidth={3} aria-hidden /> : null}
              </span>
              <span className="absolute top-5 right-0 text-[0.68rem] whitespace-nowrap text-skin-subtle">
                {m.short} at {formatINR(m.at)}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function CartLineRow({
  product,
  variant,
  qty,
  onNavigate,
}: {
  product: Product;
  variant: Variant;
  qty: number;
  onNavigate?: () => void;
}) {
  const setQty = useDemoStore((s) => s.setQty);
  const remove = useDemoStore((s) => s.removeFromCart);
  const wishlist = useDemoStore((s) => s.wishlist);
  const toggleWishlist = useDemoStore((s) => s.toggleWishlist);
  const toast = useShopUI((s) => s.toast);
  const max = Math.max(1, Math.min(10, variant.stock));
  const href = `/skincare/products/${product.slug}`;

  return (
    <li className="flex gap-4 py-4">
      <Link
        href={href}
        onClick={onNavigate}
        className="w-20 shrink-0 self-start rounded-xl px-1.5 pt-1.5"
        style={{ background: product.visual.tint }}
        tabIndex={-1}
        aria-hidden
      >
        <ProductVisual spec={product.visual} name={product.name} />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={href}
              onClick={onNavigate}
              className="text-[0.92rem] leading-snug font-medium text-skin-ink hover:underline"
            >
              {product.name}
            </Link>
            <p className="mt-0.5 text-xs text-skin-subtle">{variant.size}</p>
          </div>
          <p className="text-[0.92rem] font-semibold text-skin-ink tabular-nums">
            {formatINR(variant.price * qty)}
          </p>
        </div>
        <Price
          price={variant.price}
          mrp={variant.mrp}
          size="sm"
          className="mt-1 [&>span:first-child]:font-normal [&>span:first-child]:text-skin-body"
        />
        {variant.stock < LOW_STOCK ? (
          <p className="mt-1 text-xs font-medium text-skin-rose-ink">
            Only {variant.stock} left in stock
          </p>
        ) : null}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
          <QtyStepper
            value={qty}
            max={max}
            size="sm"
            onChange={(n) => setQty(product.slug, variant.id, n)}
            label={`Quantity of ${product.name}`}
          />
          <button
            type="button"
            onClick={() => {
              if (!wishlist.includes(product.slug)) toggleWishlist(product.slug);
              remove(product.slug, variant.id);
              toast("Moved to your wishlist");
            }}
            className="inline-flex items-center gap-1 text-xs text-skin-subtle hover:text-skin-ink"
          >
            <Heart className="size-3.5" aria-hidden />
            Save for later
          </button>
          <button
            type="button"
            onClick={() => remove(product.slug, variant.id)}
            className="inline-flex items-center gap-1 text-xs text-skin-subtle hover:text-skin-rose-ink"
          >
            <Trash2 className="size-3.5" aria-hidden />
            Remove<span className="sr-only"> {product.name}</span>
          </button>
        </div>
      </div>
    </li>
  );
}

/** Coupon field plus the list of available codes with one-tap apply. */
export function CouponBox({ cart, compact = false }: { cart: Cart; compact?: boolean }) {
  const setCoupon = useDemoStore((s) => s.setCoupon);
  const toast = useShopUI((s) => s.toast);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(!compact);
  const inputId = useId();
  const { coupon, couponCode, couponCheck, items, isFirstOrder, totals } = cart;

  const apply = (raw: string) => {
    const value = raw.trim().toUpperCase();
    if (!value) {
      setError("Enter a coupon code.");
      return;
    }
    const check = checkCoupon(value, items, { isFirstOrder });
    if (!check.ok) {
      setError(check.reason);
      return;
    }
    setCoupon(value);
    setError("");
    setCode("");
    toast(`${value} applied`);
  };

  return (
    <div className="rounded-2xl border border-skin-line bg-white p-4">
      {coupon ? (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-skin-accent-soft px-3 py-2.5">
          <p className="flex items-center gap-2 text-sm text-skin-ink">
            <Tag className="size-4 text-skin-accent" aria-hidden />
            <span>
              <strong className="tracking-wide">{coupon.code}</strong> applied. You save{" "}
              <strong>{formatINR(totals.couponDiscount)}</strong>
            </span>
          </p>
          <button
            type="button"
            onClick={() => setCoupon(undefined)}
            className="text-xs font-medium text-skin-rose-ink underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            apply(code);
          }}
        >
          <label htmlFor={inputId} className="text-sm font-medium text-skin-ink">
            Have a coupon code?
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id={inputId}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              placeholder="Enter code"
              autoComplete="off"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${inputId}-error` : undefined}
              className="h-11 min-w-0 flex-1 rounded-full border border-skin-line bg-skin-bg px-4 text-sm uppercase placeholder:normal-case focus:border-skin-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-skin-accent/25"
            />
            <button
              type="submit"
              className="h-11 rounded-full bg-skin-ink px-5 text-sm font-medium text-white hover:bg-black"
            >
              Apply
            </button>
          </div>
          {error ? (
            <p id={`${inputId}-error`} role="alert" className="mt-2 text-sm text-skin-danger">
              {error}
            </p>
          ) : null}
          {couponCode && couponCheck && !couponCheck.ok ? (
            <p className="mt-2 text-sm text-skin-saffron-ink">
              {couponCode} is not applied: {couponCheck.reason}
            </p>
          ) : null}
        </form>
      )}

      {compact && !showAll ? (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-3 text-sm font-medium text-skin-accent hover:underline"
        >
          View available offers ({COUPONS.filter((c) => c.active).length})
        </button>
      ) : (
        <ul className="mt-3 space-y-2">
          {COUPONS.filter((c) => c.active).map((c) => {
            const check = checkCoupon(c.code, items, { isFirstOrder });
            const current = coupon?.code === c.code;
            return (
              <li
                key={c.code}
                className="flex items-start justify-between gap-3 rounded-xl border border-dashed border-skin-line px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold tracking-wide text-skin-ink">{c.code}</p>
                  <p className="text-xs text-skin-subtle">{c.description}</p>
                  {!check.ok && !current ? (
                    <p className="mt-0.5 text-xs text-skin-saffron-ink">{check.reason}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  disabled={!check.ok || current}
                  onClick={() => apply(c.code)}
                  className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-skin-accent ring-1 ring-skin-accent/40 transition hover:bg-skin-accent hover:text-white disabled:text-skin-subtle disabled:ring-skin-line disabled:hover:bg-transparent"
                >
                  {current ? "Applied" : "Apply"}
                  <span className="sr-only"> {c.code}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** The price breakdown used in the cart, checkout and order pages. */
export function TotalsList({
  totals,
  showPrepaidHint = false,
  className,
}: {
  totals: CartTotals;
  showPrepaidHint?: boolean;
  className?: string;
}) {
  const saved = totals.productSavings + totals.couponDiscount + totals.prepaidDiscount;
  const row = "flex items-center justify-between gap-4";
  return (
    <div className={className}>
      <dl className="space-y-2.5 text-sm text-skin-body">
        <div className={row}>
          <dt>
            MRP total ({totals.itemCount} {totals.itemCount === 1 ? "item" : "items"})
          </dt>
          <dd className="tabular-nums">{formatINR(totals.mrpTotal)}</dd>
        </div>
        {totals.productSavings > 0 ? (
          <div className={row}>
            <dt>Discount on MRP</dt>
            <dd className="text-skin-success tabular-nums">-{formatINR(totals.productSavings)}</dd>
          </div>
        ) : null}
        {totals.couponDiscount > 0 ? (
          <div className={row}>
            <dt>Coupon ({totals.couponCode})</dt>
            <dd className="text-skin-success tabular-nums">-{formatINR(totals.couponDiscount)}</dd>
          </div>
        ) : null}
        {totals.prepaidDiscount > 0 ? (
          <div className={row}>
            <dt>Prepaid discount ({SHIPPING.prepaidPercent}%)</dt>
            <dd className="text-skin-success tabular-nums">-{formatINR(totals.prepaidDiscount)}</dd>
          </div>
        ) : null}
        <div className={row}>
          <dt>Delivery</dt>
          <dd className="tabular-nums">
            {totals.shipping ? (
              formatINR(totals.shipping)
            ) : (
              <span className="font-medium text-skin-success">
                <s className="mr-1 font-normal text-skin-subtle">{formatINR(SHIPPING.fee)}</s>Free
              </span>
            )}
          </dd>
        </div>
        {totals.codFee > 0 ? (
          <div className={row}>
            <dt>Cash on delivery fee</dt>
            <dd className="tabular-nums">{formatINR(totals.codFee)}</dd>
          </div>
        ) : null}
      </dl>
      <div className="mt-4 flex items-baseline justify-between border-t border-skin-line pt-4">
        <p className="font-medium text-skin-ink">Total</p>
        <p className="text-xl font-semibold text-skin-ink tabular-nums">
          {formatINR(totals.total)}
        </p>
      </div>
      <p className="mt-1 text-right text-xs text-skin-subtle">
        Inclusive of {formatINR(totals.gstIncluded)} GST
      </p>
      {saved > 0 ? (
        <p className="mt-3 rounded-xl bg-skin-success/10 px-3 py-2 text-center text-sm font-medium text-skin-success">
          You save {formatINR(saved)} on this order
        </p>
      ) : null}
      {showPrepaidHint ? (
        <p className="mt-2 text-center text-xs text-skin-subtle">
          Pay online at checkout for an extra {SHIPPING.prepaidPercent}% off, up to{" "}
          {formatINR(SHIPPING.prepaidMax)}
        </p>
      ) : null}
    </div>
  );
}

/** "Complete your routine" suggestions based on what is in the cart. */
export function Upsell({
  cart,
  title = "Complete your routine",
  limit = 4,
}: {
  cart: Cart;
  title?: string;
  limit?: number;
}) {
  const addToCart = useAddToCart();
  const inCart = new Set(cart.items.map((i) => i.slug));
  const ordered = cart.lines.flatMap((l) => l.product.pairsWith);
  const picks: Product[] = [];
  for (const slug of [
    ...ordered,
    "invisible-sunscreen-spf50",
    "spf30-lip-balm",
    "hyaluronic-hydrating-serum",
  ]) {
    const p = cart.products.find((x) => x.slug === slug);
    if (p && !inCart.has(slug) && inStock(p) && !picks.includes(p)) picks.push(p);
    if (picks.length >= limit) break;
  }
  if (!picks.length) return null;
  return (
    <div>
      <p className="text-sm font-semibold text-skin-ink">{title}</p>
      <ul className="mt-3 skin-no-scrollbar flex snap-x gap-3 overflow-x-auto pb-1">
        {picks.map((p) => {
          const v = defaultVariant(p);
          return (
            <li
              key={p.slug}
              className="w-36 shrink-0 snap-start rounded-2xl border border-skin-line bg-white p-2.5"
            >
              <Link
                href={`/skincare/products/${p.slug}`}
                className="block rounded-xl px-3 pt-2"
                style={{ background: p.visual.tint }}
                tabIndex={-1}
                aria-hidden
              >
                <ProductVisual spec={p.visual} name={p.name} />
              </Link>
              <p className="mt-2 line-clamp-2 text-xs leading-snug font-medium text-skin-ink">
                {p.name}
              </p>
              <p className="mt-1 text-xs font-semibold text-skin-ink">{formatINR(v.price)}</p>
              <button
                type="button"
                onClick={() => addToCart(p, v.id, 1, { openCart: false })}
                className="mt-2 h-8 w-full rounded-full bg-skin-ink text-xs font-medium text-white hover:bg-black"
              >
                Add<span className="sr-only"> {p.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
