"use client";

import { Lock, RotateCcw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import {
  CartLineRow,
  CouponBox,
  DeliveryProgress,
  TotalsList,
  Upsell,
} from "@/sites/skincare/components/cart/CartParts";
import ProductRail from "@/sites/skincare/components/ProductRail";
import { PaymentMarks } from "@/sites/skincare/components/shop/Brand";
import {
  Breadcrumbs,
  Container,
  SectionHeading,
  buttonClass,
} from "@/sites/skincare/components/ui";
import { SHIPPING } from "@/sites/skincare/data/catalog";
import { useStoreHydrated } from "@/sites/skincare/lib/store";
import { useCart } from "@/sites/skincare/shop/cart";

export default function CartPage() {
  const cart = useCart();
  const hydrated = useStoreHydrated();
  const { lines, totals } = cart;

  return (
    <Container className="pt-6 pb-10">
      <Breadcrumbs items={[{ label: "Home", href: "/skincare" }, { label: "Cart" }]} />
      <h1 className="mt-4 font-skin-display text-4xl tracking-tight text-skin-ink sm:text-5xl">
        Your cart
        {hydrated && totals.itemCount ? (
          <span className="ml-3 align-middle text-xl text-skin-subtle">
            {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"}
          </span>
        ) : null}
      </h1>

      {!hydrated ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr] [&>*]:min-w-0" aria-busy="true">
          <div className="space-y-4">
            <div className="h-20 skin-skeleton rounded-2xl" />
            <div className="h-28 skin-skeleton rounded-2xl" />
            <div className="h-28 skin-skeleton rounded-2xl" />
          </div>
          <div className="h-80 skin-skeleton rounded-3xl" />
        </div>
      ) : lines.length === 0 ? (
        <div className="mt-8">
          <div className="rounded-[2rem] bg-white px-6 py-16 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-skin-sand">
              <ShoppingBag className="size-7 text-skin-subtle" strokeWidth={1.5} aria-hidden />
            </span>
            <p className="mt-4 font-skin-display text-3xl text-skin-ink">Your cart is empty</p>
            <p className="mt-2 text-skin-subtle">
              Not sure where to start? The skin quiz builds a routine in two minutes.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/skincare/shop?collection=bestsellers"
                className={buttonClass("primary", "md")}
              >
                Shop bestsellers
              </Link>
              <Link href="/skincare/skin-quiz" className={buttonClass("outline", "md")}>
                Take the skin quiz
              </Link>
            </div>
          </div>
          <ProductRail
            className="mt-16"
            source={{ kind: "bestsellers" }}
            heading={<SectionHeading title="Bestsellers" />}
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12 [&>*]:min-w-0">
          <div>
            <DeliveryProgress cart={cart} />
            <ul className="mt-4 divide-y divide-skin-line border-b border-skin-line">
              {lines.map((l) => (
                <CartLineRow
                  key={`${l.item.slug}-${l.item.variantId}`}
                  product={l.product}
                  variant={l.variant}
                  qty={l.item.qty}
                />
              ))}
            </ul>
            <div className="mt-8">
              <Upsell cart={cart} title="Complete your routine" limit={6} />
            </div>
          </div>
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start" aria-label="Order summary">
            <CouponBox cart={cart} />
            <div className="rounded-3xl bg-white p-6 ring-1 ring-skin-line">
              <h2 className="font-skin-display text-2xl text-skin-ink">Price details</h2>
              <TotalsList totals={totals} showPrepaidHint className="mt-4" />
              <Link
                href="/skincare/checkout"
                className={buttonClass("primary", "lg", "mt-5 w-full")}
              >
                <Lock className="size-4" aria-hidden />
                Proceed to checkout
              </Link>
              <ul className="mt-5 grid grid-cols-3 gap-2 text-center text-[0.72rem] text-skin-subtle">
                <li className="flex flex-col items-center gap-1">
                  <ShieldCheck className="size-5 text-skin-accent" aria-hidden />
                  Secure payments
                </li>
                <li className="flex flex-col items-center gap-1">
                  <Truck className="size-5 text-skin-accent" aria-hidden />
                  Free above ₹{SHIPPING.freeAbove}
                </li>
                <li className="flex flex-col items-center gap-1">
                  <RotateCcw className="size-5 text-skin-accent" aria-hidden />
                  {SHIPPING.returnDays} day returns
                </li>
              </ul>
              <PaymentMarks className="mt-5 justify-center" />
            </div>
          </aside>
        </div>
      )}
    </Container>
  );
}
