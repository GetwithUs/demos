"use client";

import { Check, Plus } from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";
import { cn } from "@/lib/cn";
import ProductVisual from "@/sites/skincare/components/ProductVisual";
import { buttonClass } from "@/sites/skincare/components/ui";
import type { Product, Variant } from "@/sites/skincare/data/types";
import { formatINR } from "@/sites/skincare/lib/pricing";
import { useDemoStore } from "@/sites/skincare/lib/store";
import { useAddToCart } from "@/sites/skincare/shop/actions";
import { defaultVariant, inStock } from "@/sites/skincare/shop/catalog";
import { useShopUI } from "@/sites/skincare/shop/ui";

/** "Frequently bought together": this product plus two partners, with the combined price. */
export default function FrequentlyBought({
  product,
  variant,
  products,
}: {
  product: Product;
  variant: Variant;
  products: Product[];
}) {
  const partners = product.pairsWith
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is Product => Boolean(p && inStock(p)))
    .slice(0, 2);
  const [off, setOff] = useState<string[]>([]);
  const addToCart = useAddToCart();
  const open = useShopUI((s) => s.open);
  const toast = useShopUI((s) => s.toast);

  if (!partners.length || variant.stock < 1) return null;

  const rows: { p: Product; v: Variant; main: boolean }[] = [
    { p: product, v: variant, main: true },
    ...partners.map((p) => ({ p, v: defaultVariant(p), main: false })),
  ];
  const chosen = rows.filter((r) => r.main || !off.includes(r.p.slug));
  const price = chosen.reduce((s, r) => s + r.v.price, 0);
  const mrp = chosen.reduce((s, r) => s + r.v.mrp, 0);
  const duo = chosen.length >= 2;

  return (
    <section
      aria-labelledby="fbt-title"
      className="rounded-[1.75rem] border border-skin-line bg-white p-5 sm:p-8"
    >
      <h2 id="fbt-title" className="font-skin-display text-2xl text-skin-ink sm:text-3xl">
        Frequently bought together
      </h2>
      <p className="mt-1 text-sm text-skin-subtle">
        Customers who bought this usually complete their routine with these.
      </p>
      <div className="mt-6 grid items-center gap-6 lg:grid-cols-[1fr_280px] [&>*]:min-w-0">
        <ul className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          {rows.map((r, i) => {
            const selected = r.main || !off.includes(r.p.slug);
            return (
              <Fragment key={r.p.slug}>
                {i > 0 ? (
                  <li
                    aria-hidden
                    className="-my-1.5 grid place-items-center text-skin-subtle sm:my-0"
                  >
                    <Plus className="size-5" />
                  </li>
                ) : null}
                <li className="flex sm:flex-1">
                  <label
                    className={cn(
                      "flex flex-1 cursor-pointer items-center gap-3 rounded-2xl border p-3 transition sm:flex-col sm:items-start",
                      selected ? "border-skin-ink/70" : "border-skin-line opacity-60",
                      r.main && "cursor-default",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selected}
                      disabled={r.main}
                      onChange={() =>
                        setOff(selected ? [...off, r.p.slug] : off.filter((s) => s !== r.p.slug))
                      }
                    />
                    <span
                      className="relative w-16 shrink-0 rounded-xl px-1.5 pt-1.5 sm:w-full sm:px-[18%] sm:pt-3"
                      style={{ background: r.p.visual.tint }}
                    >
                      <ProductVisual spec={r.p.visual} name={r.p.name} />
                      <span
                        className={cn(
                          "absolute top-1.5 right-1.5 grid size-5 place-items-center rounded-full border-2",
                          selected
                            ? "border-skin-ink bg-skin-ink text-white"
                            : "border-skin-line bg-white",
                        )}
                        aria-hidden
                      >
                        {selected ? <Check className="size-3" strokeWidth={3} /> : null}
                      </span>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm leading-snug font-medium text-skin-ink">
                        {r.main ? "This item: " : ""}
                        {r.main ? (
                          r.p.name
                        ) : (
                          <Link href={`/skincare/products/${r.p.slug}`} className="hover:underline">
                            {r.p.name}
                          </Link>
                        )}
                      </span>
                      <span className="mt-0.5 block text-sm text-skin-ink">
                        {formatINR(r.v.price)}{" "}
                        <s className="text-xs text-skin-subtle">{formatINR(r.v.mrp)}</s>
                      </span>
                    </span>
                  </label>
                </li>
              </Fragment>
            );
          })}
        </ul>
        <div className="rounded-2xl bg-skin-sand/60 p-5">
          <p className="text-sm text-skin-subtle">
            Total for {chosen.length} {chosen.length === 1 ? "item" : "items"}
          </p>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-skin-ink tabular-nums">
              {formatINR(price)}
            </span>
            <s className="text-sm text-skin-subtle">{formatINR(mrp)}</s>
          </p>
          <p className="mt-1 text-sm font-medium text-skin-success">
            You save {formatINR(mrp - price)} on MRP
          </p>
          {duo ? (
            <p className="text-sm text-skin-body">Extra {formatINR(150)} off with code DUO150</p>
          ) : null}
          <button
            type="button"
            className={buttonClass("primary", "md", "mt-4 w-full")}
            onClick={() => {
              const before = useDemoStore.getState().cart.length;
              chosen.forEach((r) => addToCart(r.p, r.v.id, 1, { openCart: false }));
              if (useDemoStore.getState().cart.length >= before) {
                toast(
                  `Added ${chosen.length} ${chosen.length === 1 ? "item" : "items"} to your cart`,
                );
                open("cart");
              }
            }}
          >
            Add {chosen.length === 1 ? "to cart" : `all ${chosen.length} to cart`}
          </button>
        </div>
      </div>
    </section>
  );
}
