"use client";

import { ArrowRight, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { useId, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import CopyCode from "@/sites/skincare/components/CopyCode";
import ProductVisual from "@/sites/skincare/components/ProductVisual";
import { Price, Stars, buttonClass } from "@/sites/skincare/components/ui";
import { COUPONS, SHIPPING } from "@/sites/skincare/data/catalog";
import { SPOTLIGHT } from "@/sites/skincare/content/home";
import { ingredientById } from "@/sites/skincare/content/ingredients";
import { formatINR } from "@/sites/skincare/lib/pricing";
import { useProduct } from "@/sites/skincare/lib/store";
import { useAddToCart } from "@/sites/skincare/shop/actions";
import { defaultVariant, inStock } from "@/sites/skincare/shop/catalog";

/** The product card floating over the hero photo. */
export function HeroProductChip({ slug, className }: { slug: string; className?: string }) {
  const product = useProduct(slug);
  const addToCart = useAddToCart();
  if (!product) return null;
  const v = defaultVariant(product);
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl bg-white/95 p-2.5 pr-3 shadow-[0_20px_50px_-20px_rgba(31,36,32,0.45)] backdrop-blur",
        className,
      )}
    >
      <Link
        href={`/skincare/products/${product.slug}`}
        className="w-16 shrink-0 rounded-xl px-1.5 pt-1.5"
        style={{ background: product.visual.tint }}
        aria-hidden
        tabIndex={-1}
      >
        <ProductVisual spec={product.visual} name={product.name} />
      </Link>
      <div className="min-w-0">
        <p className="flex items-center gap-1 text-[0.7rem] font-semibold tracking-wide text-skin-saffron-ink uppercase">
          <Sparkles className="size-3" aria-hidden /> No. 1 bestseller
        </p>
        <Link
          href={`/skincare/products/${product.slug}`}
          className="block text-sm leading-snug font-medium text-skin-ink hover:underline"
        >
          {product.name}
        </Link>
        <div className="mt-0.5 flex items-center gap-2">
          <Stars rating={product.rating} size={11} />
          <span className="text-xs font-semibold text-skin-ink">{formatINR(v.price)}</span>
        </div>
      </div>
      {inStock(product) ? (
        <button
          type="button"
          onClick={() => addToCart(product, v.id)}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-skin-accent text-white transition hover:bg-skin-accent-hover"
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="size-5" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}

/** "Know your actives" tabs with the product that uses each one. */
export function IngredientSpotlight() {
  const [active, setActive] = useState(0);
  const base = useId();
  const item = SPOTLIGHT[active];
  const product = useProduct(item.slug);
  const ingredient = ingredientById(item.ingredient);
  const addToCart = useAddToCart();

  const onKey = (e: KeyboardEvent, i: number) => {
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const n = (next + SPOTLIGHT.length) % SPOTLIGHT.length;
    setActive(n);
    document.getElementById(`${base}-tab-${n}`)?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Ingredients"
        className="-mx-1 skin-no-scrollbar flex gap-2 overflow-x-auto px-1 pb-1"
      >
        {SPOTLIGHT.map((s, i) => {
          const ing = ingredientById(s.ingredient);
          return (
            <button
              key={s.ingredient}
              id={`${base}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={i === active}
              aria-controls={`${base}-panel`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition",
                i === active
                  ? "border-skin-ink bg-skin-ink text-white"
                  : "border-skin-line bg-white text-skin-ink hover:border-skin-ink/50",
              )}
            >
              {ing?.name}
            </button>
          );
        })}
      </div>
      <div
        id={`${base}-panel`}
        role="tabpanel"
        aria-labelledby={`${base}-tab-${active}`}
        key={active}
        className="mt-7 animate-skin-fade-in"
      >
        <h3 className="font-skin-display text-[1.7rem] leading-tight text-skin-ink sm:text-3xl">
          {item.headline}
        </h3>
        <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-skin-body">{item.text}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {item.facts.map((f) => (
            <li
              key={f}
              className="rounded-full bg-skin-accent-soft px-3 py-1.5 text-sm text-skin-accent"
            >
              {f}
            </li>
          ))}
        </ul>
        {product ? (
          <div className="mt-7 flex items-center gap-4 rounded-2xl border border-skin-line bg-white p-3 sm:max-w-md">
            <Link
              href={`/skincare/products/${product.slug}`}
              className="w-20 shrink-0 rounded-xl px-2 pt-2"
              style={{ background: product.visual.tint }}
              aria-hidden
              tabIndex={-1}
            >
              <ProductVisual spec={product.visual} name={product.name} />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/skincare/products/${product.slug}`}
                className="text-sm leading-snug font-medium text-skin-ink hover:underline"
              >
                {product.name}
              </Link>
              <Price
                price={defaultVariant(product).price}
                mrp={defaultVariant(product).mrp}
                size="sm"
                className="mt-1"
              />
              {inStock(product) ? (
                <button
                  type="button"
                  onClick={() => addToCart(product, defaultVariant(product).id)}
                  className="mt-2 block text-sm font-medium text-skin-accent hover:underline"
                >
                  Add to cart
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link
            href={`/skincare/shop?ingredient=${item.ingredient}`}
            className="inline-flex items-center gap-1 font-medium text-skin-ink underline-offset-4 hover:underline"
          >
            Shop all {ingredient?.name.toLowerCase()} <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href={`/skincare/ingredients#${item.ingredient}`}
            className="text-skin-subtle underline-offset-4 hover:text-skin-ink hover:underline"
          >
            Read the ingredient guide
          </Link>
        </div>
      </div>
    </div>
  );
}

/** The routine kit feature plus offer cards with copyable codes. */
export function KitsAndOffers() {
  const kit = useProduct("clear-skin-routine-kit");
  const addToCart = useAddToCart();
  const coupons = COUPONS.filter((c) => c.active);
  return (
    <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr] [&>*]:min-w-0">
      {kit ? (
        <div
          className="relative grid overflow-hidden rounded-[1.75rem] sm:grid-cols-[1fr_1.1fr]"
          style={{ background: kit.visual.tint }}
        >
          <div className="px-10 pt-8 sm:px-8 sm:py-8">
            <ProductVisual
              spec={kit.visual}
              name={kit.name}
              className="mx-auto max-w-[280px] animate-skin-float"
            />
          </div>
          <div className="flex flex-col justify-center px-6 pb-8 sm:py-10 sm:pr-10 sm:pl-2">
            <p className="text-xs font-semibold tracking-[0.18em] text-skin-accent uppercase">
              Routine kit
            </p>
            <h3 className="mt-2 font-skin-display text-3xl leading-tight text-skin-ink">
              {kit.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-skin-body">
              {kit.tagline}. A printed routine card inside tells you exactly what to use when.
            </p>
            <Price
              price={defaultVariant(kit).price}
              mrp={defaultVariant(kit).mrp}
              size="lg"
              className="mt-5"
            />
            <p className="mt-1 text-sm font-medium text-skin-success">
              You save {formatINR(defaultVariant(kit).mrp - defaultVariant(kit).price)} against MRP
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {inStock(kit) ? (
                <button
                  type="button"
                  onClick={() => addToCart(kit, defaultVariant(kit).id)}
                  className={buttonClass("primary", "md")}
                >
                  Add kit to cart
                </button>
              ) : null}
              <Link
                href={`/skincare/products/${kit.slug}`}
                className={buttonClass("outline", "md")}
              >
                What is inside
              </Link>
            </div>
          </div>
        </div>
      ) : null}
      <ul className="grid gap-3">
        {coupons.map((c) => (
          <li
            key={c.code}
            className="flex items-center justify-between gap-4 rounded-2xl border border-skin-line bg-white p-5"
          >
            <div>
              <p className="font-skin-display text-xl text-skin-ink">
                {c.kind === "percent" ? `${c.value}% off` : `${formatINR(c.value)} off`}
              </p>
              <p className="mt-0.5 text-sm text-skin-subtle">{c.description}</p>
            </div>
            <CopyCode code={c.code} />
          </li>
        ))}
        <li className="flex items-center justify-between gap-4 rounded-2xl bg-skin-ink p-5 text-white">
          <div>
            <p className="font-skin-display text-xl">
              Extra {SHIPPING.prepaidPercent}% off on prepaid
            </p>
            <p className="mt-0.5 text-sm text-white/75">
              Pay with UPI, card or net banking. Up to {formatINR(SHIPPING.prepaidMax)} off, on top
              of any code.
            </p>
          </div>
          <span className="shrink-0 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold tracking-wider">
            AUTO
          </span>
        </li>
      </ul>
    </div>
  );
}
