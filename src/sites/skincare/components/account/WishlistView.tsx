"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import ProductCard, { ProductCardSkeleton } from "@/sites/skincare/components/ProductCard";
import { buttonClass } from "@/sites/skincare/components/ui";
import { useDemoStore, useProducts, useStoreHydrated } from "@/sites/skincare/lib/store";
import { useAddToCart } from "@/sites/skincare/shop/actions";
import { defaultVariant, inStock } from "@/sites/skincare/shop/catalog";
import { useShopUI } from "@/sites/skincare/shop/ui";

export default function WishlistView() {
  const hydrated = useStoreHydrated();
  const wishlist = useDemoStore((s) => s.wishlist);
  const products = useProducts();
  const addToCart = useAddToCart();
  const open = useShopUI((s) => s.open);
  const saved = wishlist
    .map((s) => products.find((p) => p.slug === s))
    .filter((p) => p !== undefined);

  if (!hydrated) {
    return (
      <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4" aria-busy="true">
        {[0, 1, 2, 3].map((i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!saved.length) {
    return (
      <div className="mt-8 rounded-[2rem] bg-white px-6 py-16 text-center ring-1 ring-skin-line">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-skin-rose-soft">
          <Heart className="size-7 text-skin-rose" aria-hidden />
        </span>
        <p className="mt-4 font-skin-display text-3xl text-skin-ink">Nothing saved yet</p>
        <p className="mt-2 text-skin-subtle">
          Tap the heart on any product to keep it here for later.
        </p>
        <Link href="/skincare/shop" className={buttonClass("primary", "md", "mt-6")}>
          Browse the range
        </Link>
      </div>
    );
  }

  const available = saved.filter(inStock);
  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-skin-subtle">
          {saved.length} saved {saved.length === 1 ? "product" : "products"}
        </p>
        {available.length > 1 ? (
          <button
            type="button"
            onClick={() => {
              available.forEach((p) => addToCart(p, defaultVariant(p).id, 1, { openCart: false }));
              open("cart");
            }}
            className={buttonClass("primary", "md")}
          >
            Add all to cart
          </button>
        ) : null}
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
        {saved.map((p) => (
          <li key={p.slug} className="flex">
            <ProductCard product={p} className="w-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}
