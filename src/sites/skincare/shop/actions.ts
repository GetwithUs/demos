"use client";

import { useCallback } from "react";
import type { Product } from "@/sites/skincare/data/types";
import { useDemoStore } from "@/sites/skincare/lib/store";
import { useShopUI } from "@/sites/skincare/shop/ui";

/**
 * Adds a size to the cart without going over the stock the owner has set, then opens the
 * cart drawer (or tells the shopper why not).
 */
export function useAddToCart() {
  const addToCart = useDemoStore((s) => s.addToCart);
  const open = useShopUI((s) => s.open);
  const toast = useShopUI((s) => s.toast);

  return useCallback(
    (
      product: Product,
      variantId: string,
      qty = 1,
      { openCart = true }: { openCart?: boolean } = {},
    ) => {
      const variant = product.variants.find((v) => v.id === variantId);
      if (!variant || variant.stock < 1) {
        toast("Sorry, that size is out of stock.");
        return false;
      }
      const inCart =
        useDemoStore
          .getState()
          .cart.find((l) => l.slug === product.slug && l.variantId === variantId)?.qty ?? 0;
      const room = Math.min(variant.stock, 10) - inCart;
      if (room < 1) {
        toast(
          variant.stock <= 10
            ? `Only ${variant.stock} in stock, and they are all in your cart.`
            : "You can add up to 10 of each product.",
        );
        if (openCart) open("cart");
        return false;
      }
      addToCart(product.slug, variantId, Math.min(qty, room));
      if (qty > room) toast(`Only ${room} more could be added.`);
      if (openCart) open("cart");
      return true;
    },
    [addToCart, open, toast],
  );
}

export function useWishlist(slug: string) {
  const saved = useDemoStore((s) => s.wishlist.includes(slug));
  const toggle = useDemoStore((s) => s.toggleWishlist);
  const toast = useShopUI((s) => s.toast);
  const flip = useCallback(() => {
    toggle(slug);
    toast(saved ? "Removed from your wishlist" : "Saved to your wishlist");
  }, [toggle, slug, saved, toast]);
  return [saved, flip] as const;
}
