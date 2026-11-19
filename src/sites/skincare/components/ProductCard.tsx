"use client";

import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import ProductVisual from "@/sites/skincare/components/ProductVisual";
import { BadgePill, Price, Stars } from "@/sites/skincare/components/ui";
import { CATEGORIES } from "@/sites/skincare/data/catalog";
import type { Product } from "@/sites/skincare/data/types";
import { useAddToCart, useWishlist } from "@/sites/skincare/shop/actions";
import { defaultVariant, formatCount, inStock, LOW_STOCK } from "@/sites/skincare/shop/catalog";
import { formatINR } from "@/sites/skincare/lib/pricing";
import { bestOffer } from "@/sites/skincare/shop/offers";
import { useShopUI } from "@/sites/skincare/shop/ui";

export function WishlistButton({ product, className }: { product: Product; className?: string }) {
  const [saved, toggle] = useWishlist(product.slug);
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={
        saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`
      }
      className={cn(
        "grid size-9 place-items-center rounded-full bg-white/85 text-skin-ink shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white",
        className,
      )}
    >
      <Heart
        className={cn(
          "size-[1.1rem] transition",
          saved && "animate-skin-pop fill-skin-rose text-skin-rose",
        )}
        strokeWidth={1.8}
      />
    </button>
  );
}

/** A product tile: pack render on its tint, badges, wishlist, rating, price and quick add. */
export default function ProductCard({
  product,
  className,
  compact = false,
}: {
  product: Product;
  className?: string;
  /** Smaller text and no tagline, for rails in the cart drawer and similar. */
  compact?: boolean;
}) {
  const addToCart = useAddToCart();
  const toast = useShopUI((s) => s.toast);
  const variant = defaultVariant(product);
  const available = inStock(product);
  const low = available && variant.stock < LOW_STOCK;
  const offer = available ? bestOffer(product, variant) : undefined;
  const href = `/skincare/products/${product.slug}`;

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div
        className="relative overflow-hidden rounded-2xl transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_-24px_rgba(31,36,32,0.45)]"
        style={{ background: product.visual.tint }}
      >
        <Link href={href} tabIndex={-1} aria-hidden className="block px-[10%] pt-[8%] pb-[2%]">
          <ProductVisual
            spec={product.visual}
            name={product.name}
            className={cn(
              "transition duration-500 group-hover:scale-[1.04]",
              !available && "opacity-55 grayscale-[30%]",
            )}
          />
        </Link>
        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {!available ? <BadgePill badge="Sold out" /> : null}
          {available
            ? product.badges.slice(0, compact ? 1 : 2).map((b) => <BadgePill key={b} badge={b} />)
            : null}
        </div>
        <WishlistButton product={product} className="absolute top-2.5 right-2.5" />
        {low ? (
          <p className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.7rem] font-semibold text-skin-rose-ink">
            Only {variant.stock} left
          </p>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col pt-3.5">
        {!compact ? (
          <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-skin-subtle uppercase">
            {CATEGORIES[product.category].label}
            {product.variants.length > 1
              ? ` · ${product.variants.length} sizes`
              : ` · ${variant.size}`}
          </p>
        ) : null}
        <h3
          className={cn(
            "mt-1 leading-snug font-medium text-skin-ink",
            compact ? "text-sm" : "text-[0.98rem]",
          )}
        >
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </h3>
        {!compact ? (
          <p className="mt-1 line-clamp-1 text-sm text-skin-subtle">{product.tagline}</p>
        ) : null}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-skin-subtle">
          <Stars rating={product.rating} size={13} />
          <span className="font-medium text-skin-ink">{product.rating.toFixed(1)}</span>
          <span>({formatCount(product.reviewCount)})</span>
        </div>
        <Price
          price={variant.price}
          mrp={variant.mrp}
          size={compact ? "sm" : "md"}
          className="mt-2"
        />
        {offer && !compact ? (
          <p className="mt-1 text-xs text-skin-accent">
            Get it for <span className="font-semibold">{formatINR(offer.price)}</span> with{" "}
            <span className="font-semibold tracking-wide">{offer.code}</span>
          </p>
        ) : null}
        <div className="relative z-10 mt-auto pt-3">
          {available ? (
            <button
              type="button"
              onClick={() => addToCart(product, variant.id)}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-skin-ink/85 text-sm font-medium text-skin-ink transition hover:bg-skin-ink hover:text-white active:scale-[0.98]"
            >
              <ShoppingBag className="size-4" strokeWidth={1.8} aria-hidden />
              Add to cart
              <span className="sr-only">
                : {product.name}, {variant.size}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                toast(`We will message you on WhatsApp when ${product.name} is back (demo).`)
              }
              className="h-10 w-full rounded-full bg-skin-sand text-sm font-medium text-skin-ink transition hover:bg-skin-sand-2"
            >
              Notify me
              <span className="sr-only">: {product.name}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden>
      <div className="aspect-[4/5] skin-skeleton rounded-2xl" />
      <div className="mt-4 h-3 w-1/3 skin-skeleton rounded" />
      <div className="mt-2 h-4 w-4/5 skin-skeleton rounded" />
      <div className="mt-2 h-4 w-1/2 skin-skeleton rounded" />
      <div className="mt-4 h-10 skin-skeleton rounded-full" />
    </div>
  );
}
