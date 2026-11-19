"use client";

import {
  BadgeCheck,
  Check,
  ChevronDown,
  CircleAlert,
  FlaskConical,
  Leaf,
  MessageCircle,
  Moon,
  Rabbit,
  ShieldCheck,
  Sun,
  Tag,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { QtyStepper } from "@/sites/skincare/components/cart/CartParts";
import CopyCode from "@/sites/skincare/components/CopyCode";
import PincodeCheck from "@/sites/skincare/components/PincodeCheck";
import FrequentlyBought from "@/sites/skincare/components/product/FrequentlyBought";
import Gallery from "@/sites/skincare/components/product/Gallery";
import Reviews from "@/sites/skincare/components/product/Reviews";
import { WishlistButton } from "@/sites/skincare/components/ProductCard";
import ProductRail from "@/sites/skincare/components/ProductRail";
import ProductVisual from "@/sites/skincare/components/ProductVisual";
import {
  BadgePill,
  Breadcrumbs,
  Container,
  Price,
  SectionHeading,
  Stars,
  buttonClass,
} from "@/sites/skincare/components/ui";
import { CATEGORIES, CONCERNS, COUPONS, SHIPPING, SKIN_TYPES } from "@/sites/skincare/data/catalog";
import type { Product, SkinType } from "@/sites/skincare/data/types";
import { productFaqs } from "@/sites/skincare/content/faqs";
import { INGREDIENTS, productIngredientIds } from "@/sites/skincare/content/ingredients";
import { RESULTS, SPF_TESTS } from "@/sites/skincare/content/results";
import { formatINR } from "@/sites/skincare/lib/pricing";
import {
  useDemoStore,
  useProduct,
  useProducts,
  useStoreHydrated,
} from "@/sites/skincare/lib/store";
import { useAddToCart } from "@/sites/skincare/shop/actions";
import { useChat } from "@/sites/skincare/shop/chat";
import { defaultVariant, formatCount, LOW_STOCK } from "@/sites/skincare/shop/catalog";
import { bestOffer, bestValueVariantId, unitPrice } from "@/sites/skincare/shop/offers";

const ALL_SKIN: SkinType[] = ["oily", "combination", "normal", "dry", "sensitive"];

/** The product page, built from the live catalogue so dashboard edits show up straight away. */
export default function ProductView({ slug }: { slug: string }) {
  const product = useProduct(slug);
  const hydrated = useStoreHydrated();
  const markViewed = useDemoStore((s) => s.markViewed);

  useEffect(() => {
    if (hydrated && product) markViewed(slug);
  }, [hydrated, product, slug, markViewed]);

  if (!product) {
    if (!hydrated) return <ProductSkeleton />;
    return (
      <Container className="py-24 text-center">
        <p className="font-skin-display text-3xl text-skin-ink">
          This product is not available right now
        </p>
        <p className="mt-2 text-skin-subtle">
          It may have been switched off by the shop owner. Have a look at our bestsellers instead.
        </p>
        <Link
          href="/skincare/shop?collection=bestsellers"
          className={buttonClass("primary", "md", "mt-6")}
        >
          See bestsellers
        </Link>
      </Container>
    );
  }
  // Remount when the product changes so the chosen size resets.
  return <ProductDetail key={product.slug} product={product} />;
}

function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const products = useProducts();
  const addToCart = useAddToCart();
  const openChat = useChat((s) => s.openChat);
  const isFirstOrder = useDemoStore((s) => !s.orders.some((o) => o.source === "visitor"));
  // Start on the best-value size when it is in stock, as most stores do.
  const [variantId, setVariantId] = useState(() => {
    const best = product.variants.find((v) => v.id === bestValueVariantId(product) && v.stock > 0);
    return (best ?? defaultVariant(product)).id;
  });
  const [qty, setQty] = useState(1);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [ctaVisible, setCtaVisible] = useState(true);

  const variant = product.variants.find((v) => v.id === variantId) ?? defaultVariant(product);
  const soldOut = variant.stock < 1;
  const maxQty = Math.max(1, Math.min(10, variant.stock));
  const offer = soldOut ? undefined : bestOffer(product, variant, { isFirstOrder, prepaid: true });
  const bestValue = bestValueVariantId(product);
  const unit = unitPrice(variant);
  const results = RESULTS[product.slug];
  const spf = SPF_TESTS[product.slug];
  const cautions = INGREDIENTS.filter(
    (i) => productIngredientIds(product).includes(i.id) && i.avoidWith,
  ).map((i) => `${i.name}: avoid ${i.avoidWith!.charAt(0).toLowerCase()}${i.avoidWith!.slice(1)}`);

  // Show the sticky bar once the main buttons have scrolled up out of view. A scroll listener
  // (not IntersectionObserver) so jumps such as "back to top" are caught too.
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const el = ctaRef.current;
      if (el) setCtaVisible(el.getBoundingClientRect().bottom > 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const showSticky = !ctaVisible;
  useEffect(() => {
    const root = document.documentElement;
    if (showSticky) root.setAttribute("data-skin-sticky-bar", "");
    else root.removeAttribute("data-skin-sticky-bar");
    return () => root.removeAttribute("data-skin-sticky-bar");
  }, [showSticky]);

  const add = () => addToCart(product, variant.id, qty);
  const buyNow = () => {
    if (addToCart(product, variant.id, qty, { openCart: false })) router.push("/skincare/checkout");
  };

  const highlights = [
    product.fragranceFree ? { icon: Leaf, label: "Fragrance free" } : null,
    { icon: ShieldCheck, label: "Dermatologist tested" },
    { icon: Rabbit, label: "Cruelty free" },
    { icon: FlaskConical, label: "Non-comedogenic" },
  ].filter((h): h is { icon: typeof Leaf; label: string } => Boolean(h));

  return (
    <>
      <Container className="pt-5 sm:pt-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/skincare" },
            {
              label: CATEGORIES[product.category].plural,
              href: `/skincare/categories/${product.category}`,
            },
            { label: product.name },
          ]}
        />
        <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14 [&>*]:min-w-0">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Gallery product={product} />
          </div>

          <div>
            <div className="flex flex-wrap gap-1.5">
              {product.badges.map((b) => (
                <BadgePill key={b} badge={b} />
              ))}
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide text-skin-subtle uppercase ring-1 ring-skin-line">
                {product.when.includes("AM") ? <Sun className="size-3" aria-hidden /> : null}
                {product.when.includes("PM") ? <Moon className="size-3" aria-hidden /> : null}
                {product.when.join(" and ")}
              </span>
            </div>
            <h1 className="mt-3 font-skin-display text-[2rem] leading-[1.1] tracking-tight text-skin-ink sm:text-[2.6rem]">
              {product.name}
            </h1>
            <p className="mt-2 text-[1.02rem] text-skin-body">{product.tagline}</p>
            <a
              href="#reviews"
              className="mt-3 inline-flex items-center gap-2 text-sm text-skin-subtle hover:text-skin-ink"
            >
              <Stars rating={product.rating} size={16} />
              <span className="font-semibold text-skin-ink">{product.rating.toFixed(1)}</span>
              <span className="underline underline-offset-2">
                {formatCount(product.reviewCount)} reviews
              </span>
            </a>
            <p className="mt-3 text-sm text-skin-body">
              <span className="font-medium text-skin-ink">Best for: </span>
              {product.concerns.map((c) => CONCERNS[c].label.toLowerCase()).join(", ")}
            </p>

            <div className="mt-6 border-t border-skin-line pt-6">
              <Price price={variant.price} mrp={variant.mrp} size="lg" />
              <p className="mt-1.5 text-xs text-skin-subtle">
                Inclusive of all taxes{unit ? ` · ${unit}` : ""} · MRP shown is the maximum retail
                price
              </p>
              {offer && offer.price < variant.price ? (
                <p className="mt-3 inline-flex items-center gap-2 rounded-xl bg-skin-accent-soft px-3 py-2 text-sm text-skin-ink">
                  <Tag className="size-4 text-skin-accent" aria-hidden />
                  <span>
                    Best price <strong>{formatINR(offer.price)}</strong> with code{" "}
                    <strong className="tracking-wide">{offer.code}</strong> and prepaid
                  </span>
                </p>
              ) : null}
            </div>

            {product.variants.length > 1 ? (
              <fieldset className="mt-6">
                <legend className="text-sm font-medium text-skin-ink">
                  Size: <span className="font-normal text-skin-body">{variant.size}</span>
                </legend>
                <div className="mt-2.5 flex flex-wrap gap-2.5">
                  {product.variants.map((v) => {
                    const out = v.stock < 1;
                    return (
                      <label
                        key={v.id}
                        className={cn(
                          "relative flex min-w-28 cursor-pointer flex-col rounded-2xl border px-4 py-2.5 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-skin-accent",
                          v.id === variant.id
                            ? "border-skin-ink bg-white ring-1 ring-skin-ink"
                            : "border-skin-line bg-white hover:border-skin-ink/50",
                          out && "cursor-not-allowed opacity-50",
                        )}
                      >
                        <input
                          type="radio"
                          name="size"
                          value={v.id}
                          checked={v.id === variant.id}
                          disabled={out}
                          onChange={() => {
                            setVariantId(v.id);
                            setQty(1);
                          }}
                          className="sr-only"
                        />
                        <span className="text-sm font-semibold text-skin-ink">{v.size}</span>
                        <span className="text-xs text-skin-subtle">
                          {out ? "Sold out" : formatINR(v.price)}
                        </span>
                        {bestValue === v.id && !out ? (
                          <span className="absolute -top-2.5 right-2 rounded-full bg-skin-saffron-soft px-2 py-0.5 text-[0.62rem] font-bold tracking-wide text-skin-saffron-ink uppercase">
                            Best value
                          </span>
                        ) : null}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ) : (
              <p className="mt-6 text-sm text-skin-body">
                <span className="font-medium text-skin-ink">Size: </span>
                {variant.size}
              </p>
            )}

            <div ref={ctaRef} className="mt-6">
              {soldOut ? (
                <div className="rounded-2xl bg-skin-sand/70 p-4">
                  <p className="font-medium text-skin-ink">This size is sold out</p>
                  <p className="mt-1 text-sm text-skin-subtle">
                    We restock every week. Ask us on WhatsApp to be told when it is back.
                  </p>
                  <button
                    type="button"
                    onClick={openChat}
                    className={buttonClass("dark", "md", "mt-3")}
                  >
                    Notify me on WhatsApp
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <QtyStepper value={qty} max={maxQty} onChange={setQty} label="Quantity" />
                    <button
                      type="button"
                      onClick={add}
                      className={buttonClass("primary", "lg", "flex-1")}
                    >
                      Add to cart
                    </button>
                    <WishlistButton
                      product={product}
                      className="size-12 shrink-0 bg-white ring-1 ring-skin-line"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={buyNow}
                    className={buttonClass("dark", "lg", "mt-3 w-full")}
                  >
                    <Zap className="size-4" aria-hidden />
                    Buy now
                  </button>
                  {variant.stock < LOW_STOCK ? (
                    <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-skin-rose-ink">
                      <CircleAlert className="size-4" aria-hidden />
                      Hurry, only {variant.stock} left in stock
                    </p>
                  ) : null}
                </>
              )}
            </div>

            <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {highlights.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex flex-col items-center gap-1.5 rounded-2xl bg-white px-2 py-3 text-center text-xs text-skin-body ring-1 ring-skin-line"
                >
                  <Icon className="size-5 text-skin-accent" strokeWidth={1.6} aria-hidden />
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-4">
              <PincodeCheck />
              <Offers />
              <button
                type="button"
                onClick={openChat}
                className="flex w-full items-center gap-3 rounded-2xl border border-skin-line bg-white p-4 text-left transition hover:border-skin-ink/40"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-skin-wa/15 text-skin-wa-ink">
                  <MessageCircle className="size-5" aria-hidden />
                </span>
                <span className="text-sm">
                  <span className="block font-medium text-skin-ink">Not sure it suits you?</span>
                  <span className="text-skin-subtle">
                    Chat with a skin expert on WhatsApp, free.
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </Container>

      <Container className="mt-16 sm:mt-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14 [&>*]:min-w-0">
          <div>
            <h2 className="font-skin-display text-3xl tracking-tight text-skin-ink">
              About this product
            </h2>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-skin-body">
              {product.description}
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-[0.95rem] text-skin-ink">
                  <BadgeCheck className="mt-0.5 size-5 shrink-0 text-skin-accent" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-skin-display text-3xl tracking-tight text-skin-ink">
              Key ingredients
            </h2>
            <ul className="mt-4 space-y-3">
              {product.keyIngredients.map((k) => (
                <li
                  key={k.name}
                  className="flex items-center gap-4 rounded-2xl p-4"
                  style={{ background: product.visual.tint }}
                >
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white font-skin-display text-base text-skin-ink">
                    {k.amount ?? <Check className="size-5 text-skin-accent" aria-hidden />}
                  </span>
                  <span>
                    <span className="block font-medium text-skin-ink">{k.name}</span>
                    <span className="text-sm text-skin-body">{k.benefit}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-skin-line md:col-span-2">
            <h2 className="font-skin-display text-2xl text-skin-ink">How to use</h2>
            <ol className="mt-4 space-y-3">
              {product.howToUse.map((step, i) => (
                <li key={step} className="flex gap-3 text-[0.95rem] text-skin-body">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-skin-accent text-xs font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
                  product.when.includes("AM")
                    ? "bg-skin-saffron-soft text-skin-saffron-ink"
                    : "bg-skin-sand text-skin-subtle line-through",
                )}
              >
                <Sun className="size-4" aria-hidden /> Morning
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
                  product.when.includes("PM")
                    ? "bg-[#e6e3f1] text-[#4b3f7a]"
                    : "bg-skin-sand text-skin-subtle line-through",
                )}
              >
                <Moon className="size-4" aria-hidden /> Night
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl bg-white p-6 ring-1 ring-skin-line">
              <h2 className="font-skin-display text-2xl text-skin-ink">Suitable for</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {ALL_SKIN.map((t) => {
                  const ok = product.skinTypes.includes(t);
                  return (
                    <li
                      key={t}
                      className={cn(
                        "rounded-full px-3 py-1 text-sm",
                        ok
                          ? "bg-skin-accent-soft text-skin-accent"
                          : "bg-skin-sand text-skin-subtle",
                      )}
                    >
                      {ok ? SKIN_TYPES[t] : `Not ideal for ${SKIN_TYPES[t].toLowerCase()}`}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-sm text-skin-body">
                <span className="font-medium text-skin-ink">Texture: </span>
                {product.texture}
              </p>
            </div>
            {cautions.length || product.slug.includes("retinol") ? (
              <div className="rounded-3xl bg-skin-saffron-soft/70 p-6">
                <h2 className="flex items-center gap-2 font-medium text-skin-ink">
                  <CircleAlert className="size-4 text-skin-saffron-ink" aria-hidden />
                  Things to keep in mind
                </h2>
                <ul className="mt-2 space-y-1.5 text-sm text-skin-body">
                  {cautions.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                  <li>Patch test on your inner arm for 48 hours before first use.</li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <details className="group mt-4 rounded-3xl bg-white p-6 ring-1 ring-skin-line">
          <summary className="flex cursor-pointer list-none items-center justify-between font-skin-display text-2xl text-skin-ink [&::-webkit-details-marker]:hidden">
            Full ingredient list
            <ChevronDown className="size-5 transition group-open:rotate-180" aria-hidden />
          </summary>
          <p className="mt-4 text-sm leading-relaxed text-skin-body">{product.ingredients}</p>
          <p className="mt-3 text-xs text-skin-subtle">
            Free from: added fragrance, parabens, sulphates, mineral oil and dyes. Ingredient lists
            can change; always check the pack.
          </p>
        </details>
      </Container>

      {results || spf ? (
        <Container className="mt-16 sm:mt-20">
          <div className="rounded-[2rem] bg-skin-forest px-6 py-10 text-white sm:px-10">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#b9d3c4] uppercase">
              Tested results
            </p>
            <h2 className="mt-2 font-skin-display text-3xl sm:text-4xl">What testing showed</h2>
            {results ? (
              <>
                <ul className="mt-8 grid gap-6 sm:grid-cols-3">
                  {results.stats.map((s) => (
                    <li key={s.label} className="border-t border-white/20 pt-4">
                      <p className="font-skin-display text-5xl">{s.value}</p>
                      <p className="mt-2 text-sm text-white/80">{s.label}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xs text-white/65">
                  {results.study} Sample data for this demo store. Results vary from person to
                  person.
                </p>
              </>
            ) : null}
            {spf ? (
              <div className="mt-8 grid gap-3 rounded-2xl bg-white/[0.08] p-5 text-sm sm:grid-cols-4">
                <div>
                  <p className="text-white/60">Method</p>
                  <p className="font-medium">{spf.method}</p>
                </div>
                <div>
                  <p className="text-white/60">SPF value</p>
                  <p className="font-medium">{spf.measured}</p>
                </div>
                <div>
                  <p className="text-white/60">UVA</p>
                  <p className="font-medium">{spf.uva}</p>
                </div>
                <div>
                  <p className="text-white/60">Lab</p>
                  <p className="font-medium">{spf.lab}</p>
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      ) : null}

      <Container className="mt-16 sm:mt-20">
        <FrequentlyBought product={product} variant={variant} products={products} />
      </Container>

      <Container className="mt-16 sm:mt-20">
        <Reviews product={product} />
      </Container>

      <Container className="mt-16 sm:mt-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] [&>*]:min-w-0">
          <div>
            <h2 className="font-skin-display text-3xl tracking-tight text-skin-ink">
              Questions, answered
            </h2>
            <p className="mt-2 text-sm text-skin-subtle">
              Still unsure?{" "}
              <button
                type="button"
                onClick={openChat}
                className="font-medium text-skin-ink underline"
              >
                Ask us on WhatsApp
              </button>{" "}
              or read the{" "}
              <Link href="/skincare/faqs" className="font-medium text-skin-ink underline">
                help centre
              </Link>
              .
            </p>
          </div>
          <div className="divide-y divide-skin-line border-y border-skin-line">
            {productFaqs(product).map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-skin-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown
                    className="size-5 shrink-0 transition group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-skin-body">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>

      <Container className="mt-16 sm:mt-20">
        <ProductRail
          source={{ kind: "related", slug: product.slug, concerns: product.concerns }}
          heading={<SectionHeading eyebrow="For the same concerns" title="You may also like" />}
        />
      </Container>
      <Container className="mt-16 sm:mt-20">
        <ProductRail
          source={{ kind: "recent", exclude: product.slug }}
          heading={<SectionHeading title="Recently viewed" />}
        />
      </Container>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t border-skin-line bg-white/95 backdrop-blur transition duration-300",
          showSticky ? "translate-y-0" : "pointer-events-none translate-y-full",
        )}
        aria-hidden={!showSticky}
        inert={!showSticky}
      >
        <div className="mx-auto flex max-w-[1320px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <span
            className="w-11 shrink-0 rounded-lg px-1 pt-1"
            style={{ background: product.visual.tint }}
          >
            <ProductVisual spec={product.visual} name={product.name} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-skin-ink">{product.name}</p>
            <p className="text-sm text-skin-ink">
              <span className="font-semibold">{formatINR(variant.price)}</span>{" "}
              <s className="text-xs text-skin-subtle">{formatINR(variant.mrp)}</s>{" "}
              <span className="text-xs text-skin-subtle">· {variant.size}</span>
            </p>
          </div>
          {soldOut ? (
            <button type="button" onClick={openChat} className={buttonClass("dark", "md")}>
              Notify me
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={buyNow}
                className={buttonClass("outline", "md", "hidden sm:inline-flex")}
              >
                Buy now
              </button>
              <button type="button" onClick={add} className={buttonClass("primary", "md")}>
                Add to cart
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function Offers() {
  const coupons = COUPONS.filter((c) => c.active);
  return (
    <div className="rounded-2xl border border-skin-line bg-white p-4">
      <p className="flex items-center gap-2 text-sm font-medium text-skin-ink">
        <Tag className="size-4 text-skin-accent" aria-hidden />
        Offers for you
      </p>
      <ul className="mt-3 space-y-2.5">
        {coupons.map((c) => (
          <li key={c.code} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-skin-body">{c.description}</span>
            <CopyCode code={c.code} className="shrink-0" />
          </li>
        ))}
        <li className="flex items-center justify-between gap-3 text-sm">
          <span className="text-skin-body">
            Extra {SHIPPING.prepaidPercent}% off on UPI, cards and net banking, up to{" "}
            {formatINR(SHIPPING.prepaidMax)}
          </span>
          <span className="shrink-0 rounded-lg bg-skin-sand px-2.5 py-1 text-xs font-semibold text-skin-subtle">
            AUTO
          </span>
        </li>
      </ul>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <Container className="pt-6" aria-busy="true">
      <div className="h-4 w-60 skin-skeleton rounded" />
      <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14 [&>*]:min-w-0">
        <div className="aspect-[4/5] skin-skeleton rounded-[1.75rem]" />
        <div className="space-y-4">
          <div className="h-10 w-4/5 skin-skeleton rounded" />
          <div className="h-5 w-2/3 skin-skeleton rounded" />
          <div className="h-8 w-1/3 skin-skeleton rounded" />
          <div className="h-12 skin-skeleton rounded-full" />
          <div className="h-32 skin-skeleton rounded-2xl" />
        </div>
      </div>
    </Container>
  );
}
