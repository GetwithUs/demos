"use client";

import { ArrowRight, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import Dialog from "@/sites/skincare/components/Dialog";
import ProductCard, { ProductCardSkeleton } from "@/sites/skincare/components/ProductCard";
import { Breadcrumbs, buttonClass } from "@/sites/skincare/components/ui";
import { CATEGORIES, CONCERNS, SKIN_TYPES } from "@/sites/skincare/data/catalog";
import type { Product } from "@/sites/skincare/data/types";
import {
  INGREDIENTS,
  ingredientById,
  productIngredientIds,
} from "@/sites/skincare/content/ingredients";
import { useProducts } from "@/sites/skincare/lib/store";
import {
  activeFilterCount,
  applyFilters,
  EMPTY_FILTERS,
  filtersToQuery,
  parseFilters,
  PRICE_BANDS,
  SORTS,
  type ShopFilters,
  type SortKey,
} from "@/sites/skincare/shop/catalog";

type ListKey = "concern" | "category" | "skin" | "ingredient" | "price";

type Group = { key: ListKey; title: string; options: { value: string; label: string }[] };

const GROUPS: Group[] = [
  {
    key: "concern",
    title: "Concern",
    options: Object.entries(CONCERNS).map(([value, c]) => ({ value, label: c.label })),
  },
  {
    key: "category",
    title: "Category",
    options: Object.entries(CATEGORIES).map(([value, c]) => ({ value, label: c.plural })),
  },
  {
    key: "skin",
    title: "Skin type",
    options: Object.entries(SKIN_TYPES).map(([value, label]) => ({ value, label })),
  },
  {
    key: "ingredient",
    title: "Key ingredient",
    options: INGREDIENTS.map((i) => ({ value: i.id, label: i.name })),
  },
  {
    key: "price",
    title: "Price",
    options: PRICE_BANDS.map((b) => ({ value: b.id, label: b.label })),
  },
];

/** Today's date, fixed per page load, for "new launch" checks. */
const TODAY = new Date();

/**
 * Product listing with filters and sort kept in the URL, so filtered views can be shared and
 * the back button works. `fixed` pins a filter for concern and category landing pages.
 */
export default function Listing({
  fixed = {},
  showHeader = false,
}: {
  fixed?: Partial<Pick<ShopFilters, "concern" | "category">>;
  /** Show the title and breadcrumbs (on /skincare/shop, where they depend on the URL). */
  showHeader?: boolean;
}) {
  const params = useSearchParams();
  const products = useProducts();
  const [drawer, setDrawer] = useState(false);
  // The latest change, shown straight away while the URL catches up (keyed by the URL it was based on).
  const [pending, setPending] = useState<{ base: string; filters: ShopFilters } | null>(null);

  const query = params.toString();
  const fromUrl = useMemo(() => parseFilters(new URLSearchParams(query)), [query]);
  const filters: ShopFilters =
    pending && pending.base === query ? pending.filters : { ...fromUrl, ...fixed };
  const hidden = new Set(Object.keys(fixed));
  const results = applyFilters(products, filters, TODAY);

  const update = (next: ShopFilters) => {
    setPending({ base: query, filters: next });
    const own = { ...next };
    for (const k of hidden) (own as Record<string, unknown>)[k] = [];
    const q = filtersToQuery(own);
    // Filtering happens in the browser, so update the URL without a server round trip.
    window.history.replaceState(
      null,
      "",
      q ? `${window.location.pathname}?${q}` : window.location.pathname,
    );
  };
  const toggle = (key: ListKey, value: string) => {
    const current = filters[key] as string[];
    update({
      ...filters,
      [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    });
  };
  const clearAll = () =>
    update({ ...EMPTY_FILTERS, q: filters.q, collection: filters.collection, sort: filters.sort });

  const count = activeFilterCount({
    ...filters,
    ...Object.fromEntries([...hidden].map((k) => [k, []])),
  });
  const groups = GROUPS.filter((g) => !hidden.has(g.key));

  return (
    <div>
      {showHeader ? <ListingHeader filters={filters} total={results.length} /> : null}

      <div className="sticky top-16 z-20 -mx-4 mt-6 flex items-center justify-between gap-3 border-y border-skin-line bg-skin-bg/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
        <button
          type="button"
          onClick={() => setDrawer(true)}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-skin-line bg-white px-4 text-sm font-medium text-skin-ink lg:hidden"
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          Filters{count ? ` (${count})` : ""}
        </button>
        <p className="hidden text-sm text-skin-subtle lg:block" aria-live="polite">
          Showing <strong className="text-skin-ink">{results.length}</strong>{" "}
          {results.length === 1 ? "product" : "products"}
        </p>
        <SortSelect value={filters.sort} onChange={(sort) => update({ ...filters, sort })} />
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-[250px_1fr] [&>*]:min-w-0">
        <aside className="hidden lg:block" aria-label="Filters">
          <FilterPanel
            filters={filters}
            products={products}
            groups={groups}
            hidden={hidden}
            onToggle={toggle}
            onUpdate={update}
          />
        </aside>

        <div>
          {count ? (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {groups.flatMap((g) =>
                (filters[g.key] as string[]).map((v) => (
                  <button
                    key={`${g.key}-${v}`}
                    type="button"
                    onClick={() => toggle(g.key, v)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-skin-ink px-3 py-1.5 text-xs font-medium text-white"
                  >
                    {g.options.find((o) => o.value === v)?.label}
                    <X className="size-3.5" aria-label="Remove filter" />
                  </button>
                )),
              )}
              {filters.inStock ? (
                <Chip label="In stock" onRemove={() => update({ ...filters, inStock: false })} />
              ) : null}
              {filters.fragranceFree ? (
                <Chip
                  label="Fragrance free"
                  onRemove={() => update({ ...filters, fragranceFree: false })}
                />
              ) : null}
              <button
                type="button"
                onClick={clearAll}
                className="ml-1 text-xs font-medium text-skin-ink underline"
              >
                Clear all
              </button>
            </div>
          ) : null}

          <p className="mb-4 text-sm text-skin-subtle lg:hidden" aria-live="polite">
            {results.length} {results.length === 1 ? "product" : "products"}
          </p>

          {results.length ? (
            <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3">
              {results.map((p) => (
                <li key={p.slug} className="flex">
                  <ProductCard product={p} className="w-full" />
                </li>
              ))}
              {!count && !filters.q && !hidden.size && results.length > 5 ? (
                <li className="col-span-2 md:col-span-1">
                  <QuizPromo />
                </li>
              ) : null}
            </ul>
          ) : (
            <div className="rounded-3xl bg-white px-6 py-14 text-center">
              <p className="font-skin-display text-2xl text-skin-ink">
                No products match these filters
              </p>
              <p className="mt-2 text-sm text-skin-subtle">
                Try removing a filter, or let the skin quiz pick for you.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={clearAll} className={buttonClass("primary", "md")}>
                  Clear filters
                </button>
                <Link href="/skincare/skin-quiz" className={buttonClass("outline", "md")}>
                  Take the skin quiz
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={drawer}
        onClose={() => setDrawer(false)}
        side="left"
        label="Filters"
        className="w-[min(90vw,380px)]"
      >
        <div className="flex h-dvh flex-col bg-skin-bg">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-skin-line px-5">
            <p className="font-skin-display text-xl text-skin-ink">Filters</p>
            <button
              type="button"
              onClick={() => setDrawer(false)}
              className="grid size-10 place-items-center rounded-full hover:bg-skin-sand"
              aria-label="Close filters"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <FilterPanel
              filters={filters}
              products={products}
              groups={groups}
              hidden={hidden}
              onToggle={toggle}
              onUpdate={update}
            />
          </div>
          <div className="flex shrink-0 gap-3 border-t border-skin-line bg-white p-4">
            <button
              type="button"
              onClick={clearAll}
              className={buttonClass("outline", "md", "flex-1")}
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={() => setDrawer(false)}
              className={buttonClass("primary", "md", "flex-[1.4]")}
            >
              Show {results.length} {results.length === 1 ? "product" : "products"}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 rounded-full bg-skin-ink px-3 py-1.5 text-xs font-medium text-white"
    >
      {label}
      <X className="size-3.5" aria-label="Remove filter" />
    </button>
  );
}

function SortSelect({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="hidden text-sm text-skin-subtle sm:block">
        Sort by
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as SortKey)}
          className="h-10 appearance-none rounded-full border border-skin-line bg-white py-0 pr-9 pl-4 text-sm font-medium text-skin-ink focus:border-skin-accent focus:outline-none"
          aria-label="Sort products"
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-skin-subtle"
          aria-hidden
        />
      </div>
    </div>
  );
}

function FilterPanel({
  filters,
  products,
  groups,
  hidden,
  onToggle,
  onUpdate,
}: {
  filters: ShopFilters;
  products: Product[];
  groups: Group[];
  hidden: Set<string>;
  onToggle: (key: ListKey, value: string) => void;
  onUpdate: (f: ShopFilters) => void;
}) {
  // How many products each option would show, given the other filters.
  const countFor = (key: ListKey, value: string) =>
    applyFilters(products, { ...filters, [key]: [value] }, TODAY).length;
  const usedIngredients = new Set(products.flatMap((p) => productIngredientIds(p)));

  return (
    <div className="divide-y divide-skin-line">
      {groups.map((g) => {
        const options =
          g.key === "ingredient"
            ? g.options.filter((o) => usedIngredients.has(o.value))
            : g.options;
        const selected = filters[g.key] as string[];
        return (
          <details
            key={g.key}
            open={g.key !== "price" || selected.length > 0 || hidden.size > 0}
            className="group py-4 first:pt-0"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-skin-ink [&::-webkit-details-marker]:hidden">
              {g.title}
              {selected.length ? (
                <span className="ml-2 rounded-full bg-skin-accent-soft px-2 text-xs text-skin-accent">
                  {selected.length}
                </span>
              ) : null}
              <ChevronDown
                className="ml-auto size-4 transition group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <fieldset className="mt-3 space-y-1.5">
              <legend className="sr-only">{g.title}</legend>
              {options.map((o) => {
                const n = countFor(g.key, o.value);
                const checked = selected.includes(o.value);
                return (
                  <label
                    key={o.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg py-1 text-sm text-skin-body hover:text-skin-ink",
                      !n && !checked && "cursor-not-allowed opacity-45",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={!n && !checked}
                      onChange={() => onToggle(g.key, o.value)}
                      className="size-4 rounded accent-skin-accent"
                    />
                    <span className="flex-1">{o.label}</span>
                    <span className="text-xs text-skin-subtle tabular-nums">{n}</span>
                  </label>
                );
              })}
            </fieldset>
          </details>
        );
      })}
      <fieldset className="space-y-2 py-4">
        <legend className="mb-2 text-sm font-semibold text-skin-ink">More</legend>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-skin-body">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => onUpdate({ ...filters, inStock: e.target.checked })}
            className="size-4 accent-skin-accent"
          />
          In stock only
        </label>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-skin-body">
          <input
            type="checkbox"
            checked={filters.fragranceFree}
            onChange={(e) => onUpdate({ ...filters, fragranceFree: e.target.checked })}
            className="size-4 accent-skin-accent"
          />
          Fragrance free
        </label>
      </fieldset>
    </div>
  );
}

function ListingHeader({ filters, total }: { filters: ShopFilters; total: number }) {
  const ingredient =
    filters.ingredient.length === 1 ? ingredientById(filters.ingredient[0]) : undefined;
  let title = "Shop all skincare";
  let text: string = "Clinical actives at honest strengths, for every Indian skin type.";
  let crumb = "Shop all";
  if (filters.q) {
    title = `Results for “${filters.q}”`;
    text = `${total} ${total === 1 ? "product matches" : "products match"} your search.`;
    crumb = "Search";
  } else if (filters.collection === "bestsellers") {
    title = "Bestsellers";
    text = "The formulas with the most reorders and reviews.";
    crumb = title;
  } else if (filters.collection === "new") {
    title = "New launches";
    text = "Fresh from our Dehradun lab.";
    crumb = title;
  } else if (filters.collection === "kits") {
    title = "Routine kits";
    text = "Complete routines in one box, for less.";
    crumb = title;
  } else if (ingredient) {
    title = `${ingredient.name}`;
    text = ingredient.whatItDoes;
    crumb = ingredient.name;
  }

  return (
    <div className="pt-6 sm:pt-8">
      <Breadcrumbs items={[{ label: "Home", href: "/skincare" }, { label: crumb }]} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="font-skin-display text-4xl leading-tight tracking-tight text-skin-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-skin-body">{text}</p>
        </div>
        {ingredient ? (
          <Link
            href={`/skincare/ingredients#${ingredient.id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-skin-ink underline-offset-4 hover:underline"
          >
            How to use {ingredient.name.toLowerCase()} <ArrowRight className="size-4" aria-hidden />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function QuizPromo() {
  return (
    <Link
      href="/skincare/skin-quiz"
      className="group flex h-full min-h-64 flex-col justify-between rounded-2xl bg-skin-forest p-6 text-white transition hover:-translate-y-1"
    >
      <p className="text-xs font-semibold tracking-[0.18em] text-[#b9d3c4] uppercase">Skin quiz</p>
      <div>
        <p className="font-skin-display text-3xl leading-tight">Not sure what to pick?</p>
        <p className="mt-2 text-sm text-white/80">
          Seven questions, two minutes, one routine made for you.
        </p>
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium">
          Start the quiz{" "}
          <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function ListingSkeleton() {
  return (
    <div
      className="mt-6 grid gap-10 lg:grid-cols-[250px_1fr] [&>*]:min-w-0"
      aria-busy="true"
      aria-label="Loading products"
    >
      <div className="hidden space-y-3 lg:block">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-6 skin-skeleton rounded" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
