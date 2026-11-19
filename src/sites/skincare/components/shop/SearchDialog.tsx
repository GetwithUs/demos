"use client";

import { ArrowRight, Clock, Search, TrendingUp, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import Dialog from "@/sites/skincare/components/Dialog";
import ProductVisual from "@/sites/skincare/components/ProductVisual";
import { Price } from "@/sites/skincare/components/ui";
import { POPULAR_SEARCHES } from "@/sites/skincare/content/nav";
import { useProducts } from "@/sites/skincare/lib/store";
import {
  defaultVariant,
  searchProducts,
  searchShortcuts,
  sortProducts,
} from "@/sites/skincare/shop/catalog";
import { useShopPrefs } from "@/sites/skincare/shop/prefs";

type Option = { key: string; href: string; label: string };

/** Search overlay with instant suggestions, recent and popular searches. */
export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      side="top"
      label="Search"
      className="max-h-[92dvh] w-full"
    >
      {/* Remount on every open so the field starts empty. */}
      {open ? <SearchPanel onClose={onClose} /> : null}
    </Dialog>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const products = useProducts();
  const recent = useShopPrefs((s) => s.recentSearches);
  const addRecent = useShopPrefs((s) => s.addRecentSearch);
  const clearRecent = useShopPrefs((s) => s.clearRecentSearches);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);
  const listId = useId();

  const q = query.trim();
  const results = useMemo(() => (q.length > 1 ? searchProducts(q, products) : []), [q, products]);
  const shortcuts = useMemo(() => searchShortcuts(q), [q]);
  const trending = useMemo(() => sortProducts(products, "popular").slice(0, 4), [products]);

  const options: Option[] = [
    ...shortcuts.map((s) => ({ key: `s-${s.href}`, href: s.href, label: s.label })),
    ...results
      .slice(0, 6)
      .map((p) => ({ key: p.slug, href: `/skincare/products/${p.slug}`, label: p.name })),
  ];

  const go = (href: string, remember?: string) => {
    if (remember) addRecent(remember);
    onClose();
    router.push(href);
  };
  const submit = (text = q) => {
    if (!text) return;
    go(`/skincare/shop?q=${encodeURIComponent(text)}`, text);
  };

  return (
    <div className="max-h-[92dvh] overflow-y-auto bg-skin-bg shadow-2xl">
      <div className="mx-auto max-w-3xl px-4 pt-4 pb-8 sm:px-6 sm:pt-8">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (active >= 0 && options[active]) go(options[active].href, q);
            else submit();
          }}
          className="flex items-center gap-2"
        >
          <label className="relative flex-1">
            <span className="sr-only">Search the shop</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-skin-subtle"
              aria-hidden
            />
            <input
              autoFocus
              type="search"
              role="combobox"
              aria-expanded={options.length > 0}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={
                active >= 0 && options[active] ? `${listId}-${active}` : undefined
              }
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(-1);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((i) => Math.min(options.length - 1, i + 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((i) => Math.max(-1, i - 1));
                }
              }}
              placeholder="Search for niacinamide, sunscreen, acne..."
              className="h-14 w-full rounded-full border border-skin-line bg-white pr-4 pl-12 text-base text-skin-ink shadow-sm outline-none placeholder:text-skin-subtle focus:border-skin-accent focus:ring-2 focus:ring-skin-accent/20 [&::-webkit-search-cancel-button]:appearance-none"
            />
          </label>
          <button
            type="button"
            onClick={onClose}
            className="grid size-12 shrink-0 place-items-center rounded-full text-skin-ink hover:bg-skin-sand"
            aria-label="Close search"
          >
            <X className="size-5" aria-hidden />
          </button>
        </form>

        {q.length > 1 ? (
          <div className="mt-6">
            <ul id={listId} role="listbox" aria-label="Suggestions" className="space-y-1">
              {options.map((o, i) => {
                const product = results.find((p) => p.slug === o.key);
                const shortcut = shortcuts.find((s) => `s-${s.href}` === o.key);
                return (
                  <li key={o.key} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                    <Link
                      href={o.href}
                      tabIndex={-1}
                      onClick={() => {
                        addRecent(q);
                        onClose();
                      }}
                      onMouseEnter={() => setActive(i)}
                      className={cn(
                        "flex items-center gap-4 rounded-xl px-3 py-2.5 transition",
                        i === active ? "bg-skin-sand" : "hover:bg-skin-sand/70",
                      )}
                    >
                      {product ? (
                        <>
                          <span
                            className="w-12 shrink-0 rounded-lg px-1 pt-1"
                            style={{ background: product.visual.tint }}
                          >
                            <ProductVisual spec={product.visual} name={product.name} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[0.95rem] font-medium text-skin-ink">
                              {product.name}
                            </span>
                            <span className="block truncate text-xs text-skin-subtle">
                              {product.tagline}
                            </span>
                          </span>
                          <Price
                            price={defaultVariant(product).price}
                            mrp={defaultVariant(product).mrp}
                            size="sm"
                            className="hidden sm:inline-flex"
                          />
                        </>
                      ) : (
                        <>
                          <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-skin-accent-soft text-skin-accent">
                            <Search className="size-4" aria-hidden />
                          </span>
                          <span className="flex-1 text-[0.95rem] text-skin-ink">{o.label}</span>
                          <span className="text-xs text-skin-subtle">{shortcut?.hint}</span>
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {results.length ? (
              <button
                type="button"
                onClick={() => submit()}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-skin-accent hover:underline"
              >
                See all {results.length} results for &ldquo;{q}&rdquo;
                <ArrowRight className="size-4" aria-hidden />
              </button>
            ) : (
              <div className="rounded-2xl bg-white p-5 text-sm text-skin-body">
                <p className="font-medium text-skin-ink">No products match &ldquo;{q}&rdquo;.</p>
                <p className="mt-1">
                  Try an ingredient like niacinamide, or a concern like acne or tan.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 grid gap-8 sm:grid-cols-[1fr_1.4fr]">
            <div className="space-y-6">
              {recent.length ? (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold tracking-[0.16em] text-skin-subtle uppercase">
                      Recent searches
                    </p>
                    <button
                      type="button"
                      onClick={clearRecent}
                      className="text-xs text-skin-subtle underline hover:text-skin-ink"
                    >
                      Clear
                    </button>
                  </div>
                  <ul className="mt-3 space-y-1">
                    {recent.map((r) => (
                      <li key={r}>
                        <button
                          type="button"
                          onClick={() => submit(r)}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-skin-ink hover:bg-skin-sand"
                        >
                          <Clock className="size-4 text-skin-subtle" aria-hidden />
                          {r}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-skin-subtle uppercase">
                  Popular searches
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => submit(s)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-skin-line bg-white px-3.5 py-1.5 text-sm text-skin-ink transition hover:border-skin-ink"
                      >
                        <TrendingUp className="size-3.5 text-skin-accent" aria-hidden />
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-skin-subtle uppercase">
                Trending now
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-3">
                {trending.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/skincare/products/${p.slug}`}
                      onClick={onClose}
                      className="group flex items-center gap-3 rounded-xl p-1.5 hover:bg-skin-sand"
                    >
                      <span
                        className="w-14 shrink-0 rounded-lg px-1 pt-1"
                        style={{ background: p.visual.tint }}
                      >
                        <ProductVisual spec={p.visual} name={p.name} />
                      </span>
                      <span className="text-[0.82rem] leading-snug font-medium text-skin-ink group-hover:underline">
                        {p.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
