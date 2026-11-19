"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import ProductCard from "@/sites/skincare/components/ProductCard";
import type { ConcernId, Product } from "@/sites/skincare/data/types";
import { useDemoStore, useProducts, useStoreHydrated } from "@/sites/skincare/lib/store";
import { isNewLaunch, sortProducts } from "@/sites/skincare/shop/catalog";

export type RailSource =
  | { kind: "bestsellers" }
  | { kind: "new" }
  | { kind: "slugs"; slugs: string[] }
  | { kind: "related"; slug: string; concerns: ConcernId[] }
  | { kind: "recent"; exclude?: string };

/** Today's date, fixed per page load, for "new launch" checks. */
const TODAY = new Date();

function select(source: RailSource, products: Product[], recent: string[]): Product[] {
  switch (source.kind) {
    case "bestsellers":
      return sortProducts(
        products.filter((p) => p.badges.includes("Bestseller") || p.reviewCount > 1400),
        "popular",
      );
    case "new":
      return sortProducts(
        products.filter(
          (p) => isNewLaunch(p, TODAY) || p.badges.includes("New") || p.badges.includes("Limited"),
        ),
        "newest",
      ).concat(
        sortProducts(products, "newest")
          .filter(
            (p) =>
              !isNewLaunch(p, TODAY) && !p.badges.includes("New") && !p.badges.includes("Limited"),
          )
          .slice(0, 3),
      );
    case "slugs":
      return source.slugs
        .map((s) => products.find((p) => p.slug === s))
        .filter((p): p is Product => Boolean(p));
    case "related":
      return sortProducts(
        products.filter(
          (p) => p.slug !== source.slug && p.concerns.some((c) => source.concerns.includes(c)),
        ),
        "popular",
      );
    case "recent":
      return recent
        .filter((s) => s !== source.exclude)
        .map((s) => products.find((p) => p.slug === s))
        .filter((p): p is Product => Boolean(p));
  }
}

/** A horizontal, swipeable row of product cards with arrow buttons on larger screens. */
export default function ProductRail({
  source,
  heading,
  limit = 8,
  className,
  emptyFallback = null,
}: {
  source: RailSource;
  heading: ReactNode;
  limit?: number;
  className?: string;
  emptyFallback?: ReactNode;
}) {
  const products = useProducts();
  const recent = useDemoStore((s) => s.recentlyViewed);
  const hydrated = useStoreHydrated();
  const list = select(source, products, recent).slice(0, limit);
  const scroller = useRef<HTMLUListElement>(null);

  if (source.kind === "recent" && (!hydrated || list.length === 0)) return <>{emptyFallback}</>;
  if (!list.length) return <>{emptyFallback}</>;

  const scroll = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className={className}>
      <div className="flex items-end justify-between gap-4">
        {heading}
        <div className="hidden shrink-0 gap-2 md:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="grid size-10 place-items-center rounded-full border border-skin-line bg-white text-skin-ink transition hover:border-skin-ink"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="grid size-10 place-items-center rounded-full border border-skin-line bg-white text-skin-ink transition hover:border-skin-ink"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>
      <ul
        ref={scroller}
        className={cn(
          "-mx-4 mt-7 skin-no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:gap-6 lg:px-0",
        )}
      >
        {list.map((p) => (
          <li
            key={p.slug}
            className="flex w-[68%] shrink-0 snap-start sm:w-[42%] md:w-[31%] lg:w-[calc(25%-1.125rem)]"
          >
            <ProductCard product={p} className="w-full" />
          </li>
        ))}
      </ul>
    </section>
  );
}
