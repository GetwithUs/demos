"use client";

import { Lock, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useId } from "react";
import {
  CartLineRow,
  CouponBox,
  DeliveryProgress,
  TotalsList,
  Upsell,
} from "@/sites/skincare/components/cart/CartParts";
import Dialog from "@/sites/skincare/components/Dialog";
import ProductCard from "@/sites/skincare/components/ProductCard";
import { buttonClass } from "@/sites/skincare/components/ui";
import { SHIPPING } from "@/sites/skincare/data/catalog";
import { formatINR } from "@/sites/skincare/lib/pricing";
import { useStoreHydrated } from "@/sites/skincare/lib/store";
import { useCart } from "@/sites/skincare/shop/cart";
import { sortProducts } from "@/sites/skincare/shop/catalog";
import { useShopUI } from "@/sites/skincare/shop/ui";

/** Slide-in cart, opened from the header and after every "Add to cart". */
export default function CartDrawer() {
  const open = useShopUI((s) => s.panel === "cart");
  const close = useShopUI((s) => s.close);
  const titleId = useId();
  return (
    <Dialog
      open={open}
      onClose={close}
      side="right"
      labelledBy={titleId}
      className="w-full sm:w-[440px]"
    >
      <CartDrawerBody titleId={titleId} onClose={close} />
    </Dialog>
  );
}

function CartDrawerBody({ titleId, onClose }: { titleId: string; onClose: () => void }) {
  const cart = useCart();
  const hydrated = useStoreHydrated();
  const { lines, totals } = cart;

  return (
    <div className="flex h-dvh flex-col bg-skin-bg">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-skin-line px-5">
        <h2 id={titleId} className="font-skin-display text-xl text-skin-ink">
          Your cart{" "}
          {hydrated && totals.itemCount ? (
            <span className="text-base text-skin-subtle">({totals.itemCount})</span>
          ) : null}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="grid size-10 place-items-center rounded-full hover:bg-skin-sand"
          aria-label="Close cart"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      {!hydrated ? (
        <div className="space-y-4 p-5" aria-busy="true">
          <div className="h-20 skin-skeleton rounded-2xl" />
          <div className="h-24 skin-skeleton rounded-2xl" />
          <div className="h-24 skin-skeleton rounded-2xl" />
        </div>
      ) : lines.length === 0 ? (
        <EmptyCart onClose={onClose} products={cart.products} />
      ) : (
        <>
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
            <DeliveryProgress cart={cart} />
            <ul className="divide-y divide-skin-line">
              {lines.map((l) => (
                <CartLineRow
                  key={`${l.item.slug}-${l.item.variantId}`}
                  product={l.product}
                  variant={l.variant}
                  qty={l.item.qty}
                  onNavigate={onClose}
                />
              ))}
            </ul>
            <CouponBox cart={cart} compact />
            <Upsell cart={cart} />
          </div>
          <div className="shrink-0 border-t border-skin-line bg-white px-5 pt-4 pb-5 shadow-[0_-12px_30px_-24px_rgba(0,0,0,0.4)]">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm text-skin-body [&::-webkit-details-marker]:hidden">
                <span>
                  Price details{" "}
                  <span className="text-skin-subtle group-open:hidden">(tap to view)</span>
                </span>
                <span className="text-xs text-skin-success">
                  {totals.productSavings + totals.couponDiscount > 0
                    ? `Saving ${formatINR(totals.productSavings + totals.couponDiscount)}`
                    : null}
                </span>
              </summary>
              <TotalsList totals={totals} className="mt-3 border-b border-skin-line pb-4" />
            </details>
            <div className="mt-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-xl font-semibold text-skin-ink tabular-nums">
                  {formatINR(totals.total)}
                </p>
                <p className="text-xs text-skin-subtle">Inclusive of all taxes</p>
              </div>
              <Link
                href="/skincare/checkout"
                onClick={onClose}
                className={buttonClass("primary", "lg", "flex-1")}
              >
                <Lock className="size-4" aria-hidden />
                Checkout
              </Link>
            </div>
            <p className="mt-2.5 text-center text-xs text-skin-subtle">
              Extra {SHIPPING.prepaidPercent}% off on UPI and cards ·{" "}
              <Link
                href="/skincare/cart"
                onClick={onClose}
                className="font-medium text-skin-ink underline"
              >
                View full cart
              </Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function EmptyCart({
  onClose,
  products,
}: {
  onClose: () => void;
  products: ReturnType<typeof useCart>["products"];
}) {
  const picks = sortProducts(products, "popular").slice(0, 2);
  return (
    <div className="flex-1 overflow-y-auto px-5 py-8">
      <div className="text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-skin-sand">
          <ShoppingBag className="size-7 text-skin-subtle" strokeWidth={1.5} aria-hidden />
        </span>
        <p className="mt-4 font-skin-display text-2xl text-skin-ink">Your cart is empty</p>
        <p className="mt-1 text-sm text-skin-subtle">
          Start with the products India keeps coming back for.
        </p>
        <Link
          href="/skincare/shop"
          onClick={onClose}
          className={buttonClass("primary", "md", "mt-5")}
        >
          Shop all products
        </Link>
      </div>
      <p className="mt-10 text-sm font-semibold text-skin-ink">Bestsellers</p>
      <div
        className="mt-3 grid grid-cols-2 gap-4"
        onClickCapture={(e) => {
          if ((e.target as HTMLElement).closest("a")) onClose();
        }}
      >
        {picks.map((p) => (
          <ProductCard key={p.slug} product={p} compact />
        ))}
      </div>
    </div>
  );
}
