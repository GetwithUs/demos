"use client";

import { ArrowRight, Heart, LayoutDashboard, MapPin, Package, Trash2 } from "lucide-react";
import Link from "next/link";
import { StatusChip } from "@/sites/skincare/components/orders/OrderView";
import ProductCard from "@/sites/skincare/components/ProductCard";
import ProductRail from "@/sites/skincare/components/ProductRail";
import ProductVisual from "@/sites/skincare/components/ProductVisual";
import { SectionHeading, buttonClass } from "@/sites/skincare/components/ui";
import { productBySlug } from "@/sites/skincare/data/products";
import { formatINR } from "@/sites/skincare/lib/pricing";
import { useDemoStore, useProducts, useStoreHydrated } from "@/sites/skincare/lib/store";
import { formatDate } from "@/sites/skincare/shop/orders";
import { useShopPrefs } from "@/sites/skincare/shop/prefs";

/** "My account": orders, wishlist and addresses saved in this browser. No sign-in on the demo. */
export default function AccountView() {
  const hydrated = useStoreHydrated();
  const orders = useDemoStore((s) => s.orders);
  const wishlist = useDemoStore((s) => s.wishlist);
  const products = useProducts();
  const addresses = useShopPrefs((s) => s.addresses);
  const removeAddress = useShopPrefs((s) => s.removeAddress);

  if (!hydrated) {
    return (
      <div className="mt-8 space-y-4" aria-busy="true">
        <div className="h-32 skin-skeleton rounded-3xl" />
        <div className="h-64 skin-skeleton rounded-3xl" />
      </div>
    );
  }

  const mine = orders.filter((o) => o.source === "visitor");
  const saved = wishlist
    .map((s) => products.find((p) => p.slug === s))
    .filter((p) => p !== undefined);
  const spent = mine
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totals.total, 0);

  return (
    <div className="mt-8 space-y-12">
      <dl className="grid grid-cols-3 gap-3">
        {[
          { label: "Orders", value: String(mine.length) },
          { label: "Wishlist", value: String(saved.length) },
          { label: "Spent", value: formatINR(spent) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-4 ring-1 ring-skin-line sm:p-6">
            <dt className="text-xs text-skin-subtle sm:text-sm">{s.label}</dt>
            <dd className="mt-1 font-skin-display text-2xl text-skin-ink sm:text-3xl">{s.value}</dd>
          </div>
        ))}
      </dl>

      <section id="orders" aria-labelledby="orders-title" className="scroll-mt-28">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="orders-title"
            className="flex items-center gap-2 font-skin-display text-3xl text-skin-ink"
          >
            <Package className="size-6 text-skin-accent" aria-hidden /> My orders
          </h2>
          <Link
            href="/skincare/track"
            className="text-sm font-medium text-skin-ink underline-offset-4 hover:underline"
          >
            Track by order ID
          </Link>
        </div>
        {mine.length ? (
          <ul className="mt-5 space-y-3">
            {mine.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/skincare/orders/${o.id}`}
                  className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-skin-line transition hover:ring-skin-ink/40 sm:p-5"
                >
                  <span className="flex -space-x-3">
                    {o.items.slice(0, 3).map((i) => {
                      const p = productBySlug(i.slug);
                      return (
                        <span
                          key={i.slug + i.variantId}
                          className="w-11 rounded-lg px-0.5 pt-0.5 ring-2 ring-white"
                          style={{ background: p?.visual.tint ?? "#f1ebe1" }}
                        >
                          {p ? <ProductVisual spec={p.visual} name={p.name} /> : null}
                        </span>
                      );
                    })}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-skin-ink">{o.id}</span>
                    <span className="text-xs text-skin-subtle">
                      {formatDate(o.createdAt)} · {o.items.reduce((n, i) => n + i.qty, 0)} items ·{" "}
                      {formatINR(o.totals.total)}
                    </span>
                  </span>
                  <StatusChip status={o.status} />
                  <ArrowRight className="size-4 text-skin-subtle" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-5 rounded-3xl bg-white p-8 text-center ring-1 ring-skin-line">
            <p className="text-skin-body">You have not placed an order from this browser yet.</p>
            <Link
              href="/skincare/shop?collection=bestsellers"
              className={buttonClass("primary", "md", "mt-4")}
            >
              Shop bestsellers
            </Link>
          </div>
        )}
      </section>

      <section aria-labelledby="wish-title">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="wish-title"
            className="flex items-center gap-2 font-skin-display text-3xl text-skin-ink"
          >
            <Heart className="size-6 text-skin-rose" aria-hidden /> Wishlist
          </h2>
          {saved.length ? (
            <Link
              href="/skincare/wishlist"
              className="text-sm font-medium text-skin-ink underline-offset-4 hover:underline"
            >
              View all
            </Link>
          ) : null}
        </div>
        {saved.length ? (
          <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-4">
            {saved.slice(0, 4).map((p) => (
              <li key={p.slug} className="flex">
                <ProductCard product={p} className="w-full" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-skin-subtle">
            Tap the heart on any product to save it here.
          </p>
        )}
      </section>

      <section aria-labelledby="addr-title">
        <h2
          id="addr-title"
          className="flex items-center gap-2 font-skin-display text-3xl text-skin-ink"
        >
          <MapPin className="size-6 text-skin-accent" aria-hidden /> Saved addresses
        </h2>
        {addresses.length ? (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {addresses.map((a) => (
              <li
                key={a.id}
                className="flex items-start justify-between gap-3 rounded-2xl bg-white p-5 text-sm ring-1 ring-skin-line"
              >
                <span>
                  <span className="flex items-center gap-2 font-medium text-skin-ink">
                    {a.name}
                    <span className="rounded-full bg-skin-sand px-2 py-0.5 text-[0.7rem] text-skin-subtle">
                      {a.label}
                    </span>
                  </span>
                  <span className="mt-1 block text-skin-body">
                    {a.line1}
                    {a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} {a.pincode}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => removeAddress(a.id)}
                  className="grid size-8 place-items-center rounded-full text-skin-subtle hover:bg-skin-sand hover:text-skin-rose-ink"
                  aria-label={`Remove address for ${a.name}`}
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-skin-subtle">
            Addresses you save at checkout appear here for one-tap reuse.
          </p>
        )}
      </section>

      <ProductRail
        source={{ kind: "recent" }}
        heading={<SectionHeading title="Recently viewed" />}
      />

      <Link
        href="/skincare/admin"
        className="group flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-skin-forest p-6 text-white sm:p-8"
      >
        <span className="flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-full bg-white/10">
            <LayoutDashboard className="size-6" aria-hidden />
          </span>
          <span>
            <span className="block font-skin-display text-2xl">Are you the shop owner?</span>
            <span className="text-sm text-white/75">
              See these orders arrive in the owner dashboard, change prices and stock, and watch the
              shop update.
            </span>
          </span>
        </span>
        <span className="inline-flex items-center gap-1 font-medium">
          Open the owner dashboard{" "}
          <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
        </span>
      </Link>
    </div>
  );
}
