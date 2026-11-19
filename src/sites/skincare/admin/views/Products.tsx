"use client";

import { LayoutGrid, List, PackageSearch, Plus, Search, Star } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { CATEGORIES } from "@/sites/skincare/data/catalog";
import type { CategoryId, Product } from "@/sites/skincare/data/types";
import { formatINR } from "@/sites/skincare/lib/pricing";
import { totalStock, useDemoStore, useProducts } from "@/sites/skincare/lib/store";
import ProductVisual from "@/sites/skincare/components/ProductVisual";
import ProductThumb from "@/sites/skincare/admin/components/ProductThumb";
import { useToast } from "@/sites/skincare/admin/components/Toast";
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  EmptyState,
  inputClass,
  PageHeader,
  PageSkeleton,
  Segmented,
  Select,
} from "@/sites/skincare/admin/components/ui";
import { formatNumber, plural } from "@/sites/skincare/admin/lib/format";
import { useAdminReady } from "@/sites/skincare/admin/lib/hooks";
import { LOW_STOCK } from "@/sites/skincare/admin/lib/metrics";

function priceRange(p: Product, key: "price" | "mrp"): string {
  const values = p.variants.map((v) => v[key]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? formatINR(min) : `${formatINR(min)} to ${formatINR(max)}`;
}

function StockCell({ product }: { product: Product }) {
  const stock = totalStock(product);
  const low = product.variants.filter((v) => v.stock < LOW_STOCK);
  return (
    <span className="flex flex-col items-start gap-1">
      <span className={cn("tabular-nums", stock === 0 ? "text-red-700" : "text-stone-900")}>
        {formatNumber(stock)} in stock
      </span>
      {low.length ? (
        <Badge tone={low.some((v) => v.stock === 0) ? "red" : "amber"}>
          {low.length === product.variants.length && product.variants.length === 1
            ? low[0].stock === 0
              ? "Out of stock"
              : "Low stock"
            : `${low.map((v) => v.size).join(", ")} low`}
        </Badge>
      ) : null}
    </span>
  );
}

function ActiveSwitch({ product }: { product: Product }) {
  const updateProduct = useDemoStore((s) => s.updateProduct);
  const toast = useToast();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={product.active}
      aria-label={`Show ${product.name} in the shop`}
      onClick={() => {
        updateProduct(product.slug, { active: !product.active });
        toast({
          title: product.active ? `${product.name} is now a draft` : `${product.name} is live`,
          description: product.active
            ? "Hidden from the shop straight away."
            : "Visible in the shop straight away.",
          tone: product.active ? "info" : "success",
        });
      }}
      className="inline-flex items-center gap-2 rounded-full text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-skin-accent"
    >
      <span
        className={cn(
          "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
          product.active ? "bg-skin-accent" : "bg-stone-300",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "inline-block size-4 rounded-full bg-white shadow transition-transform",
            product.active ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </span>
      <span className={product.active ? "text-emerald-800" : "text-stone-600"}>
        {product.active ? "Active" : "Draft"}
      </span>
    </button>
  );
}

export default function Products() {
  const ready = useAdminReady();
  const products = useProducts({ includeInactive: true });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | CategoryId>("all");
  const [status, setStatus] = useState<"all" | "active" | "draft">("all");
  const [view, setView] = useState<"table" | "grid">("table");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (status === "all" || (status === "active" ? p.active : !p.active)) &&
        (!q || p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q)),
    );
  }, [products, query, category, status]);

  if (!ready) return <PageSkeleton rows={1} />;

  const active = products.filter((p) => p.active).length;

  return (
    <div>
      <PageHeader
        title="Products"
        description={`${plural(products.length, "product")}, ${active} live in the shop and ${products.length - active} in draft`}
        actions={
          <ButtonLink href="/skincare/admin/products/new" variant="primary">
            <Plus aria-hidden className="size-4" />
            Add product
          </ButtonLink>
        }
      />

      <Card>
        <div className="flex flex-col gap-2 p-3 sm:p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-500"
            />
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>
            <input
              id="product-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className={cn(inputClass, "pl-9")}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <label htmlFor="cat-filter" className="sr-only">
              Category
            </label>
            <Select
              id="cat-filter"
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryId | "all")}
              className="w-auto min-w-0 flex-1 sm:w-48 sm:flex-none"
            >
              <option value="all">All categories</option>
              {(Object.keys(CATEGORIES) as CategoryId[]).map((c) => (
                <option key={c} value={c}>
                  {CATEGORIES[c].plural}
                </option>
              ))}
            </Select>
            <label htmlFor="status-filter" className="sr-only">
              Status
            </label>
            <Select
              id="status-filter"
              value={status}
              onChange={(e) => setStatus(e.target.value as "all" | "active" | "draft")}
              className="w-auto min-w-0 flex-1 sm:w-36 sm:flex-none"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </Select>
            <Segmented
              label="View"
              className="hidden md:inline-flex"
              value={view}
              onChange={setView}
              options={[
                {
                  value: "table",
                  label: (
                    <>
                      <List aria-hidden className="size-4" />
                      <span className="sr-only">Table</span>
                    </>
                  ),
                },
                {
                  value: "grid",
                  label: (
                    <>
                      <LayoutGrid aria-hidden className="size-4" />
                      <span className="sr-only">Grid</span>
                    </>
                  ),
                },
              ]}
            />
          </div>
        </div>

        {!list.length ? (
          <EmptyState
            icon={<PackageSearch />}
            title="No products match"
            description="Try another search or clear the filters."
            action={
              <Button
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                  setStatus("all");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : view === "table" ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Products</caption>
                <thead>
                  <tr className="border-y border-stone-200 bg-stone-50/70 text-[0.75rem] text-stone-600">
                    <th scope="col" className="px-4 py-2.5 font-medium">
                      Product
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-medium">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-2.5 text-right font-medium">
                      Price
                    </th>
                    <th scope="col" className="px-3 py-2.5 text-right font-medium">
                      MRP
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-medium">
                      Stock
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-medium">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {list.map((p) => (
                    <tr key={p.slug} className="hover:bg-stone-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ProductThumb spec={p.visual} name={p.name} size="md" />
                          <div className="min-w-0">
                            <Link
                              href={`/skincare/admin/products/${p.slug}`}
                              className="font-medium text-stone-900 hover:underline"
                            >
                              {p.name}
                            </Link>
                            <p className="text-xs text-stone-500">
                              {CATEGORIES[p.category].label} · {plural(p.variants.length, "size")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <ActiveSwitch product={p} />
                      </td>
                      <td className="px-3 py-3 text-right whitespace-nowrap text-stone-900 tabular-nums">
                        {priceRange(p, "price")}
                      </td>
                      <td className="px-3 py-3 text-right whitespace-nowrap text-stone-500 tabular-nums">
                        {priceRange(p, "mrp")}
                      </td>
                      <td className="px-3 py-3">
                        <StockCell product={p} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {p.reviewCount ? (
                          <span className="inline-flex items-center gap-1 text-stone-800 tabular-nums">
                            <Star aria-hidden className="size-3.5 fill-skin-star text-skin-star" />
                            {p.rating.toFixed(1)}
                            <span className="text-xs text-stone-500">
                              ({formatNumber(p.reviewCount)})
                            </span>
                          </span>
                        ) : (
                          <span className="text-xs text-stone-500">No reviews yet</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul
              className="divide-y divide-stone-100 border-t border-stone-100 md:hidden"
              aria-label="Products"
            >
              {list.map((p) => (
                <li key={p.slug} className="flex gap-3 px-3 py-3">
                  <ProductThumb spec={p.visual} name={p.name} size="lg" />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/skincare/admin/products/${p.slug}`}
                      className="block font-medium text-stone-900"
                    >
                      {p.name}
                    </Link>
                    <p className="text-xs text-stone-500">{CATEGORIES[p.category].label}</p>
                    <p className="mt-1 text-sm text-stone-900 tabular-nums">
                      {priceRange(p, "price")}{" "}
                      <span className="text-xs text-stone-500 line-through">
                        {priceRange(p, "mrp")}
                      </span>
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs">
                      <ActiveSwitch product={p} />
                      <span className="text-stone-600 tabular-nums">
                        {formatNumber(totalStock(p))} in stock
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <ul
            className="grid gap-4 border-t border-stone-100 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            aria-label="Products"
          >
            {list.map((p) => (
              <li key={p.slug} className="overflow-hidden rounded-xl border border-stone-200">
                <Link
                  href={`/skincare/admin/products/${p.slug}`}
                  className="block focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-skin-accent"
                >
                  <div className="relative px-10 pt-4" style={{ background: p.visual.tint }}>
                    <ProductVisual spec={p.visual} name={p.name} />
                    {!p.active ? (
                      <span className="absolute top-3 left-3">
                        <Badge>Draft</Badge>
                      </span>
                    ) : null}
                  </div>
                  <div className="p-3.5">
                    <p className="truncate text-sm font-medium text-stone-900">{p.name}</p>
                    <p className="mt-0.5 text-sm text-stone-900 tabular-nums">
                      {priceRange(p, "price")}{" "}
                      <span className="text-xs text-stone-500 line-through">
                        {priceRange(p, "mrp")}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-stone-600 tabular-nums">
                      {formatNumber(totalStock(p))} in stock
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
